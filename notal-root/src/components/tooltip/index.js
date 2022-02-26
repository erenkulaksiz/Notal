import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
    TooltipPortal
} from '@components';

import BuildComponent from '@utils/buildComponent';

const Tooltip = ({
    children,
    content,
    hideArrow = false,
    direction = "up",
    animated = true,
    blockContent = true, // block pointer events
}) => {
    const [show, setShow] = useState(false);
    const [visible, setVisible] = useState(false);
    const containerRef = useRef();

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

    const BuildPortal = BuildComponent({
        name: "Tooltip Portal",
        defaultClasses: "absolute z-50 bg-blue-200",
        conditionalClasses: [
            {
                up: "bottom-[calc(100%+5px)]",
                right: "left-[calc(100%+5px)]",
                left: "right-[calc(100%)+5px]",
                bottom: "top-[calc(100%)]"
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
        defaultClasses: "w-2 -z-10 h-2 bg-neutral-100 dark:bg-neutral-900 absolute rotate-45",
        conditionalClasses: [
            {
                up: "-bottom-1",
                right: "-left-1",
                left: "-right-1",
                bottom: "-top-1",
            }
        ],
        selectedClasses: [
            direction,
        ]
    });

    const BuildTooltipContainer = BuildComponent({
        name: "Tooltip Container",
        defaultClasses: "z-50 relative bg-neutral-100 dark:bg-neutral-900 whitespace-nowrap px-3 py-1 flex items-center justify-center rounded-xl text-sm shadow-xl text-black dark:text-white",
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

    useEffect(() => {
        if (visible) {
            setShow(true)
        }
    }, [visible]);

    return (<div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        ref={containerRef}
        className="relative flex justify-center items-center w-auto"
    >
        {children}
        {(show && content) && <TooltipPortal
            parent={containerRef.current}
            className={BuildPortal.classes}>
            <motion.div
                initial="hidden"
                animate={visible ? "show" : "hidden"}
                variants={sideVariation()}
                transition={{ type: animated ? "spring" : "none", stiffness: 400, duration: 0.02, damping: 25 }} // bottom-[calc(100%+45px)] 
                className={BuildTooltipContainer.classes}
                style={{ zIndex: 100 }}
                onAnimationComplete={() => !visible && setShow(false)}
            >
                {content}
                {!hideArrow && <div className={BuildArrow.classes} />}
            </motion.div>
        </TooltipPortal>}
    </div>)
}

export default Tooltip;