import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import BuildComponent from "@utils/buildComponent";

const TabButton = ({
    children,
    selected,
    hover,
    onMouseEnter,
    onMouseLeave,
    setSelected,
    setHover,
    ...props
}) => {
    return (<button
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onKeyDown={({ key }) =>
            key === 'Enter' ?
                () => {
                    setSelected();
                    setHover(-1);
                } : null
        }
        {...props}
    >
        <span className="z-20 relative">
            {children}
        </span>
        {hover && <motion.div
            className="absolute left-1 right-1 top-1 bottom-1 z-10 dark:bg-neutral-700 bg-neutral-200 rounded-md"
            layoutId="tabheader"
            transition={{
                layout: {
                    duration: 0.2,
                    ease: 'easeOut',
                },
            }}
        ></motion.div>}
        {selected && <motion.div
            className="absolute left-3 right-3 h-1 -bottom-1 rounded-xl z-10 bg-blue-600"
            layoutId="tabunderline"
            transition={{
                layout: {
                    type: "spring",
                    damping: 25,
                    stiffness: 400,
                    mass: .55
                },
            }}
        ></motion.div>}
    </button >)
}

const TabHeader = ({ children, headerClassName, loadingWorkspace }) => {

    const TabHeaderSkeleton = () => {
        return (<div className="w-full h-10 flex flex-row dark:bg-neutral-800 bg-neutral-100 p-2 rounded-lg">
            {[1, 2, 3].map(item => <div key={item} className="w-[20%] rounded mr-2 dark:bg-neutral-900 bg-neutral-200 animate-pulse h-full"></div>)}
        </div>)
    }

    if (loadingWorkspace) return <TabHeaderSkeleton />

    const BuildTabHeader = BuildComponent({
        name: "Notal UI Tab Header",
        defaultClasses: "h-10 flex flex-1 flex-row relative border-2 border-solid dark:border-neutral-800 border-neutral-200 rounded-lg",
        extraClasses: headerClassName
    });

    return (<nav className={BuildTabHeader.classes}>
        {children}
    </nav>)
}

const TabView = ({ children, className }) => {

    const BuildTabView = BuildComponent({
        name: "Notal UI Tab View",
        defaultClasses: "w-full",
        extraClasses: className
    });

    return (<div className={BuildTabView.classes}>
        {children}
    </div>)
}

const Tab = ({
    children,
    selected,
    views,
    onSelect,
    id,
    className,
    headerClassName,
    headerContainerClassName,
    loadingWorkspace = false,
}) => {
    const [hover, setHover] = useState(-1);

    const BuildTab = BuildComponent({
        name: "Notal UI Tab",
        defaultClasses: "w-full relative",
        extraClasses: className
    });

    const BuildTabHeaderContainer = BuildComponent({
        name: "Notal UI Tab Header Container",
        defaultClasses: "flex overflow-x-auto overflow-y-hidden pb-1",
        extraClasses: headerContainerClassName,
    })

    return (<div className={BuildTab.classes}>
        <div className={BuildTabHeaderContainer.classes}>
            <TabHeader
                headerClassName={headerClassName}
                loadingWorkspace={loadingWorkspace}
            >
                <LayoutGroup id={id}>
                    {views && views?.map((view, index) => <TabButton
                        className="flex items-center justify-center w-full min-w-[100px] h-full group relative text-sm sm:text-md"
                        key={index}
                        selected={selected == index}
                        setSelected={() => onSelect({ index })}
                        onClick={() => onSelect({ index })}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(-1)}
                        hover={hover == index}
                        setHover={(i) => setHover(i)}
                        title={view.title}
                        aria-label={view.title}
                    >
                        <div className="flex flex-row items-center">
                            {view.icon && <div>
                                {view.icon && view.icon}
                            </div>}
                            <div>
                                {view.title}
                            </div>
                        </div>
                    </TabButton>)}
                </LayoutGroup>
            </TabHeader>
        </div>
        {children?.map(child => child.props.index == selected && child)}
    </div>)
}

Tab.TabView = TabView;

export default Tab;