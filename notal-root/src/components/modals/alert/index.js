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
    customContent = false,
}) => {
    const BuildModalTitle = BuildComponent({
        name: "Modal Title",
        defaultClasses: "flex flex-row items-center text-lg font-medium",
        conditionalClasses: [{ true: "ml-1" }],
        selectedClasses: [(titleIcon ? true : false)]
    });

    const BuildModalFooter = BuildComponent({
        name: "Modal Footer",
        conditionalClasses: [{
            default: `justify-between flex-row flex w-full`,
            false: "flex items-end justify-end"
        }],
        selectedClasses: [buttons]
    });

    return (<Modal
        open={open}
        closeBtn={closeable}
        onClose={() => closeable && onClose()}
        className="w-[90%] sm:w-[400px] p-4 px-5"
        blur={blur}
        animate={animate}
    >
        {customContent != false && customContent}
        {(titleIcon || title) && <Modal.Title animate={animate}>
            {titleIcon}
            {title && <span className={BuildModalTitle.classes}>
                {title}
            </span>}
        </Modal.Title>}
        {desc && <Modal.Body className="pt-2 pb-5" animate={animate}>
            {desc && <h1 className="text-lg text-left break-words w-full">
                {desc}
            </h1>}
        </Modal.Body>}
        {buttons != false && <Modal.Footer>
            <div className={BuildModalFooter.classes}>
                {buttons.map((button, index) => <Fragment key={index}>{button}</Fragment>)}
            </div>
        </Modal.Footer>}
        {showCloseButton && <Modal.Footer className="justify-end" animate={animate}>
            {closeable && showCloseButton && <Button
                className="h-10 w-1/2"
                light="bg-red-500 dark:bg-red-700"
                onClick={onClose}
            >
                Close
            </Button>}
        </Modal.Footer>}
    </Modal>)
}

export default AlertModal;