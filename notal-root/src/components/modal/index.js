import { useState, useEffect } from 'react';
import { ModalPortal } from '@components';
import {
    CrossIcon
} from '@icons';

import Title from './title';
import Body from './body';
import Footer from './footer';
import Backdrop from './backdrop';
import Content from './content';

export const ChildrenAnim = {
    hidden: {
        opacity: 0,
        y: -20,
        transition: {
            type: "spring", stiffness: 800, damping: 30
        }
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring", stiffness: 800, damping: 30
        }
    }
}

const Modal = ({ children, open, blur, onClose, className, animate = false, closeBtn = true }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            setShow(true);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    return (show && <ModalPortal>
        <Backdrop blur={blur} onClose={onClose} open={open} setShow={setShow}>
            <Content blur={blur} className={className} animate={animate}>
                {closeBtn && <div className="absolute right-2 top-2">
                    <button onClick={onClose} className="fill-neutral-600 hover:fill-neutral-700 rounded-lg">
                        <CrossIcon size={24} />
                    </button>
                </div>}
                {children}
            </Content>
        </Backdrop>
    </ModalPortal>)
}

Modal.Title = Title;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;