import { useState } from 'react';

export const useCleanImage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cleanImage = async (imageUrl: string): Promise<string | null> => {
        setLoading(true);
        setError(null);

        try {
            // Note: In production, you might want to proxy this through your Next.js API routes 
            // to hide the API key or use the same backend URL if accessible.
            // For now, we assume the backend is accessible or proxied.
            const response = await fetch('http://localhost:3001/api/images/remove-bg-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'your_internal_secret_key' // Ideally use env var NEXT_PUBLIC_...
                },
                body: JSON.stringify({ imageUrl }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to clean image');
            }

            return data.cleanImageBase64;
        } catch (err: any) {
            setError(err.message);
            console.error('Error cleaning image:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { cleanImage, loading, error };
};
