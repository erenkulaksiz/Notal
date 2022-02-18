import { useState, useEffect } from 'react';
import { ModalPortal } from '@components';
import { motion } from "framer-motion";
import {
    CrossIcon
} from '@icons';

// #TODO: animation bool not working on childrens

const ChildrenAnim = {
    hidden: {
        opacity: 0.4,
        y: -15,
        transition: {
            type: "spring", stiffness: 800, damping: 35, duration: 25
        }
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring", stiffness: 800, damping: 35, duration: 25
        }
    }
}

const Content = ({ children, blur, className }) => {
    return (<motion.div
        variants={{
            hidden: {
                opacity: 0,
                scale: 0.8,
                transition: {
                    staggerChildren: 0.06,
                    type: "spring", stiffness: 800, damping: 50, duration: 50
                },
            },
            show: {
                opacity: 1,
                scale: 1,
                transition: {
                    staggerChildren: 0.06,
                    type: "spring", stiffness: 800, damping: 25, duration: 50
                },
            }
        }}
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
            },
            hidden: {
                opacity: 0,
                transitionEnd: { display: "none" },
            }
        }}
        transition={{ type: "spring", stiffness: 400, duration: 0.02, damping: 25 }}
        initial="hidden"
        animate={open ? "show" : "hidden"}
        onAnimationComplete={() => !open && setShow(false)}
        className={`fixed top-0 right-0 bottom-0 left-0 ${blur ? "bg-black/50 backdrop-blur-sm" : "bg-black/60"} flex items-center justify-center z-50`} onClick={onClose}
    >
        {children}
    </motion.div>)
}

const Title = ({ children, className, animate = false }) => {
    return (<motion.div
        className={`${className ? className + " " : ""}w-full h-12 justify-center flex items-center`}
        variants={animate && ChildrenAnim}
    >
        {children}
    </motion.div>)
}

const Body = ({ children, className, animate = false }) => {
    return (<motion.div
        variants={{
            show: {
                transition: {
                    staggerChildren: 0.06,
                }
            },
            hidden: {
                transition: {
                    staggerChildren: 0.06,
                }
            }
        }}
        className={`${className ? className + " " : ""}w-full h-auto flex items-start flex-col`}
        variants={animate && ChildrenAnim}
    >
        {children}
    </motion.div>)
}

const Footer = ({ children, className, animate = false }) => {
    return (<motion.div
        className={`${className ? className + " " : ""}w-full h-12 justify-center flex items-center`}
        variants={animate && ChildrenAnim}
    >
        {children}
    </motion.div >)
}

const Modal = ({ children, open, blur, onClose, className, animate = false }) => {
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

    return (show && <ModalPortal>
        <Backdrop blur={blur} onClose={onClose} open={open} setShow={setShow}>
            <Content blur={blur} className={className} animate={animate}>
                <div className="absolute right-2 top-2">
                    <button onClick={onClose} className="fill-neutral-600 hover:fill-neutral-700">
                        <CrossIcon size={24} />
                    </button>
                </div>
                {children}
            </Content>
        </Backdrop>
    </ModalPortal>)
}

Modal.Title = Title;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;