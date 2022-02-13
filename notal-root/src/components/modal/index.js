import { useState, useEffect } from 'react';
import { Portal } from '@components';
import { motion } from "framer-motion";
import {
    CrossIcon
} from '@icons';

const Content = ({ children, blur }) => {
    return (<div onClick={e => e.stopPropagation()} className={`z-50 relative box-border flex flex-col min-h-min w-[90%] shadow-2xl sm:w-[460px] p-4 ${blur ? "backdrop-brightness-75 " : "bg-neutral-900 "}rounded-lg overflow-hidden`}>
        {children}
    </div>)
}

const Backdrop = ({ children, blur, onClose, open, setShow }) => {
    return (<motion.div
        variants={{
            show: {
                display: "flex",
                opacity: 1,
                transition: {
                    staggerChildren: 0.1,
                },
            },
            hidden: {
                opacity: 0,
                transitionEnd: { display: "none" }
            }
        }}
        initial="hidden"
        animate={open ? "show" : "hidden"}
        onAnimationComplete={() => !open && setShow(false)}
    >
        <div className={`fixed top-0 right-0 bottom-0 left-0 ${blur ? "bg-black/50 backdrop-blur-sm" : "bg-black/60"} flex items-center justify-center z-50`} onClick={onClose}>
            {children}
        </div>
    </motion.div>)
}

const Title = ({ children, className }) => {
    return (<div className={`${className ? className + " " : ""}w-full h-12 justify-center flex items-center`}>
        {children}
    </div>)
}

const Body = ({ children, className }) => {
    return (<div className={`${className ? className + " " : ""}w-full h-auto flex items-start`}>
        {children}
    </div>)
}

const Footer = ({ children, className }) => {
    return (<div className={`${className ? className + " " : ""}w-full h-12 justify-center flex items-center`}>
        {children}
    </div>)
}

const Modal = ({ children, open, blur, onClose }) => {
    const [show, setShow] = useState(false);

    useEffect(() => open && setShow(true), [open]);

    if (!show) return null;

    return (<Portal>
        <Backdrop blur={blur} onClose={onClose} open={open} setShow={setShow}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    show: { opacity: 1, scale: 1 }
                }}
                transition={{ type: "spring", stiffness: 800, duration: 0.02, damping: 25 }}
            >
                <Content blur={blur}>
                    <div className="absolute right-2 top-2">
                        <button onClick={onClose} className="fill-neutral-600 hover:fill-neutral-700">
                            <CrossIcon size={24} />
                        </button>
                    </div>
                    {children}
                </Content>
            </motion.div>
        </Backdrop>
    </Portal>)
}

Modal.Title = Title;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;