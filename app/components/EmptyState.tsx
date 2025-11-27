'use client';

interface EmptyStateProps {
    message?: string;
}

export default function EmptyState({ message = "Aucun produit trouvé pour cette catégorie." }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center border border-gray-200 m-4 bg-gray-50">
            <h3 className="text-xl font-serif text-gray-900 mb-2">Oups !</h3>
            <p className="text-gray-500 max-w-md mx-auto">{message}</p>
        </div>
    );
}
