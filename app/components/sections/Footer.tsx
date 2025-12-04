import React from 'react';
import Link from 'next/link';
import { MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-20 pb-10 px-4 md:px-8">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
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

                {/* Column 2: Légal (Moved from pos 3) */}
                <div>
                    <h3 className="text-lg font-serif font-medium mb-6">Légal</h3>
                    <ul className="flex flex-col gap-3 text-sm text-gray-400">
                        <li><Link href="#" className="hover:text-white transition-colors">Conditions Générales</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Mentions légales</Link></li>
                    </ul>
                </div>

                {/* Column 3: Adresse (Replaces Aide & Support) */}
                <div>
                    <h3 className="text-lg font-serif font-medium mb-6">Adresse</h3>
                    <div className="flex flex-col gap-6 text-sm text-gray-400">
                        <div className="group">
                            <div className="flex items-start gap-3 mb-2">
                                <MapPin className="w-5 h-5 text-white mt-0.5" />
                                <span className="text-white font-medium">Nous rendre visite</span>
                            </div>
                            <a
                                href="https://maps.app.goo.gl/YeWCBccsL9zec8iw7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block pl-8 leading-relaxed hover:text-white transition-colors cursor-pointer"
                            >
                                Friperie de Luxe Paris<br />
                                Lomé-Togo

                            </a>
                        </div>

                        <div className="group">
                            <div className="flex items-center gap-3 mb-2">
                                <Phone className="w-5 h-5 text-white" />
                                <span className="text-white font-medium">Nous contacter</span>
                            </div>
                            <p className="pl-8 hover:text-white transition-colors cursor-pointer">
                                +228 70 74 90 16
                            </p>
                        </div>
                    </div>
                </div>

                {/* Column 4: Newsletter */}
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
                <p className="text-sm text-gray-500">© 2025 FriperieLuxe. Tous droits réservés.</p>
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
