'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

interface AddToCartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ isOpen, onClose }) => {
    const { lastAddedItem } = useCart();

    if (!isOpen || !lastAddedItem) return null;

    const productData = lastAddedItem;

    return (
        // Overlay: Transparent sur PC (simulé par flex centré), Full screen sur mobile
        <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-[2px] transition-all">

            {/* Conteneur Modale */}
            <div className="relative w-full bg-white shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 sm:w-[600px] sm:rounded-none sm:border sm:border-gray-200">

                {/* Bouton Fermer */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-black transition-colors"
                >
                    <X size={24} strokeWidth={1} />
                </button>

                <div className="p-6 md:p-10">

                    {/* Titre */}
                    <h2 className="mb-6 pr-8 text-left font-serif text-xl leading-tight text-gray-900 md:text-center md:text-2xl">
                        Cet article a bien été ajouté à votre panier
                    </h2>

                    {/* Séparateur */}
                    <div className="mb-6 h-px w-full bg-gray-100" />

                    {/* Produit */}
                    <div className="flex gap-4 mb-6">
                        <div className="h-24 w-20 shrink-0 bg-gray-50">
                            <img
                                src={productData.image}
                                alt={productData.brand}
                                className="h-full w-full object-cover mix-blend-multiply"
                            />
                        </div>

                        <div className="flex flex-1 flex-col justify-center sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900 uppercase text-sm">{productData.brand}</h3>
                                <p className="text-sm text-gray-500">{productData.type}</p>
                            </div>
                            <div className="mt-1 sm:mt-0 font-bold text-gray-900 text-sm">
                                ${productData.price}
                            </div>
                        </div>
                    </div>

                    {/* Séparateur Bas (Desktop uniquement) */}
                    <div className="mb-8 hidden h-px w-full bg-gray-100 md:block" />

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 md:flex-row md:gap-4">
                        <button
                            onClick={onClose}
                            className="w-full border border-black bg-white py-3 text-sm font-medium text-black transition-colors hover:bg-gray-50"
                        >
                            Continuer mes achats
                        </button>
                        <button className="w-full border border-black bg-black py-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
                            Finaliser la commande
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddToCartModal;
