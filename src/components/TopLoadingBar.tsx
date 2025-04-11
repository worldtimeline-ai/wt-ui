import React from 'react';

interface TopLoadingBarProps {
    isLoading: boolean;
}

const TopLoadingBar: React.FC<TopLoadingBarProps> = ({ isLoading }) => {
    const barClasses = `rounded-b-lg h-1 bg-red-400 origin-left transition-all duration-[3s] ${isLoading ? 'w-full' : 'w-0'
        }`;

    return <div className={barClasses} />;
};

export default TopLoadingBar;