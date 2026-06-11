'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { api, ApiClientError } from '@/lib/api-client';
import type {
  LocationSelectResult,
  ShippingCalculateResponse,
  ShippingFeeError,
} from '@/lib/types';
import ShippingInfoCard from './ShippingInfoCard';
import MapSearchBar from './MapSearchBar';

const LOME_CENTER: [number, number] = [6.1375, 1.2123];

interface DeliveryMapProps {
  vendorId: string;
  onLocationSelect: (result: LocationSelectResult) => void;
  onError?: (error: ShippingFeeError | null) => void;
  onCalculatingChange?: (isCalculating: boolean) => void;
  geolocateSignal?: number;
  fullscreen?: boolean;
}

function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => onSelect(e.latlng.lat, e.latlng.lng),
  });
  return null;
}

/** Expose l'instance Leaflet au parent via ref. */
function MapRefBinder({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
    return () => {
      mapRef.current = null;
    };
  }, [map, mapRef]);
  return null;
}

export default function DeliveryMap({
  vendorId,
  onLocationSelect,
  onError,
  onCalculatingChange,
  geolocateSignal,
  fullscreen = false,
}: DeliveryMapProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [successResult, setSuccessResult] = useState<LocationSelectResult['shippingResult'] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    });
  }, []);

  const calculateShipping = useCallback(
    async (lat: number, lng: number) => {
      setIsCalculating(true);
      onCalculatingChange?.(true);
      setSuccessResult(null);
      try {
        const { data } = await api.post<ShippingCalculateResponse>(
          '/api/store/shipping/calculate',
          { vendor_id: vendorId, client_lat: lat, client_lng: lng },
        );
        if (data.error) {
          onError?.(data.error);
        } else {
          onError?.(null);
          setSuccessResult(data);
          onLocationSelect({ lat, lng, shippingResult: data });
        }
      } catch (err) {
        const message =
          err instanceof ApiClientError
            ? err.message
            : 'Erreur lors du calcul des frais de livraison. Veuillez réessayer.';
        onError?.({
          code: 'SHIPPING_CONFIG_INVALID',
          message,
        });
      } finally {
        setIsCalculating(false);
        onCalculatingChange?.(false);
      }
    },
    [vendorId, onLocationSelect, onError, onCalculatingChange],
  );

  const selectPosition = useCallback(
    (lat: number, lng: number, flyToZoom?: number) => {
      setPosition([lat, lng]);
      if (flyToZoom != null) {
        mapRef.current?.flyTo([lat, lng], flyToZoom);
      }
      void calculateShipping(lat, lng);
    },
    [calculateShipping],
  );

  const handleSearchSelect = useCallback(
    (lat: number, lon: number) => {
      selectPosition(lat, lon, 14);
    },
    [selectPosition],
  );

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        selectPosition(latitude, longitude, 15);
      },
      () => {},
    );
  }, [selectPosition]);

  const lastSignal = useRef(geolocateSignal);
  useEffect(() => {
    if (geolocateSignal === undefined) return;
    if (geolocateSignal !== lastSignal.current) {
      lastSignal.current = geolocateSignal;
      handleGeolocate();
    }
  }, [geolocateSignal, handleGeolocate]);

  const markerEventHandlers = {
    dragend: (e: L.DragEndEvent) => {
      const marker = e.target as L.Marker;
      const { lat, lng } = marker.getLatLng();
      selectPosition(lat, lng);
    },
  };

  const mapHeight = fullscreen ? 'calc(100vh - 62px)' : '380px';

  return (
    <div className="relative w-full h-full" style={{ height: mapHeight }}>
      {/* Barre de recherche — décalée après les contrôles zoom Leaflet (≈46px) */}
      <div
        className={[
          'absolute top-3 sm:top-4 z-[1000] pointer-events-auto',
          /* left: zoom + marge · right: bord carte (ou bouton flèche mobile) · max-w pour ne pas traverser la colonne */
          'left-[3.25rem] sm:left-14',
          fullscreen
            ? 'right-4 max-lg:right-[4.25rem] lg:max-w-md xl:max-w-lg'
            : 'right-4 max-w-md',
        ].join(' ')}
      >
        <MapSearchBar onSelect={handleSearchSelect} />
      </div>

      <div className="absolute inset-0">
        <MapContainer center={LOME_CENTER} zoom={8} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapRefBinder mapRef={mapRef} />
          <MapClickHandler onSelect={(lat, lng) => selectPosition(lat, lng)} />
          {position && (
            <Marker position={position} draggable eventHandlers={markerEventHandlers} />
          )}
        </MapContainer>
      </div>

      {/* Overlay bas de carte : chargement ou carte d'infos */}
      {(isCalculating || successResult) && (
        <div
          className={[
            'absolute bottom-0 left-0 z-[500] p-4 pointer-events-none',
            fullscreen ? 'right-20 lg:right-0' : 'right-0',
          ].join(' ')}
        >
          {isCalculating && (
            <div className="pointer-events-auto bg-white/95 rounded-lg shadow-md border border-[#EBEBEB] px-4 py-3 text-sm text-[#666] flex items-center gap-2">
              <Loader2 size={16} className="animate-spin shrink-0 text-[#1A1A1A]" />
              Calcul des frais en cours…
            </div>
          )}

          {!isCalculating && successResult && (
            <ShippingInfoCard
              result={successResult}
              onClose={() => setSuccessResult(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
