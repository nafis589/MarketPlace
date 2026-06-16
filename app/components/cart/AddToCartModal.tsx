'use client';

import React from 'react';

interface AddToCartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/** @deprecated Remplacé par le toast « Ajouté au panier ✓ » */
const AddToCartModal: React.FC<AddToCartModalProps> = () => null;

export default AddToCartModal;
