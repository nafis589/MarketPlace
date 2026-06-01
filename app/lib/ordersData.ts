// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentStatus = 'Payé' | 'En attente' | 'Remboursé';
export type OrderStatus   = 'Livré' | 'En transit' | 'En attente' | 'Annulé';

export interface OrderItem {
    id: string;
    name: string;
    image: string;
    productId: string;
    size: string;
    quantity: number;
    unitPrice: number;
}

export interface Order {
    id: string;
    trackingNumber: string;
    itemName: string;
    itemImage: string;
    category: string;
    payment: PaymentStatus;
    from: string;
    to: string;
    date: string;
    deliveredDate?: string;
    status: OrderStatus;
    total: number;
    shipping: number;
    discount: number;
    items: OrderItem[];
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

export const ORDERS: Order[] = [
    {
        id: 'CMD-20240001', trackingNumber: '#1025400001',
        itemName: 'Robe Midi Jacquemus', itemImage: '👗', category: 'Mode Femme',
        payment: 'Payé', from: 'Paris', to: 'Lyon',
        date: '2024-02-15', deliveredDate: '2024-02-18', status: 'Livré',
        shipping: 0, discount: 30, total: 349.00,
        items: [
            { id: 'i1', name: 'Robe Midi Jacquemus La Robe Saudade', image: '👗', productId: '4553418120', size: 'S', quantity: 1, unitPrice: 349.00 },
        ],
    },
    {
        id: 'CMD-20240002', trackingNumber: '#1025400002',
        itemName: 'Sac Chanel Classique', itemImage: '👜', category: 'Sacs',
        payment: 'Payé', from: 'Paris', to: 'Bordeaux',
        date: '2024-02-16', deliveredDate: '2024-02-20', status: 'Livré',
        shipping: 0, discount: 0, total: 2890.00,
        items: [
            { id: 'i1', name: 'Sac Chanel Classique Caviar Noir', image: '👜', productId: '8953412747', size: 'Unique', quantity: 1, unitPrice: 2890.00 },
        ],
    },
    {
        id: 'CMD-20240003', trackingNumber: '#1025400003',
        itemName: 'Veste Blazer Ami Paris', itemImage: '🧥', category: 'Mode Homme',
        payment: 'En attente', from: 'Paris', to: 'Marseille',
        date: '2024-02-17', status: 'En attente',
        shipping: 8, discount: 0, total: 420.00,
        items: [
            { id: 'i1', name: 'Veste Blazer Ami Paris de Cœur', image: '🧥', productId: '3312458323', size: 'M', quantity: 1, unitPrice: 412.00 },
        ],
    },
    {
        id: 'CMD-20240004', trackingNumber: '#1025400004',
        itemName: 'Sneakers Balenciaga Track', itemImage: '👟', category: 'Chaussures',
        payment: 'Payé', from: 'Paris', to: 'Toulouse',
        date: '2024-02-18', status: 'En transit',
        shipping: 0, discount: 0, total: 680.00,
        items: [
            { id: 'i1', name: 'Sneakers Balenciaga Track 2', image: '👟', productId: '7712458001', size: '42', quantity: 1, unitPrice: 680.00 },
        ],
    },
    {
        id: 'CMD-20240005', trackingNumber: '#1025400005',
        itemName: 'Montre Cartier Santos', itemImage: '⌚', category: 'Bijoux',
        payment: 'Payé', from: 'Paris', to: 'Nice',
        date: '2024-02-19', deliveredDate: '2024-02-22', status: 'Livré',
        shipping: 0, discount: 200, total: 4200.00,
        items: [
            { id: 'i1', name: 'Montre Cartier Santos Medium Acier', image: '⌚', productId: '9912458777', size: 'Unique', quantity: 1, unitPrice: 4400.00 },
        ],
    },
    {
        id: 'CMD-20240006', trackingNumber: '#1025400006',
        itemName: 'Pull Cashmere Loro Piana', itemImage: '🧣', category: 'Mode Femme',
        payment: 'Payé', from: 'Paris', to: 'Nantes',
        date: '2024-02-20', deliveredDate: '2024-02-23', status: 'Livré',
        shipping: 0, discount: 0, total: 890.00,
        items: [
            { id: 'i1', name: 'Pull Col Rond Cashmere Loro Piana', image: '🧣', productId: '5512458111', size: 'M', quantity: 1, unitPrice: 890.00 },
        ],
    },
    {
        id: 'CMD-20240007', trackingNumber: '#1025400007',
        itemName: 'Ceinture Hermès H', itemImage: '👔', category: 'Accessoires',
        payment: 'En attente', from: 'Paris', to: 'Strasbourg',
        date: '2024-02-21', status: 'En attente',
        shipping: 8, discount: 0, total: 650.00,
        items: [
            { id: 'i1', name: 'Ceinture Hermès H Réversible 32mm', image: '👔', productId: '6612458222', size: '80', quantity: 1, unitPrice: 642.00 },
        ],
    },
    {
        id: 'CMD-20240008', trackingNumber: '#1025400008',
        itemName: 'Manteau Max Mara Camel', itemImage: '🧥', category: 'Mode Femme',
        payment: 'Payé', from: 'Paris', to: 'Lille',
        date: '2024-02-22', status: 'En transit',
        shipping: 0, discount: 60, total: 1340.00,
        items: [
            { id: 'i1', name: 'Manteau 101801 Max Mara Camel', image: '🧥', productId: '2212458444', size: '38', quantity: 1, unitPrice: 1400.00 },
        ],
    },
    {
        id: 'CMD-20240009', trackingNumber: '#1025400009',
        itemName: 'Jean Slim Acne Studios', itemImage: '👖', category: 'Mode Homme',
        payment: 'Payé', from: 'Paris', to: 'Rennes',
        date: '2024-02-23', deliveredDate: '2024-02-26', status: 'Livré',
        shipping: 0, discount: 0, total: 230.00,
        items: [
            { id: 'i1', name: 'Jean Slim Fit Acne Studios Blondie', image: '👖', productId: '1112458555', size: '30/32', quantity: 1, unitPrice: 230.00 },
        ],
    },
    {
        id: 'CMD-20240010', trackingNumber: '#1025400010',
        itemName: 'Loafers Gucci Horsebit', itemImage: '👞', category: 'Chaussures',
        payment: 'Remboursé', from: 'Paris', to: 'Montpellier',
        date: '2024-02-24', status: 'Annulé',
        shipping: 0, discount: 0, total: 780.00,
        items: [
            { id: 'i1', name: 'Loafers Horsebit Gucci Cuir Noir', image: '👞', productId: '4412458666', size: '41', quantity: 1, unitPrice: 780.00 },
        ],
    },
    {
        id: 'CMD-20240011', trackingNumber: '#1025400011',
        itemName: 'Robe Slip Silk Co', itemImage: '👗', category: 'Mode Femme',
        payment: 'Payé', from: 'Paris', to: 'Dijon',
        date: '2024-02-25', deliveredDate: '2024-02-28', status: 'Livré',
        shipping: 0, discount: 0, total: 190.00,
        items: [
            { id: 'i1', name: 'Robe Slip Satin Silk Co Ivoire', image: '👗', productId: '3312458888', size: 'XS', quantity: 1, unitPrice: 190.00 },
        ],
    },
    {
        id: 'CMD-20240012', trackingNumber: '#1025400012',
        itemName: 'Parfum Maison Margiela', itemImage: '🌸', category: 'Beauté',
        payment: 'Payé', from: 'Paris', to: 'Grenoble',
        date: '2024-02-26', deliveredDate: '2024-02-29', status: 'Livré',
        shipping: 0, discount: 0, total: 280.00,
        items: [
            { id: 'i1', name: 'Replica Beach Walk Maison Margiela 100ml', image: '🌸', productId: '2212458999', size: '100ml', quantity: 1, unitPrice: 280.00 },
        ],
    },
    {
        id: 'CMD-20240013', trackingNumber: '#1025400013',
        itemName: 'Écharpe Acne Studios', itemImage: '🧣', category: 'Accessoires',
        payment: 'En attente', from: 'Paris', to: 'Rouen',
        date: '2024-02-27', status: 'En transit',
        shipping: 8, discount: 0, total: 210.00,
        items: [
            { id: 'i1', name: 'Écharpe Laine Mohair Acne Studios Rose', image: '🧣', productId: '1112459000', size: 'Unique', quantity: 1, unitPrice: 202.00 },
        ],
    },
    {
        id: 'CMD-20240014', trackingNumber: '#1025400014',
        itemName: 'Lunettes Céline Triomphe', itemImage: '🕶️', category: 'Accessoires',
        payment: 'Payé', from: 'Paris', to: 'Reims',
        date: '2024-02-28', deliveredDate: '2024-03-02', status: 'Livré',
        shipping: 0, discount: 0, total: 420.00,
        items: [
            { id: 'i1', name: 'Lunettes Triomphe Céline Acetate Noir', image: '🕶️', productId: '9912459111', size: 'Unique', quantity: 1, unitPrice: 420.00 },
        ],
    },
    {
        id: 'CMD-20240015', trackingNumber: '#1025400015',
        itemName: 'Bottines Isabel Marant', itemImage: '👢', category: 'Chaussures',
        payment: 'Payé', from: 'Paris', to: 'Toulon',
        date: '2024-03-01', deliveredDate: '2024-03-04', status: 'Livré',
        shipping: 0, discount: 0, total: 510.00,
        items: [
            { id: 'i1', name: 'Bottines Dicker Isabel Marant Cuir Fauve', image: '👢', productId: '8812459222', size: '38', quantity: 1, unitPrice: 510.00 },
        ],
    },
    {
        id: 'CMD-20240016', trackingNumber: '#1025400016',
        itemName: 'Chemise Ami de Cœur', itemImage: '👔', category: 'Mode Homme',
        payment: 'Payé', from: 'Paris', to: 'Angers',
        date: '2024-03-02', status: 'En transit',
        shipping: 0, discount: 0, total: 190.00,
        items: [
            { id: 'i1', name: 'Chemise Oversize de Cœur Ami Paris Blanc', image: '👔', productId: '7712459333', size: 'L', quantity: 1, unitPrice: 190.00 },
        ],
    },
    {
        id: 'CMD-20240017', trackingNumber: '#1025400017',
        itemName: 'Clutch Prada Tessuto', itemImage: '👛', category: 'Sacs',
        payment: 'Remboursé', from: 'Paris', to: 'Metz',
        date: '2024-03-03', status: 'Annulé',
        shipping: 0, discount: 0, total: 840.00,
        items: [
            { id: 'i1', name: 'Clutch Tessuto Prada Nylon Noir', image: '👛', productId: '6612459444', size: 'Unique', quantity: 1, unitPrice: 840.00 },
        ],
    },
    {
        id: 'CMD-20240018', trackingNumber: '#1025400018',
        itemName: 'Veste Cuir Saint Laurent', itemImage: '🧥', category: 'Mode Femme',
        payment: 'Payé', from: 'Paris', to: 'Caen',
        date: '2024-03-04', deliveredDate: '2024-03-07', status: 'Livré',
        shipping: 0, discount: 0, total: 1890.00,
        items: [
            { id: 'i1', name: 'Veste Perfecto Cuir Saint Laurent Noir', image: '🧥', productId: '5512459555', size: '36', quantity: 1, unitPrice: 1890.00 },
        ],
    },
];
