import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
    TooltipPortal
} from '@components';

import BuildComponent from '@utils/buildComponent';
import { isClient } from '@utils';
import useClickAway from '@hooks/clickaway';
import useClickAnyWhere from '@hooks/clickanywhere';

const Tooltip = ({
    children,
    content,
    allContainerClassName,
    containerClassName,
    hideArrow = false,
    direction = "top",
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

    const vars = {
        hidden: {
            opacity: 0, transitionEnd: { display: "none" }
        },
        show: {
            opacity: 1, display: "flex",
        }
    }

    const variations = {
        top: {
            hidden: { y: 10, ...vars.hidden },
            show: { y: 0, ...vars.show }
        },
        right: {
            hidden: { x: -10, ...vars.hidden },
            show: { x: 0, ...vars.show }
        },
        bottom: {
            hidden: { y: -10, ...vars.hidden },
            show: { y: 0, ...vars.show }
        },
        left: {
            hidden: { x: 10, ...vars.hidden },
            show: { x: 0, ...vars.show }
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
                top: "bottom-[calc(100%+5px)]",
                right: "left-[calc(100%+5px)]",
                left: "right-[calc(100%+5px)]",
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
                top: "-bottom-1",
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
        defaultClasses: "shadow-xl z-50 relative bg-white dark:bg-neutral-800 dark:shadow-black/60 shadow-neutral-800/30 whitespace-nowrap px-3 py-1 flex items-center justify-center rounded-xl text-sm shadow-xl text-black dark:text-white",
        extraClasses: containerClassName,
        conditionalClasses: [
            {
                top: "top-0",
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
                variants={variations[direction]}
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