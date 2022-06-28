import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AnimateSharedLayout, motion } from "framer-motion";

import { Toast as ToastComponent, AlertModal } from "@components";
import type { ToastProps } from "components/Toast/Toast.d";

import type { AlertProps } from "components/Alert/Alert.d";

import { CreatePortal as Portal } from "@components";

import { isClient } from "@utils/isClient";
import { Log } from "@utils";

import { WorkboxInit } from "@utils/workboxInit";

function HOC({ children }: { children: ReactNode }) {
  const NotalUI = useNotalUI();
  useEffect(() => WorkboxInit(NotalUI), []);
  return <>{children}</>;
}

export interface NotalUIContextProps {
  Toast: {
    show: (arg: ToastProps) => void;
    showMultiple?: ([]: ToastProps[]) => void;
    close: (index: number) => void;
    closeAll?: () => void;
    render?: (index: number) => void;
    onClick?: ({ toast, index }: { toast: ToastProps; index: number }) => void;
  };
  Alert: {
    show: (arg: AlertProps) => void;
    close: () => void;
    onClose?: () => void;
  };
  AlertState: AlertProps;
}

const notalUIContext = createContext<NotalUIContextProps>(
  {} as NotalUIContextProps
);

export default function useNotalUI() {
  return useContext(notalUIContext);
}

export function NotalUIProvider(props: PropsWithChildren) {
  const [alert, setAlert] = useState<AlertProps>({
    visible: false,
  });
  const [showToastPortal, setShowToastPortal] = useState<boolean>(false);
  const [toastBuffer, setToastBuffer] = useState<ToastProps[]>([]);

  useEffect(() => {
    if (toastBuffer.length > 0) {
      setShowToastPortal(true);
    } else {
      // remove toast portal after delay
      setTimeout(() => setShowToastPortal(false), 500);
    }

    let interval: NodeJS.Timer | null = null;
    if (toastBuffer.filter((el) => el.timeEnabled).length > 0) {
      const filterToasts = toastBuffer.filter((el) => el.timeEnabled);
      if (filterToasts.length == 0) return;
      const lastToast = filterToasts[filterToasts.length - 1];
      const toastTimeEnabled = toastBuffer.findIndex(
        (el) => el.id == lastToast.id
      );
      if (interval) return;
      if (toastTimeEnabled == -1) return;
      interval = setInterval(
        () => Toast?.close && Toast?.close(toastTimeEnabled),
        toastBuffer[toastTimeEnabled].duration || 1000
      );
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [toastBuffer]);

  const Toast: NotalUIContextProps["Toast"] = {
    show: ({
      title,
      desc,
      icon,
      closeable = true,
      timeEnabled = true,
      duration = 3500,
      className = "dark:bg-neutral-800 bg-neutral-100 border-2 border-solid border-neutral-300 dark:border-neutral-800",
      buttons,
      showClose = true,
      type = "default",
    }: ToastProps) => {
      let btns;

      /**
       * Sending index to buttons function to know which index this toast is
       */
      if (typeof buttons == "function") {
        btns = buttons(toastBuffer.length + 1); // run the function
      } else if (Array.isArray(buttons)) {
        btns = buttons;
      }

      setToastBuffer([
        ...toastBuffer,
        {
          title,
          desc,
          icon,
          closeable,
          timeEnabled,
          className,
          buttons: btns,
          duration,
          id: Date.now(),
          showClose,
          type,
        },
      ]);

      return { id: Date.now() };
    },
    showMultiple: (multipleToasts: ToastProps[]) => {
      const allToasts = [...toastBuffer];

      multipleToasts.map((element, index) => {
        let btns;

        if (typeof element.buttons == "function") {
          btns = element.buttons(toastBuffer.length + 1);
        } else if (Array.isArray(element.buttons)) {
          btns = element.buttons;
        }

        allToasts.push({
          title: element?.title,
          desc: element?.desc,
          icon: element?.icon,
          closeable: element?.closeable,
          timeEnabled: element?.timeEnabled,
          className: element?.className,
          buttons: btns,
          duration: element?.duration,
          id: Date.now() + index,
          showClose: element?.showClose,
          type: element?.type,
        });
      });

      setToastBuffer([...allToasts]);
    },
    close: (index: number) => {
      const newToastArr = [...toastBuffer];
      newToastArr.splice(index, 1);
      setToastBuffer(newToastArr);
    },
    closeAll: () => {
      setToastBuffer([]);
    },
    render: (index: number) => {
      const toasts = [...toastBuffer];
      toasts[index]["rendered"] = true;
      setToastBuffer([...toasts]);
    },
  };

  const Alert: NotalUIContextProps["Alert"] = {
    show: ({
      title,
      desc,
      showCloseButton = true,
      closeable = true,
      titleIcon = false,
      blur = false,
      buttons = false,
      animate = true,
      customContent = false,
    }: AlertProps) => {
      setAlert({
        visible: true,
        title,
        desc,
        closeable,
        titleIcon,
        blur,
        buttons,
        animate,
        showCloseButton: buttons == false ? showCloseButton : false,
        customContent,
      });
    },
    close: () => {
      setAlert({ ...alert, visible: false });
    },
  };

  const value = { Toast, Alert, AlertState: alert };

  return (
    <notalUIContext.Provider value={value} {...props}>
      {props.children}
      <HOC>
        {isClient() && showToastPortal && (
          <Portal portalName="notal-toast">
            {/* @ts-ignore */}
            <AnimateSharedLayout>
              <motion.div
                layout
                variants={{
                  show: { opacity: 1, y: 0 },
                  hidden: { opacity: 0, y: 70 },
                }}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="absolute pointer-events-none left-0 right-0 top-0 bottom-0 z-50 flex flex-col justify-end items-end"
              >
                {toastBuffer.map((toast, index) => (
                  <ToastComponent
                    toast={toast}
                    key={toast.id}
                    onClick={() => {
                      if (!toast?.closeable) return;

                      if (typeof Toast?.onClick == "function")
                        Toast?.onClick({ toast, index });
                      else Toast?.close(index);
                    }}
                    onRender={() => Toast.render && Toast?.render(index)}
                  />
                ))}
              </motion.div>
            </AnimateSharedLayout>
          </Portal>
        )}
        <AlertModal
          alert={alert}
          onClose={() => {
            if (!alert.closeable) return;

            if (typeof Alert?.onClose == "function") Alert?.onClose();
            else Alert?.close();
          }}
        />
      </HOC>
    </notalUIContext.Provider>
  );
}
