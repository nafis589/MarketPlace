'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { Loader2, AlertCircle } from 'lucide-react';

interface CardPaymentFormProps {
  orderId: string;
  totalAmount: number;
  onPaymentSuccess: () => void;
  onPaymentError: (message: string) => void;
}

export function CardPaymentForm({
  orderId,
  totalAmount,
  onPaymentSuccess,
  onPaymentError,
}: CardPaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingIntent, setIsLoadingIntent] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const fetchStarted = useRef(false);

  // Detect placeholder/missing publishable key early
  const pubKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
  const isKeyValid = pubKey.startsWith('pk_test_') && pubKey.length > 20 && !pubKey.includes('xxxx');

  useEffect(() => {
    isMounted.current = true;
    if (fetchStarted.current) return;
    fetchStarted.current = true;
    setIsLoadingIntent(true);
    setInitError(null);

    fetch('/api/payment/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ order_id: orderId }),
    })
      .then(async (r) => {
        const res = await r.json();
        if (!isMounted.current) return;
        if (r.ok && res?.data?.clientSecret) {
          setClientSecret(res.data.clientSecret);
        } else {
          const msg = res?.error?.message || res?.message || "Impossible d'initialiser le paiement.";
          setInitError(msg);
          onPaymentError(msg);
        }
      })
      .catch(() => {
        if (!isMounted.current) return;
        const msg = "Erreur réseau — impossible de contacter le serveur.";
        setInitError(msg);
        onPaymentError(msg);
      })
      .finally(() => {
        if (isMounted.current) setIsLoadingIntent(false);
      });

    return () => { isMounted.current = false; };
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isKeyValid) {
    return (
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 text-sm text-amber-800">
        <AlertCircle size={16} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Clé Stripe non configurée</p>
          <p className="mt-0.5 text-xs">Ajoutez votre <strong>clé publique de test</strong> dans <code className="bg-amber-100 px-1 rounded">.env.local</code> :<br/>
          <code className="bg-amber-100 px-1 rounded text-[11px]">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51…</code><br/>
          Disponible sur <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noreferrer" className="underline">dashboard.stripe.com/test/apikeys</a>, puis relancez le serveur Next.js.</p>
        </div>
      </div>
    );
  }

  if (isLoadingIntent) {
    return (
      <div className="flex items-center justify-center gap-2 py-6 text-[#666] text-sm">
        <Loader2 size={16} className="animate-spin" />
        <span>Préparation du paiement…</span>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
        <AlertCircle size={16} className="shrink-0 mt-0.5" />
        <span>{initError}</span>
      </div>
    );
  }

  if (!clientSecret) return null;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#1A1A1A',
            colorBackground: '#ffffff',
            colorText: '#1A1A1A',
            fontFamily: 'inherit',
            borderRadius: '12px',
          },
        },
        locale: 'fr',
      }}
    >
      <CheckoutForm
        orderId={orderId}
        totalAmount={totalAmount}
        onSuccess={onPaymentSuccess}
        onError={onPaymentError}
      />
    </Elements>
  );
}

function CheckoutForm({
  orderId,
  totalAmount,
  onSuccess,
  onError,
}: {
  orderId: string;
  totalAmount: number;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [elementError, setElementError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !isReady) return;

    setIsProcessing(true);
    setElementError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      const msg = error.message ?? 'Le paiement a échoué. Vérifiez vos informations.';
      setElementError(msg);
      onError(msg);
      setIsProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      // Sync payment status in DB immediately (webhooks don't work on localhost)
      try {
        await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ 
            order_id: orderId,
            payment_intent_id: paymentIntent.id
          }),
        });
      } catch {
        // Even if this fails, the webhook will eventually update it
      }
      onSuccess();
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 mt-3">
      <div className="min-h-[120px]">
        <PaymentElement
          onReady={() => setIsReady(true)}
          onLoadError={(e) => {
            const msg = "Impossible de charger le formulaire de paiement.";
            setElementError(msg);
            console.error("PaymentElement load error:", e);
          }}
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {elementError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm text-red-700">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{elementError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !isReady || isProcessing}
        className="w-full bg-black text-white py-3.5 rounded-xl font-semibold text-[15px] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Paiement en cours…
          </>
        ) : (
          `Payer ${totalAmount.toLocaleString('fr-FR')} FCFA`
        )}
      </button>
    </form>
  );
}
