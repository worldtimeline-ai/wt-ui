const TopLoadingBar = ({ isLoading }: { isLoading: boolean }) => {
    return (
        <div className={`rounded-b-lg h-1 bg-red-400 origin-left transition-all duration-[3s] ${isLoading ? "w-full" : "w-0"}`} />
    );
};

export default TopLoadingBar;
