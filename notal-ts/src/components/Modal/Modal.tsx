import { useState, useEffect } from "react";

import { CreatePortal as Portal } from "@components";
import { CrossIcon } from "@icons";
import { Log } from "@utils/logger";
import { Backdrop, Content, Body, Title, Footer } from "./components";
import type { ModalProps } from "./Modal.d";
import type { KeyboardEvent } from "react";

export const ChildrenAnim = {
  hidden: {
    opacity: 0.5,
    y: -20,
    transition: {
      type: "spring",
      stiffness: 800,
      damping: 30,
    },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 800,
      damping: 30,
    },
  },
};

function Modal({
  children,
  open,
  blur = false,
  onClose,
  className,
  animate = false,
  closeBtn = true,
}: ModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setShow(true);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return show ? (
    <Portal portalName="notal-modal">
      <Backdrop
        blur={blur}
        onClose={onClose}
        open={open}
        setShow={setShow}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) =>
          event.key === "Escape" && onClose()
        }
      >
        <Content blur={blur} className={className} animate={animate}>
          {closeBtn && (
            <div className="absolute right-2 top-2 z-50">
              <button
                onClick={(e) => onClose(e)}
                className="fill-neutral-600 hover:fill-neutral-700 rounded-lg"
              >
                <CrossIcon size={24} />
              </button>
            </div>
          )}
          {children}
        </Content>
      </Backdrop>
    </Portal>
  ) : null;
}

Modal.Title = Title;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
