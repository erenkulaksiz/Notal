import { useState, useEffect } from 'react';
import { ModalPortal } from '@components';
import { motion } from "framer-motion";
import {
    CrossIcon
} from '@icons';

const Content = ({ children, blur, className }) => {
    return (<motion.div
        variants={{
            hidden: { opacity: 0, scale: 0.8 },
            show: { opacity: 1, scale: 1 }
        }}
        transition={{ type: "spring", stiffness: 700, duration: 50, damping: 25 }}
        onClick={e => e.stopPropagation()}
        className={`${className ? className + " " : ""}z-50 relative box-border flex flex-col min-h-min shadow-2xl p-2 ${blur ? "backdrop-brightness-75 dark:bg-black/50 bg-white " : "dark:bg-neutral-900 bg-white "}rounded-lg overflow-hidden`}
    >
        {children}
    </motion.div>)
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
        className={`fixed top-0 right-0 bottom-0 left-0 ${blur ? "bg-black/50 backdrop-blur-sm" : "bg-black/60"} flex items-center justify-center z-50`} onClick={onClose}
    >
        {children}
    </motion.div>)
}

const Title = ({ children, className }) => {
    return (<div className={`${className ? className + " " : ""}w-full h-12 justify-center flex items-center`}>
        {children}
    </div>)
}

const Body = ({ children, className }) => {
    return (<div className={`${className ? className + " " : ""}w-full h-auto flex items-start flex-col`}>
        {children}
    </div>)
}

const Footer = ({ children, className }) => {
    return (<div className={`${className ? className + " " : ""}w-full h-12 justify-center flex items-center`}>
        {children}
    </div>)
}

const Modal = ({ children, open, blur, onClose, className }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            setShow(true)
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    return (show ? <ModalPortal>
        <Backdrop blur={blur} onClose={onClose} open={open} setShow={setShow}>
            <Content blur={blur} className={className}>
                <div className="absolute right-2 top-2">
                    <button onClick={onClose} className="fill-neutral-600 hover:fill-neutral-700">
                        <CrossIcon size={24} />
                    </button>
                </div>
                {children}
            </Content>
        </Backdrop>
    </ModalPortal> : null)
}

Modal.Title = Title;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;