import { Fragment } from "react";
import { Modal, Button } from "@components";
import { BuildComponent } from "@utils/style/buildComponent";
import { AlertProps } from "./Alert.d";

export function AlertModal({ alert }: { alert: AlertProps }) {
  const BuildModalTitle = BuildComponent({
    name: "Modal Title",
    defaultClasses: "flex flex-row items-center text-lg font-medium",
    conditionalClasses: [{ true: "ml-1" }],
    selectedClasses: [alert.titleIcon ? true : false],
  });

  const BuildModalFooter = BuildComponent({
    name: "Modal Footer",
    conditionalClasses: [
      {
        true: `justify-between flex-row flex w-full`,
        false: "flex items-end justify-end",
      },
    ],
    selectedClasses: [Array.isArray(alert.buttons)],
  });

  return (
    <Modal
      open={alert.visible == true}
      closeBtn={alert.closeable}
      onClose={() => alert.onClose && alert.onClose()}
      className="w-[90%] sm:w-[400px] p-4 px-5"
      blur={alert.blur}
      animate={alert.animate}
    >
      {alert.customContent != false && alert.customContent}
      {(alert.titleIcon || alert.title) && (
        <Modal.Title animate={alert.animate}>
          {alert.titleIcon}
          {alert.title && (
            <span className={BuildModalTitle.classes}>{alert.title}</span>
          )}
        </Modal.Title>
      )}
      {alert.desc && (
        <Modal.Body className="pt-2 pb-5" animate={alert.animate}>
          {alert.desc && (
            <h1 className="text-lg text-left break-words w-full">
              {alert.desc}
            </h1>
          )}
        </Modal.Body>
      )}
      {alert.buttons != false && (
        <Modal.Footer>
          <div className={BuildModalFooter.classes}>
            {Array.isArray(alert.buttons) &&
              alert.buttons.map((button, index) => (
                <Fragment key={index}>{button}</Fragment>
              ))}
          </div>
        </Modal.Footer>
      )}
      {alert.showCloseButton && (
        <Modal.Footer className="justify-end" animate={alert.animate}>
          {alert.closeable && alert.showCloseButton && (
            <Button
              className="h-10 w-1/2"
              light="bg-red-500 dark:bg-red-700"
              onClick={() => alert.onClose && alert.onClose()}
            >
              Close
            </Button>
          )}
        </Modal.Footer>
      )}
    </Modal>
  );
}
