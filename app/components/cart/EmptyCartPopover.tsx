'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface EmptyCartPopoverProps {
    isOpen: boolean;
    onClose?: () => void;
}

const EmptyCartPopover: React.FC<EmptyCartPopoverProps> = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute right-0 top-full mt-2 z-50">

            {/* 
        Le triangle (flèche) du popover 
        Positionné en haut à droite pour correspondre aux standards de ce type d'UI
      */}
            <div className="absolute -top-2 right-6 z-20 h-4 w-4 rotate-45 border-l border-t border-gray-100 bg-white" />

            {/* Conteneur principal du Popover */}
            <div className="relative z-10 w-full min-w-[300px] max-w-sm rounded-sm border border-gray-100 bg-white shadow-xl sm:w-[350px]">

                {/* Zone de contenu avec padding blanc */}
                <div className="p-4">

                    {/* La boîte grise intérieure */}
                    <div className="flex flex-col items-center justify-center bg-[#F6F7F9] px-6 py-10 text-center">

                        {/* Construction de l'icône Sac + V */}
                        <div className="relative mb-4 flex items-center justify-center text-gray-600">
                            {/* Icône du sac */}
                            <ShoppingBag
                                size={42}
                                strokeWidth={1.5}
                                className="text-gray-500"
                            />

                            {/* Le "V." positionné au centre du sac */}
                            <span className="absolute mt-2 font-serif text-sm font-bold text-gray-700">
                                V.
                            </span>
                        </div>

                        {/* Texte */}
                        <div className="space-y-1">
                            <p className="text-base text-gray-600 font-normal">
                                Votre panier est vide ...
                            </p>
                            <p className="text-base text-gray-600 font-normal">
                                mais pas pour longtemps !
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmptyCartPopover;
