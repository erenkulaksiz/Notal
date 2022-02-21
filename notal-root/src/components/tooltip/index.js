import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
    TooltipPortal
} from '@components';

const Tooltip = ({ children, content, hideArrow = false }) => {
    const [show, setShow] = useState(false);
    const [visible, setVisible] = useState(false);
    const containerRef = useRef();

    useEffect(() => {
        if (visible) {
            setShow(true)
        }
    }, [visible]);

    return (<div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        ref={containerRef}
        className="relative flex justify-center items-center z-50"
    >
        {children}

        {show && <TooltipPortal parent={containerRef.current} className="pointer-events-none absolute bottom-[calc(100%+5px)]">
            <motion.div
                initial="hidden"
                animate={visible ? "show" : "hidden"}
                variants={{
                    hidden: { y: 10, opacity: 0, transitionEnd: { display: "none" } },
                    show: { y: 0, opacity: 1, display: "flex" }
                }}
                transition={{ type: "spring", stiffness: 400, duration: 0.02, damping: 25 }} // bottom-[calc(100%+45px)] 
                className="relative bg-neutral-100 dark:bg-neutral-900 whitespace-nowrap px-3 py-1 flex items-center justify-center rounded-xl text-sm shadow-xl z-50 top-0 text-black dark:text-white"
                onAnimationComplete={() => !visible && setShow(false)}
            >
                {content}
                {!hideArrow && <div className="w-4 -z-10 h-4 bg-neutral-100 dark:bg-neutral-900 absolute -bottom-1 rotate-45" />}
            </motion.div>
        </TooltipPortal>}
    </div>)
}

export default Tooltip;