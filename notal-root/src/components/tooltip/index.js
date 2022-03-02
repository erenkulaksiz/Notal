import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
    TooltipPortal
} from '@components';

import BuildComponent from '@utils/buildComponent';

const Tooltip = ({
    children,
    content,
    allContainerClassName,
    hideArrow = false,
    direction = "up",
    animated = true,
    blockContent = true, // block pointer events
    closeAuto = true, // automatically close after time
}) => {
    const [show, setShow] = useState(false);
    const [visible, setVisible] = useState(false);
    const containerRef = useRef();

    useEffect(() => {
        if (visible) {
            setShow(true);
        }
    }, [visible]);

    const sideVariation = () => {
        switch (direction) {
            case "up":
                return {
                    hidden: { y: 10, opacity: 0, transitionEnd: { display: "none" } },
                    show: { y: 0, opacity: 1, display: "flex" }
                }
            case "right":
                return {
                    hidden: { x: -10, opacity: 0, transitionEnd: { display: "none" } },
                    show: { x: 0, opacity: 1, display: "flex" }
                }
            case "bottom":
                return {
                    hidden: { y: -10, opacity: 0, transitionEnd: { display: "none" } },
                    show: { y: 0, opacity: 1, display: "flex" }
                }
            case "left":
                return {
                    hidden: { x: 10, opacity: 0, transitionEnd: { display: "none" } },
                    show: { x: 0, opacity: 1, display: "flex" }
                }
        }
    }

    const BuildAllContainer = BuildComponent({
        name: "Tooltip All Container",
        defaultClasses: "relative flex justify-center items-center",
        extraClasses: allContainerClassName,
    })

    const BuildPortal = BuildComponent({
        name: "Tooltip Portal",
        defaultClasses: "absolute",
        conditionalClasses: [
            {
                up: "bottom-[calc(100%+5px)]",
                right: "left-[calc(100%+5px)]",
                left: "right-[calc(100%)+5px]",
                bottom: "top-[calc(100%+5px)]"
            },
            {
                true: "pointer-events-none"
            }
        ],
        selectedClasses: [
            direction,
            blockContent
        ]
    });

    const BuildArrow = BuildComponent({
        name: "Tooltip Arrow",
        defaultClasses: "w-2 -z-10 h-2 bg-white dark:bg-neutral-800 absolute rotate-45",
        conditionalClasses: [
            {
                up: "-bottom-1",
                right: "-left-0.5",
                left: "-right-0.5",
                bottom: "-top-1",
            }
        ],
        selectedClasses: [
            direction,
        ]
    });

    const BuildTooltipContainer = BuildComponent({
        name: "Tooltip Container",
        defaultClasses: "shadow-xl z-50 relative bg-white dark:bg-neutral-800 whitespace-nowrap px-3 py-1 flex items-center justify-center rounded-xl text-sm shadow-xl text-black dark:text-white",
        conditionalClasses: [
            {
                up: "top-0",
                right: "right-0",
                left: "left-0",
                bottom: "bottom-0",
            }
        ],
        selectedClasses: [
            direction,
        ]
    });

    return (<div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        //onFocus={() => setVisible(true)}
        onTouchEnd={() => setVisible(false)}
        onBlur={() => setVisible(false)}
        ref={containerRef}
        className={BuildAllContainer.classes}
    >
        {children}
        {(show && content) && <TooltipPortal
            parent={containerRef.current}
            className={BuildPortal.classes}
        >
            <motion.div
                initial="hidden"
                animate={visible ? "show" : "hidden"}
                variants={sideVariation()}
                transition={{ type: animated ? "spring" : "none", stiffness: 400, duration: 0.02, damping: 25 }} // bottom-[calc(100%+45px)] 
                className={BuildTooltipContainer.classes}
                onAnimationComplete={() => !visible && setShow(false)}
            >
                {content}
                {!hideArrow && <div className={BuildArrow.classes} />}
            </motion.div>
        </TooltipPortal>}
    </div>)
}

export default Tooltip;