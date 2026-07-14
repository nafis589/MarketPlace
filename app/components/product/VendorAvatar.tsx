import { cn } from '@/lib/utils';

type VendorAvatarProps = {
  name: string;
  logo?: string | null;
  className?: string;
};

/** Avatar vendeur — même rendu que la section « Vendeur » en bas de fiche produit. */
export default function VendorAvatar({ name, logo, className }: VendorAvatarProps) {
  const initial = name.charAt(0).toUpperCase() || '?';

  return (
    <div
      className={cn(
        'flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-lg font-serif text-gray-500',
        className,
      )}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={name} className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
}
