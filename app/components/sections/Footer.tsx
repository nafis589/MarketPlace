import React from 'react';
import Link from 'next/link';
import { VENDOR_DASHBOARD_AUTH_URL, VENDOR_DASHBOARD_URL } from '@/lib/vendor-dashboard';

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const footerColumns: FooterColumn[] = [
  {
    title: 'NOS SERVICES',
    links: [
      { label: 'Notre concept', href: '/a-propos-de-nous' },
      { label: 'Service Conciergerie', href: '/a-propos-de-nous' },
    ],
  },
  {
    title: 'ACHETER',
    links: [
      { label: 'Suivre sa commande', href: '/commandes' },
      { label: "Vérification d'authenticité & qualité", href: '/a-propos-de-nous' },
      { label: 'Politique de retours', href: '/a-propos-de-nous' },
    ],
  },
  {
    title: 'VENDRE',
    links: [
      { label: 'Comment vendre ?', href: VENDOR_DASHBOARD_AUTH_URL, external: true },
      { label: 'Nos conseils pour vendre', href: '/journal' },
      { label: 'Vendre un article', href: VENDOR_DASHBOARD_URL, external: true },
      { label: 'Vendeurs professionnels', href: VENDOR_DASHBOARD_URL, external: true },
    ],
  },
  {
    title: 'AIDE',
    links: [
      { label: "Centre d'aide", href: '/a-propos-de-nous' },
      { label: 'Nous contacter', href: 'mailto:contact@marketplace.com' },
    ],
  },
  {
    title: 'MARKETPLACE',
    links: [
      { label: 'Notre entreprise', href: '/a-propos-de-nous' },
      { label: 'Nos engagements', href: '/a-propos-de-nous' },
      { label: "Rapport d'impact", href: '/a-propos-de-nous' },
      { label: 'Recrutement', href: '/a-propos-de-nous' },
      { label: 'Histoires de mode', href: '/journal' },
    ],
  },
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  const className =
    'text-sm text-[#b3b3b3] hover:text-white transition-colors leading-snug';

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
      </a>
    );
  }

  if (link.href.startsWith('mailto:')) {
    return (
      <a href={link.href} className={className}>
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-14 pt-14 pb-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-8">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-[#2e2e2e] pt-6">
          <p className="text-xs text-[#8a8a8a]">
            © {new Date().getFullYear()} Marketplace. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
