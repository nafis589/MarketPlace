import React from 'react';
import Link from 'next/link';


const Footer = () => {
    return (
        <footer className="bg-black text-white pt-20 pb-10 px-4 md:px-8">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
                {/* Column 1: À propos */}
                <div>
                    <h3 className="text-lg font-serif font-medium mb-6">À propos</h3>
                    <ul className="flex flex-col gap-3 text-sm text-gray-400">
                        <li><Link href="#" className="hover:text-white transition-colors">Qui sommes-nous ?</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Carrières</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Développement durable</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Presse</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Publicité</Link></li>
                    </ul>
                </div>

                {/* Column 2: Légal */}
                <div>
                    <h3 className="text-lg font-serif font-medium mb-6">Légal</h3>
                    <ul className="flex flex-col gap-3 text-sm text-gray-400">
                        <li><Link href="#" className="hover:text-white transition-colors">Conditions Générales</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Mentions légales</Link></li>
                    </ul>
                </div>

                {/* Column 3: Newsletter */}
                <div>
                    <h3 className="text-lg font-serif font-medium mb-6">Newsletter</h3>
                    <p className="text-sm text-gray-400 mb-4">Inscrivez-vous pour recevoir nos dernières offres et actualités.</p>
                    <form className="flex flex-col gap-3">
                        <input
                            type="email"
                            placeholder="Votre email"
                            className="bg-transparent border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                        />
                        <button type="submit" className="bg-white text-black px-4 py-3 font-medium hover:bg-gray-200 transition-colors">S'inscrire</button>
                    </form>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500">© 2026 Marketplace. Tous droits réservés.</p>
                <div className="flex gap-4">
                    {/* Social Icons Placeholders */}
                    <div className="w-6 h-6 bg-gray-800 rounded-full hover:bg-white transition-colors cursor-pointer"></div>
                    <div className="w-6 h-6 bg-gray-800 rounded-full hover:bg-white transition-colors cursor-pointer"></div>
                    <div className="w-6 h-6 bg-gray-800 rounded-full hover:bg-white transition-colors cursor-pointer"></div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
