'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

import type { ProductFiltersData } from '@/app/lib/productsClient';
import { COLOR_HEX, SORT_OPTIONS } from '@/app/lib/filterLabels';

interface ProductFilterControlsProps {
  getFilter: (key: string) => string | null;
  setFilter: (key: string, value: string | null) => void;
  setFilters: (updates: Record<string, string | null>) => void;
  resetFilters: () => void;
  currentSort: string;
  searchParamsKey: string;
  filterOptions: ProductFiltersData | null;
}

interface FilterDropdownProps {
  label: string;
  active?: boolean;
  width?: number;
  children: (close: () => void) => React.ReactNode;
}

function FilterDropdown({ label, active = false, width = 288, children }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const update = () => {
      const rect = btnRef.current?.getBoundingClientRect();
      if (!rect) return;
      const left = Math.min(rect.left, window.innerWidth - width - 12);
      setCoords({ top: rect.bottom + 8, left: Math.max(12, left) });
    };

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (btnRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, width]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex shrink-0 items-center justify-between gap-2 border bg-white px-5 py-3 text-sm text-gray-900 transition-colors hover:bg-gray-50 whitespace-nowrap ${
          active ? 'border-2 border-black font-medium' : 'border-gray-900'
        }`}
      >
        <span>{label}</span>
        <ChevronDown
          className={`size-3 transition-transform ${open ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: coords.top, left: coords.left, width }}
          className="z-[60] flex max-h-[22rem] flex-col border border-gray-200 bg-white shadow-xl"
        >
          <div className="flex-1 overflow-y-auto p-4">{children(() => setOpen(false))}</div>
          <div className="flex justify-end border-t border-gray-100 px-4 py-2.5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm font-semibold text-gray-900 hover:underline"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function CheckOption({
  label,
  checked,
  onToggle,
  dot,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  dot?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-3 py-2 text-left text-sm text-gray-800 hover:text-black"
    >
      <span
        className={`flex size-4 shrink-0 items-center justify-center border ${
          checked ? 'border-black bg-black text-white' : 'border-gray-400 bg-white'
        }`}
      >
        {checked && <Check className="size-3" strokeWidth={3} />}
      </span>
      {dot && (
        <span
          className="size-3.5 shrink-0 rounded-full border border-gray-300"
          style={dot.startsWith('conic') ? { backgroundImage: dot } : { backgroundColor: dot }}
        />
      )}
      <span className="capitalize">{label}</span>
    </button>
  );
}

function colorDot(value: string): string | undefined {
  return COLOR_HEX[value.toLowerCase()];
}

export default function ProductFilterControls({
  getFilter,
  setFilter,
  setFilters,
  resetFilters,
  currentSort,
  searchParamsKey,
  filterOptions,
}: ProductFilterControlsProps) {
  const [priceMin, setPriceMin] = useState(getFilter('price_min') ?? '');
  const [priceMax, setPriceMax] = useState(getFilter('price_max') ?? '');

  useEffect(() => {
    setPriceMin(getFilter('price_min') ?? '');
    setPriceMax(getFilter('price_max') ?? '');
  }, [searchParamsKey, getFilter]);

  const condition = getFilter('condition');
  const size = getFilter('size');
  const color = getFilter('color');
  const material = getFilter('material');
  const brandValue = getFilter('brand');
  const priceMinValue = getFilter('price_min');
  const priceMaxValue = getFilter('price_max');

  if (!filterOptions) {
    return (
      <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-2">
        <div className="h-11 w-28 animate-pulse border border-gray-200 bg-gray-100" />
        <div className="h-11 w-24 animate-pulse border border-gray-200 bg-gray-100" />
        <div className="h-11 w-24 animate-pulse border border-gray-200 bg-gray-100" />
      </div>
    );
  }

  const options = filterOptions;
  const showCondition = options.conditions.length > 0;
  const showSize = options.sizes.length > 0;
  const showColor = options.colors.length > 0;
  const showMaterial = options.materials.length > 0;
  const showBrand = options.brands.length > 0;
  const showPrice = Boolean(options.price);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === currentSort)?.label ?? 'Trier par';
  const conditionLabel = options.conditions.find((o) => o.value === condition)?.label;

  const priceActive = Boolean(priceMinValue || priceMaxValue);
  const priceLabel = priceActive
    ? `${priceMinValue ? Number(priceMinValue).toLocaleString('fr-FR') : '0'} – ${
        priceMaxValue ? Number(priceMaxValue).toLocaleString('fr-FR') : '∞'
      }`
    : 'Prix';

  const hasActiveFilters = Boolean(
    condition || size || color || material || brandValue || priceMinValue || priceMaxValue,
  );

  const toggle = (key: string, value: string) => {
    setFilter(key, getFilter(key) === value ? null : value);
  };

  const applyPrice = (close: () => void) => {
    setFilters({
      price_min: priceMin.trim() || null,
      price_max: priceMax.trim() || null,
    });
    close();
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
        <FilterDropdown label={`Trier par : ${sortLabel}`} active={currentSort !== 'newest'} width={240}>
          {(close) => (
            <div className="flex flex-col">
              {SORT_OPTIONS.map((opt) => (
                <CheckOption
                  key={opt.value}
                  label={opt.label}
                  checked={currentSort === opt.value}
                  onToggle={() => {
                    setFilter('sort', opt.value);
                    close();
                  }}
                />
              ))}
            </div>
          )}
        </FilterDropdown>

        {showCondition && (
          <FilterDropdown
            label={conditionLabel ? `État : ${conditionLabel}` : 'État'}
            active={Boolean(condition)}
          >
            {(close) => (
              <div className="flex flex-col">
                {options.conditions.map((opt) => (
                  <CheckOption
                    key={opt.value}
                    label={opt.label}
                    checked={condition === opt.value}
                    onToggle={() => {
                      toggle('condition', opt.value);
                      close();
                    }}
                  />
                ))}
              </div>
            )}
          </FilterDropdown>
        )}

        {showSize && (
          <FilterDropdown label={size ? `Taille : ${size}` : 'Tailles'} active={Boolean(size)} width={240}>
            {(close) => (
              <div className="grid grid-cols-3 gap-2">
                {options.sizes.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      toggle('size', opt.value);
                      close();
                    }}
                    className={`border px-2 py-2 text-sm transition-colors ${
                      size === opt.value
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 text-gray-800 hover:border-black'
                    }`}
                  >
                    {opt.value}
                  </button>
                ))}
              </div>
            )}
          </FilterDropdown>
        )}

        {showColor && (
          <FilterDropdown label={color ? `Couleur : ${color}` : 'Couleurs'} active={Boolean(color)}>
            {(close) => (
              <div className="flex flex-col">
                {options.colors.map((opt) => (
                  <CheckOption
                    key={opt.value}
                    label={opt.value}
                    dot={colorDot(opt.value)}
                    checked={color === opt.value}
                    onToggle={() => {
                      toggle('color', opt.value);
                      close();
                    }}
                  />
                ))}
              </div>
            )}
          </FilterDropdown>
        )}

        {showMaterial && (
          <FilterDropdown
            label={material ? `Matière : ${material}` : 'Matières'}
            active={Boolean(material)}
          >
            {(close) => (
              <div className="flex flex-col">
                {options.materials.map((opt) => (
                  <CheckOption
                    key={opt.value}
                    label={opt.value}
                    checked={material === opt.value}
                    onToggle={() => {
                      toggle('material', opt.value);
                      close();
                    }}
                  />
                ))}
              </div>
            )}
          </FilterDropdown>
        )}

        {showBrand && (
          <FilterDropdown
            label={brandValue ? `Marque : ${brandValue}` : 'Marque'}
            active={Boolean(brandValue)}
          >
            {(close) => (
              <div className="flex flex-col">
                {options.brands.map((opt) => (
                  <CheckOption
                    key={opt.value}
                    label={opt.value}
                    checked={brandValue === opt.value}
                    onToggle={() => {
                      toggle('brand', opt.value);
                      close();
                    }}
                  />
                ))}
              </div>
            )}
          </FilterDropdown>
        )}

        {showPrice && (
          <FilterDropdown label={priceLabel} active={priceActive} width={260}>
            {(close) => (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={options.price?.min ?? 0}
                    max={options.price?.max}
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder={String(options.price?.min ?? 0)}
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-black focus:outline-none"
                  />
                  <span className="text-gray-400">–</span>
                  <input
                    type="number"
                    min={options.price?.min ?? 0}
                    max={options.price?.max}
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    placeholder={String(options.price?.max ?? '')}
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-black focus:outline-none"
                  />
                </div>
                <p className="text-xs text-gray-400">Montants en FCFA</p>
                <button
                  type="button"
                  onClick={() => applyPrice(close)}
                  className="bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Appliquer
                </button>
              </div>
            )}
          </FilterDropdown>
        )}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="shrink-0 px-4 py-3 text-sm text-gray-600 underline-offset-2 hover:text-black hover:underline whitespace-nowrap"
          >
            Réinitialiser
          </button>
        )}
      </div>
    </div>
  );
}
