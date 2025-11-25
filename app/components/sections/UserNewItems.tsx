import React from 'react';
import Image from 'next/image';
import { userNewItems } from '@/app/lib/data';
import Link from 'next/link';

const UserNewItems = () => {
    return (
        <section className="py-16 bg-gray-900 text-white px-4 md:px-8">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif font-medium mb-2">Tout juste déposé</h2>
                        <p className="text-gray-400">Soyez le premier à découvrir ces pépites.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {userNewItems.map((item) => (
                        <Link key={item.id} href={`/product/${item.slug}`}>
                            <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-400">{item.time}</span>
                                        <span className="text-xs font-bold bg-white text-black px-2 py-0.5 rounded-full">Nouveau</span>
                                    </div>
                                    <h3 className="font-bold mt-1">{item.brand}</h3>
                                    <p className="text-sm text-gray-300 truncate">{item.name}</p>
                                    <p className="text-sm font-medium mt-1">{item.price} €</p>
                                    <p className="text-xs text-gray-500 mt-2">Vendu par {item.username}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UserNewItems;
