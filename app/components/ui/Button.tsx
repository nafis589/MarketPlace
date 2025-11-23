import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    children,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center transition-all duration-300 font-medium tracking-wide disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-black text-white hover:bg-gray-800 border border-black",
        secondary: "bg-gray-100 text-black hover:bg-gray-200 border border-transparent",
        outline: "bg-transparent text-black border border-gray-300 hover:border-black",
        ghost: "bg-transparent text-black hover:bg-gray-50 border border-transparent",
        white: "bg-white text-black hover:bg-gray-100 border border-white",
    };

    const sizes = {
        sm: "text-xs px-4 py-2",
        md: "text-sm px-6 py-3",
        lg: "text-base px-8 py-4",
    };

    const width = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
