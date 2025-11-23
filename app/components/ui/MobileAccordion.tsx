import React, { useRef, useEffect, useState } from 'react';

interface MobileAccordionProps {
    isOpen: boolean;
    title: React.ReactNode;
    children: React.ReactNode;
    onToggle: () => void;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
}

const MobileAccordion: React.FC<MobileAccordionProps> = ({
    isOpen,
    title,
    children,
    onToggle,
    className = '',
    headerClassName = '',
    contentClassName = '',
}) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | undefined>(isOpen ? undefined : 0);

    useEffect(() => {
        if (isOpen) {
            const scrollHeight = contentRef.current?.scrollHeight;
            setHeight(scrollHeight);
        } else {
            setHeight(0);
        }
    }, [isOpen, children]);

    return (
        <div className={`overflow-hidden ${className}`}>
            <button
                onClick={onToggle}
                className={`w-full flex items-center justify-between text-left ${headerClassName}`}
                type="button"
            >
                {title}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
            <div
                className={`transition-all duration-300 ease-in-out ${contentClassName}`}
                style={{ height: isOpen ? height : 0, opacity: isOpen ? 1 : 0 }}
            >
                <div ref={contentRef}>{children}</div>
            </div>
        </div>
    );
};

export default MobileAccordion;
