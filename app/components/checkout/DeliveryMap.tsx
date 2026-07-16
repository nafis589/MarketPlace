'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, LocateFixed, Minus, Plus } from 'lucide-react';
import { ApiClientError } from '@/lib/api-client';
import type { ApiError } from '@/lib/types';
import type {
  LocationSelectResult,
  ShippingCalculateResponse,
  ShippingFeeError,
  CartShippingCalculateResult,
} from '@/lib/types';
import CartShippingSummaryCard from './CartShippingSummaryCard';
import MapSearchBar from './MapSearchBar';

const LOME_CENTER: [number, number] = [6.1375, 1.2123];

interface ValidateLocationResponse {
  data: {
    isInTogo: boolean;
    region?: { id: string; name: string; capital: string };
  };
}

interface DeliveryMapProps {
  onLocationSelect: (result: LocationSelectResult) => void;
  onError?: (error: ShippingFeeError | null) => void;
  onCalculatingChange?: (isCalculating: boolean) => void;
  onGeolocatingChange?: (isGeolocating: boolean) => void;
  geolocateSignal?: number;
  fullscreen?: boolean;
}

function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => onSelect(e.latlng.lat, e.latlng.lng),
  });
  return null;
}

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
  onLocationSelect,
  onError,
  onCalculatingChange,
  onGeolocatingChange,
  geolocateSignal,
  fullscreen = false,
}: DeliveryMapProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [successResult, setSuccessResult] = useState<CartShippingCalculateResult | null>(null);
  const [isOutsideTogo, setIsOutsideTogo] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const mapRef = useRef<L.Map | null>(null);

  async function shippingPost<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`/api/shipping${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as T | ApiError;
    if (!res.ok) {
      const err = json as ApiError;
      throw new ApiClientError(
        err.error?.code ?? 'UNKNOWN_ERROR',
        err.error?.message ?? 'Erreur serveur',
        res.status,
      );
    }
    return json as T;
  }

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
      setPanelOpen(true);
      onCalculatingChange?.(true);
      setSuccessResult(null);
      setIsOutsideTogo(false);

      try {
        const [{ data: shippingData }, { data: locationData }] = await Promise.all([
          shippingPost<ShippingCalculateResponse>('/calculate', {
            client_lat: lat,
            client_lng: lng,
          }),
          shippingPost<ValidateLocationResponse>('/validate-location', {
            lat,
            lng,
          }),
        ]);

        const regionId = locationData.region?.id ?? null;
        const outsideTogo =
          !locationData.isInTogo ||
          (shippingData.vendors.length > 0 &&
            shippingData.vendors.every(
              (v) => v.shipping.error?.code === 'LOCATION_OUTSIDE_TOGO',
            ));

        setIsOutsideTogo(outsideTogo);
        setSuccessResult(outsideTogo ? null : shippingData);

        if (outsideTogo || !shippingData.summary.can_checkout) {
          const blockedMessage = outsideTogo
            ? 'Votre position est hors du Togo.'
            : (shippingData.vendors.find((v) => v.shipping.error)?.shipping.error?.message ??
              'Aucun vendeur ne peut livrer à cette adresse.');
          onError?.({
            code: outsideTogo ? 'LOCATION_OUTSIDE_TOGO' : 'REGION_NOT_COVERED',
            message: blockedMessage,
          });
        } else {
          onError?.(null);
        }

        onLocationSelect({
          lat,
          lng,
          shipping: shippingData,
          regionId,
        });
      } catch (err) {
        setPanelOpen(false);
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
    [onLocationSelect, onError, onCalculatingChange],
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
    setIsGeolocating(true);
    onGeolocatingChange?.(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        selectPosition(latitude, longitude, 15);
        setIsGeolocating(false);
        onGeolocatingChange?.(false);
      },
      () => {
        setIsGeolocating(false);
        onGeolocatingChange?.(false);
      },
    );
  }, [selectPosition, onGeolocatingChange]);

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
  const showPanel = panelOpen && (isCalculating || isOutsideTogo || successResult);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ height: mapHeight }}>
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center gap-2 pointer-events-none">
        <div className="pointer-events-auto min-w-0 flex-1 max-w-md">
          <MapSearchBar onSelect={handleSearchSelect} />
        </div>
      </div>

      <div className="absolute right-3 top-3 z-[1200] flex flex-col gap-2">
        <button
          type="button"
          onClick={handleGeolocate}
          disabled={isGeolocating}
          className="flex size-10 items-center justify-center rounded-sm border border-[#D5D5D5] bg-white text-[#1A1A1A] shadow-sm transition-colors hover:bg-[#F5F5F5] disabled:cursor-wait disabled:opacity-70"
          aria-label="Ma position actuelle"
        >
          {isGeolocating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LocateFixed className="size-4" strokeWidth={2} />
          )}
        </button>

        <div className="flex flex-col overflow-hidden rounded-sm border border-[#D5D5D5] bg-white shadow-sm">
          <button
            type="button"
            onClick={() => mapRef.current?.zoomIn()}
            className="flex size-10 items-center justify-center text-[#1A1A1A] transition-colors hover:bg-[#F5F5F5]"
            aria-label="Zoom avant"
          >
            <Plus className="size-4" />
          </button>
          <div className="h-px bg-[#E5E5E5]" />
          <button
            type="button"
            onClick={() => mapRef.current?.zoomOut()}
            className="flex size-10 items-center justify-center text-[#1A1A1A] transition-colors hover:bg-[#F5F5F5]"
            aria-label="Zoom arrière"
          >
            <Minus className="size-4" />
          </button>
        </div>
      </div>

      <div className="absolute inset-0">
        <MapContainer
          center={LOME_CENTER}
          zoom={8}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
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

      {showPanel && (
        <div className="absolute bottom-3 left-3 right-16 z-[500] flex max-h-[45%] flex-col justify-end pointer-events-none">
          <CartShippingSummaryCard
            result={successResult}
            isCalculating={isCalculating}
            isOutsideTogo={isOutsideTogo}
            onClose={() => setPanelOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
