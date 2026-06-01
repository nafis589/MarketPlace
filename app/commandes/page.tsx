'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Calendar,
    Package,
} from 'lucide-react';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import { ORDERS, type Order, type PaymentStatus, type OrderStatus } from '@/app/lib/ordersData';

const ITEMS_PER_PAGE = 14;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
    return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

function formatDate(s: string) {
    return new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

function paymentBadge(p: PaymentStatus) {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (p) {
        case 'Payé':       return <span className={`${base} bg-green-100 text-green-700`}>{p}</span>;
        case 'En attente': return <span className={`${base} bg-amber-100 text-amber-700`}>{p}</span>;
        case 'Remboursé':  return <span className={`${base} bg-gray-100 text-gray-600`}>{p}</span>;
    }
}

function statusBadge(s: OrderStatus) {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (s) {
        case 'Livré':      return <span className={`${base} bg-green-100 text-green-700`}>{s}</span>;
        case 'En transit': return <span className={`${base} bg-blue-100 text-blue-700`}>{s}</span>;
        case 'En attente': return <span className={`${base} bg-amber-100 text-amber-700`}>{s}</span>;
        case 'Annulé':     return <span className={`${base} bg-red-100 text-red-600`}>{s}</span>;
    }
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = 'Toutes' | 'En cours' | 'En transit' | 'Livrées' | 'Annulées';
const TABS: Tab[] = ['Toutes', 'En cours', 'En transit', 'Livrées', 'Annulées'];

function tabFilter(orders: Order[], tab: Tab): Order[] {
    switch (tab) {
        case 'En cours':   return orders.filter(o => o.status === 'En attente');
        case 'En transit': return orders.filter(o => o.status === 'En transit');
        case 'Livrées':    return orders.filter(o => o.status === 'Livré');
        case 'Annulées':   return orders.filter(o => o.status === 'Annulé');
        default:           return orders;
    }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommandesPage() {
    const [activeTab, setActiveTab] = useState<Tab>('Toutes');
    const [search, setSearch]       = useState('');
    const [page, setPage]           = useState(1);
    const [selected, setSelected]   = useState<Set<string>>(new Set());
    const [sortField, setSortField] = useState<keyof Order | null>(null);
    const [sortDir, setSortDir]     = useState<'asc' | 'desc'>('asc');

    const filtered = useMemo(() => {
        let list = tabFilter(ORDERS, activeTab);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(o =>
                o.itemName.toLowerCase().includes(q) ||
                o.id.toLowerCase().includes(q) ||
                o.category.toLowerCase().includes(q)
            );
        }
        if (sortField) {
            list = [...list].sort((a, b) => {
                const av = a[sortField] as string | number;
                const bv = b[sortField] as string | number;
                if (av < bv) return sortDir === 'asc' ? -1 : 1;
                if (av > bv) return sortDir === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return list;
    }, [activeTab, search, sortField, sortDir]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paged      = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    function toggleSort(field: keyof Order) {
        if (sortField === field) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    }

    function toggleSelect(id: string) {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    function toggleAll() {
        if (paged.every(o => selected.has(o.id))) {
            setSelected(prev => {
                const next = new Set(prev);
                paged.forEach(o => next.delete(o.id));
                return next;
            });
        } else {
            setSelected(prev => {
                const next = new Set(prev);
                paged.forEach(o => next.add(o.id));
                return next;
            });
        }
    }

    const allSelectedOnPage = paged.length > 0 && paged.every(o => selected.has(o.id));

    const pageRange = useMemo(() => {
        const range: (number | '…')[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) range.push(i);
        } else {
            range.push(1);
            if (page > 3) range.push('…');
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) range.push(i);
            if (page < totalPages - 2) range.push('…');
            range.push(totalPages);
        }
        return range;
    }, [page, totalPages]);

    return (
        <main>
            <Header />

            <div className="pt-[100px] md:pt-[120px] min-h-screen bg-white">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">

                    {/* ── Breadcrumb ── */}
                    <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                        <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
                        <span>/</span>
                        <span className="text-black font-medium">Mes commandes</span>
                    </nav>

                    {/* ── Page header ── */}
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-serif font-medium tracking-tight">
                            Mes commandes
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {ORDERS.length} commandes au total
                        </p>
                    </div>

                    {/* ── Tabs ── */}
                    <div className="border-b border-gray-200 mb-6">
                        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
                            {TABS.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(tab); setPage(1); }}
                                    className={`
                                        flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                                        ${activeTab === tab
                                            ? 'border-black text-black'
                                            : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                                        }
                                    `}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Toolbar ── */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
                        <div className="relative flex-1 sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher une commande..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            Janv. – Mars 2024
                            <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-400 flex-shrink-0" />
                        </button>
                    </div>

                    {/* ── Desktop Table ── */}
                    <div className="hidden md:block border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="w-10 px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={allSelectedOnPage}
                                            onChange={toggleAll}
                                            className="rounded border-gray-300 accent-black"
                                        />
                                    </th>
                                    {[
                                        { label: 'N° commande', field: 'id'       as keyof Order },
                                        { label: 'Article',     field: 'itemName' as keyof Order },
                                        { label: 'Catégorie',   field: 'category' as keyof Order },
                                        { label: 'Paiement',    field: 'payment'  as keyof Order },
                                        { label: 'Expédition',  field: null },
                                        { label: 'Date',        field: 'date'     as keyof Order },
                                        { label: 'Statut',      field: 'status'   as keyof Order },
                                        { label: 'Total',       field: 'total'    as keyof Order },
                                    ].map(col => (
                                        <th key={col.label} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            {col.field ? (
                                                <button
                                                    onClick={() => col.field && toggleSort(col.field)}
                                                    className="flex items-center gap-1 hover:text-black transition-colors"
                                                >
                                                    {col.label}
                                                    <ArrowUpDown className="w-3 h-3" />
                                                </button>
                                            ) : col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paged.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-16 text-gray-400">
                                            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                            <p className="text-sm">Aucune commande trouvée</p>
                                        </td>
                                    </tr>
                                ) : paged.map(order => (
                                    <tr
                                        key={order.id}
                                        className={`group hover:bg-gray-50 transition-colors cursor-pointer ${selected.has(order.id) ? 'bg-gray-50' : ''}`}
                                    >
                                        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selected.has(order.id)}
                                                onChange={() => toggleSelect(order.id)}
                                                className="rounded border-gray-300 accent-black"
                                            />
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <Link href={`/commandes/${order.id}`} className="block font-mono text-xs text-gray-500 whitespace-nowrap hover:text-black transition-colors">
                                                {order.id}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <Link href={`/commandes/${order.id}`} className="flex items-center gap-3 group-hover:opacity-80 transition-opacity">
                                                <span className="text-xl leading-none">{order.itemImage}</span>
                                                <span className="font-medium text-black leading-tight">{order.itemName}</span>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3.5 text-gray-600">
                                            <Link href={`/commandes/${order.id}`} className="block">{order.category}</Link>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <Link href={`/commandes/${order.id}`} className="block">{paymentBadge(order.payment)}</Link>
                                        </td>
                                        <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap text-xs">
                                            <Link href={`/commandes/${order.id}`} className="block">{order.from} → {order.to}</Link>
                                        </td>
                                        <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap text-xs">
                                            <Link href={`/commandes/${order.id}`} className="block">{formatDate(order.date)}</Link>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <Link href={`/commandes/${order.id}`} className="block">{statusBadge(order.status)}</Link>
                                        </td>
                                        <td className="px-4 py-3.5 font-semibold text-black whitespace-nowrap">
                                            <Link href={`/commandes/${order.id}`} className="block">{formatPrice(order.total)}</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile Card List ── */}
                    <div className="flex md:hidden flex-col divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                        {paged.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">Aucune commande trouvée</p>
                            </div>
                        ) : paged.map(order => (
                            <div key={order.id} className="flex items-start gap-3 px-4 py-4 bg-white hover:bg-gray-50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={selected.has(order.id)}
                                    onChange={() => toggleSelect(order.id)}
                                    className="mt-1 rounded border-gray-300 accent-black flex-shrink-0"
                                />
                                <Link href={`/commandes/${order.id}`} className="flex items-start gap-3 flex-1 min-w-0">
                                    <span className="text-2xl leading-none mt-0.5 flex-shrink-0">{order.itemImage}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p className="font-medium text-sm leading-snug line-clamp-1">{order.itemName}</p>
                                            <span className="font-semibold text-sm whitespace-nowrap">{formatPrice(order.total)}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">{order.id} · {order.category}</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {statusBadge(order.status)}
                                            {paymentBadge(order.payment)}
                                            <span className="text-xs text-gray-400">{formatDate(order.date)}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* ── Pagination ── */}
                    {filtered.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                            <p className="text-sm text-gray-500 order-2 sm:order-1">
                                {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} sur {filtered.length} commande{filtered.length > 1 ? 's' : ''}
                            </p>
                            <div className="flex items-center gap-1 order-1 sm:order-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                {pageRange.map((p, i) =>
                                    p === '…' ? (
                                        <span key={`ell-${i}`} className="px-2 text-gray-400 text-sm select-none">…</span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p as number)}
                                            className={`
                                                min-w-[36px] h-9 rounded-lg text-sm font-medium border transition-colors
                                                ${page === p
                                                    ? 'bg-black text-white border-black'
                                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
