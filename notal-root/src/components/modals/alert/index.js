import { Fragment } from "react";
import { Modal, Button } from "@components";
import BuildComponent from "@utils/buildComponent";

const AlertModal = ({
    open,
    title,
    titleIcon,
    desc,
    onClose,
    closeable,
    blur,
    buttons = false,
    animate,
    showCloseButton = true,
}) => {
    const BuildModalTitle = BuildComponent({
        name: "Modal Title",
        defaultClasses: "flex flex-row items-center text-lg font-medium",
        conditionalClasses: [{ true: "ml-2" }],
        selectedClasses: [titleIcon ? true : false]
    });

    const BuildModalFooter = BuildComponent({
        name: "Modal Footer",
        defaultClasses: "grid gap-2",
        conditionalClasses: `grid-cols-{${buttons.length + (closeable && showCloseButton ? 1 : 0)}}`,
    })

    return (<Modal
        open={open}
        closeBtn={closeable}
        onClose={() => closeable && onClose()}
        className="w-[90%] sm:w-[460px] p-4 px-5"
        blur={blur}
        animate={animate}
    >
        <Modal.Title animate={animate}>
            {titleIcon}
            <span className={BuildModalTitle.classes}>
                {title}
            </span>
        </Modal.Title>
        <Modal.Body className="pt-2 pb-5" animate={animate}>
            <h1 className="text-lg text-left break-words w-full">
                {desc}
            </h1>
        </Modal.Body>
        <Modal.Footer className={BuildModalFooter.classes} animate={animate}>
            {buttons != false && buttons.map((button, index) => <Fragment key={index}>{button}</Fragment>)}

            {closeable && showCloseButton && <Button
                className="h-10"
                onClick={onClose}
            >
                Close
            </Button>}
        </Modal.Footer>
    </Modal>)
}

export default AlertModal;