import { useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import BuildComponent from "@utils/buildComponent";

const TabButton = ({ children, selected, hover, onMouseEnter, onMouseLeave, setSelected, setHover, ...rest }) => {
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
        {...rest}
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

const TabHeader = ({ children, headerClassName }) => {

    const BuildTabHeader = BuildComponent({
        name: "Notal UI Tab Header",
        defaultClasses: "w-full h-10 flex flex-row relative border-2 border-solid dark:border-neutral-700 border-neutral-200 rounded-lg",
        extraClasses: headerClassName
    });

    return (<div className={BuildTabHeader.classes}>
        {children}
    </div>)
}

const TabView = ({ children, className }) => {

    const BuildTabView = BuildComponent({
        name: "Notal UI Tab View",
        defaultClasses: "w-full h-full",
        extraClasses: className
    });

    return (<div className={BuildTabView.classes}>
        {children}
    </div>)
}

const Tab = ({ children, selected, views, onSelect, id, className, headerClassName }) => {
    const [hover, setHover] = useState(-1);

    const BuildTab = BuildComponent({
        name: "Notal UI Tab",
        defaultClasses: "w-full h-full relative",
        extraClasses: className
    })

    return (<div className={BuildTab.classes}>
        <TabHeader headerClassName={headerClassName}>
            <LayoutGroup id={id}>
                {views.map((view, index) => <TabButton
                    className="w-full h-full group relative"
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
                    {view.title}
                </TabButton>)}
            </LayoutGroup>
        </TabHeader>
        {children?.map(child => child.props.index == selected && child)}
    </div>)
}

Tab.TabView = TabView;

export default Tab;