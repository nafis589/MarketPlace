import React from 'react';

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, className = '' }) => {
    return (
        <div className={`mb-8 md:mb-12 ${className}`}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium mb-4">{title}</h1>
            {subtitle && <p className="text-gray-600 text-lg max-w-2xl">{subtitle}</p>}
        </div>
    );
};

export default SectionTitle;
