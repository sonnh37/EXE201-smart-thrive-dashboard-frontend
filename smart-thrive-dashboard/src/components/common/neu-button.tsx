import React from 'react';

interface NeuButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
}

const NeuButton: React.FC<NeuButtonProps> = ({onClick, children}) => {
    return (
        <button
            className="px-6 py-2 font-medium bg-slate-700 text-white w-fit transition-all shadow-[3px_3px_0px_black] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default NeuButton;