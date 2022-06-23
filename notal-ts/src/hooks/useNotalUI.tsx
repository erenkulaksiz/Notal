import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { AnimateSharedLayout, motion } from "framer-motion";

import { Toast as ToastComponent } from "@components";
import { ToastProps } from "components/Toast/Toast.d";

import { CreatePortal as Portal } from "@components";

import { isClient } from "@utils/isClient";
import { Log } from "@utils";

interface NotalUIContextProps {
  Toast: {
    show: (arg: ToastProps) => void;
    showMultiple?: ([]: ToastProps[]) => void;
    close?: (index: number) => void;
    closeAll?: () => void;
    render?: (index: number) => void;
    onClick?: (index?: number) => void;
  };
}

const notalUIContext = createContext<NotalUIContextProps>(
  {} as NotalUIContextProps
);

export default function useNotalUI() {
  return useContext(notalUIContext);
}

export function NotalUIProvider(props: PropsWithChildren) {
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
        (el) => lastToast.id == el.id
      );
      if (!interval) {
        if (toastTimeEnabled == -1) return;
        interval = setInterval(
          () => Toast?.close && Toast?.close(toastTimeEnabled),
          toastBuffer[toastTimeEnabled].duration || 1000
        );
      }
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
      showClose,
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

      Log.debug(allToasts);
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

  const value = { Toast };

  return (
    <notalUIContext.Provider value={value} {...props}>
      {props.children}
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
                  title={toast?.title}
                  desc={toast?.desc}
                  icon={toast?.icon}
                  closeable={toast?.closeable}
                  className={toast?.className}
                  onClick={() => {
                    if (!toast?.closeable) return;

                    if (typeof Toast?.onClick == "function")
                      Toast?.onClick(index);
                    else Toast.close && Toast?.close(index);
                  }}
                  buttons={toast?.buttons}
                  showClose={toast?.showClose}
                  key={index}
                  id={toast.id}
                  onRender={() => Toast.render && Toast?.render(index)}
                  rendered={toast?.rendered}
                  type={toast?.type}
                />
              ))}
            </motion.div>
          </AnimateSharedLayout>
        </Portal>
      )}
    </notalUIContext.Provider>
  );
}
