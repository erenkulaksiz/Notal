import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
    TooltipPortal
} from '@components';

import {
    conditionalClass,
    allClass
} from '@utils/conditionalClass';

const Tooltip = ({
    children,
    content,
    hideArrow = false,
    direction = "up",
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

    const sideClasses = conditionalClass({
        keys: {
            up: "top-0",
            right: "right-0"
        },
        selected: direction
    });

    const portalSideClasses = conditionalClass({
        keys: {
            up: "bottom-[calc(100%+5px)]",
            right: "left-[calc(100%)]"
        },
        selected: direction,
    });

    const arrowClasses = conditionalClass({
        keys: {
            up: "-bottom-1",
            right: "-left-1",
        },
        selected: direction
    })

    const containerClasses = allClass({
        defaultClasses: "relative flex justify-center items-center w-auto"
    });

    const portalClasses = allClass({
        defaultClasses: "pointer-events-none absolute",
        conditions: [portalSideClasses]
    });

    const tooltipContainerClasses = allClass({
        defaultClasses: "relative bg-neutral-100 dark:bg-neutral-900 whitespace-nowrap px-3 py-1 flex items-center justify-center rounded-xl text-sm shadow-xl text-black dark:text-white",
        conditions: [sideClasses]
    });

    const tooltipArrowContainerClasses = allClass({
        defaultClasses: "w-2 -z-10 h-2 bg-neutral-100 dark:bg-neutral-900 absolute rotate-45",
        conditions: [arrowClasses]
    })

    useEffect(() => {
        if (visible) {
            setShow(true)
        }
    }, [visible]);

    return (<div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        ref={containerRef}
        className={containerClasses}
    >
        {children}
        {(show && content) && <TooltipPortal
            parent={containerRef.current}
            className={portalClasses}>
            <motion.div
                initial="hidden"
                animate={visible ? "show" : "hidden"}
                variants={sideVariation()}
                transition={{ type: "spring", stiffness: 400, duration: 0.02, damping: 25 }} // bottom-[calc(100%+45px)] 
                className={tooltipContainerClasses}
                style={{ zIndex: 100 }}
                onAnimationComplete={() => !visible && setShow(false)}
            >
                {content}
                {!hideArrow && <div className={tooltipArrowContainerClasses} />}
            </motion.div>
        </TooltipPortal>}
    </div>)
}

export default Tooltip;