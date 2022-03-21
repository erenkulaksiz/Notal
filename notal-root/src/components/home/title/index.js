const HomeNavTitle = ({ children, title }) => {
    return (<div className="flex flex-row min-h-[60px] px-4 items-center sticky top-0 z-30 dark:bg-neutral-800/60 bg-white/70 backdrop-blur-sm">
        <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 p-2 dark:bg-neutral-800 bg-neutral-100 mr-3 rounded-lg">
            <div className="hidden md:flex">
                {children}
            </div>
            <div className="flex md:hidden">
                <div style={{ transform: "scale(0.8)" }}>
                    {children}
                </div>
            </div>
        </div>
        <h1 className="flex items-center text-lg md:text-2xl font-bold">{title}</h1>
    </div>)
}

export default HomeNavTitle;