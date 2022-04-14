import { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { useRouter } from "next/router";

import { Log } from "@utils";

{/*<Button onClick={() =>
                NotalUI.Alert.show({
                    title: "Selam!",
                    titleIcon: <InfoIcon size={24} fill="currentColor" />,
                    desc: "ov yee selamlarrrrrselamlarrrrrselamlarrrrrselamlarrrrrselamlarrrrrselamlarrrrrselamlarrrrr",
                    blur: true
                })
            }>
                modal
            </Button>

            <Button onClick={() => NotalUI.Toast.show({
                title: "selam!!",
                desc: "your process is complete",
                icon: <CheckIcon size={24} fill="currentColor" />,
                //timeEnabled: false,
                className: "bg-green-800 text-white"
            })}
            >
                1
            </Button>

            <Button
                onClick={() =>
                    NotalUI.Toast.show({
                        title: "An update is available",
                        desc: "A new version of Notal is available. Refresh to use latest version.",
                        icon: <InfoIcon size={24} fill="currentColor" />,
                        className: "dark:bg-yellow-600 bg-yellow-500 text-white",
                        timeEnabled: false,
                        buttons: (index) => {
                            return [
                                <Button
                                    className="p-1 px-2 rounded hover:opacity-70"
                                    onClick={() => {
                                        router.reload();
                                        NotalUI.Toast.close(index);
                                    }}
                                    size="sm"
                                    light
                                >
                                    Refresh
                                </Button>,
                            ]
                        },
                    })
                }
            >
                2
            </Button>

            <Button
                onClick={() =>
                    NotalUI.Toast.show({
                        desc: "Successfully logged in as xxx",
                        icon: <InfoIcon size={24} fill="currentColor" />,
                        className: "dark:bg-green-600 bg-green-500 text-white",
                        time: 3500,
                    })
                }
            >
                log
            </Button>
            

            <Button
                onClick={() =>
                    NotalUI.Toast.show({
                        title: "selamlarrr",
                        desc: "seaaaaa",
                        timeEnabled: false,
                    })}
            >
                3
            </Button>

            <Button
                onClick={() =>
                    NotalUI.Alert.show({
                        title: "selamlarrr",
                    })}
            >
                m2
            </Button>

            <Button
                onClick={() => NotalUI.Toast.closeAll()}
            >
                close all
                </Button>*/}

{/* <Button
                onClick={() =>
                    NotalUI.Toast.showMultiple([{
                        title: "Welcome to Notal!",
                        desc: "I'm building this platform to keep track of your projects simpler way. Please share your feedback with email erenkulaksz@gmail.com",
                        icon: <SendIcon size={24} fill="currentColor" style={{ transform: "rotate(-36deg) scale(.8)", marginLeft: 2 }} />,
                        className: "dark:bg-green-600 bg-green-500 text-white max-w-[400px]",
                        closeable: true,
                    }, {
                        desc: `Logged in as sea`,
                        icon: <InfoIcon size={24} fill="currentColor" />,
                        className: "dark:bg-green-600 bg-green-500 text-white",
                        duration: 4500,
                        timeEnabled: true,
                        closeable: true,
                    }])
                }
            >
                log
            </Button>*/}

import {
    AcceptCookies,
    AlertModal,
    Toast as ToastComponent,
    ToastPortal
} from "@components";
import { isClient, WorkboxInit } from "@utils";

const notalUIContext = createContext();

const NotalUI_WB_HOC = ({ children }, props) => {
    const NotalUI = useNotalUI();
    const router = useRouter();

    useEffect(() => {
        WorkboxInit(NotalUI, router);
    }, []);

    // inject accept cookies and workbox

    return (<>
        {children}
        <AcceptCookies />
    </>)
}

export default function useNotalUI() {
    return useContext(notalUIContext);
}

export function NotalUIProvider(props) {
    const [alert, setAlert] = useState({ visible: false, title: "", desc: "" });

    const [showToastPortal, setShowToastPortal] = useState(false);
    const [toastBuffer, setToastBuffer] = useState([]);

    useEffect(() => {
        if (toastBuffer.length > 0) {
            setShowToastPortal(true);
        } else {
            // remove toast portal after delay
            setTimeout(() => setShowToastPortal(false), 500);
        }

        let interval = null;
        if (toastBuffer.filter(el => el.timeEnabled).length > 0) {
            const filterToasts = toastBuffer.filter(el => el.timeEnabled);
            if (filterToasts == -1) return;
            const lastToast = filterToasts[filterToasts.length - 1];
            const toastTimeEnabled = toastBuffer.findIndex(el => lastToast.id == el.id);
            if (!interval) {
                if (toastTimeEnabled == -1) return;
                interval = setInterval(() => {
                    // find latest toast with timeEnabled
                    Toast.close(toastTimeEnabled);
                }, toastBuffer[toastTimeEnabled].duration ?? 1000);
            }
        } else {
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        }
    }, [toastBuffer]);

    const Toast = {
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
        }) => {
            let btns;

            /**
             * Sending index to buttons function to know which index this toast is
             */
            if (typeof buttons == "function") {
                btns = buttons((toastBuffer.length + 1)); // run the function
            } else if (typeof buttons == "array") {
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
                }
            ]);
        },
        showMultiple: (multipleToasts) => {
            const allToasts = [...toastBuffer];

            multipleToasts.map((element, index) => {
                let btns;

                if (typeof element.buttons == "function") {
                    btns = element.buttons((toastBuffer.length + 1));
                } else if (typeof element.buttons == "array") {
                    btns = element.buttons
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
                })
            });

            setToastBuffer([...allToasts]);

            Log.debug(allToasts);
        },
        close: (index) => {
            const newToastArr = [...toastBuffer];
            newToastArr.splice(index, 1);
            setToastBuffer(newToastArr);
        },
        closeAll: () => {
            setToastBuffer([]);
        },
        render: (index) => {
            const toasts = [...toastBuffer];
            toasts[index]["rendered"] = true;
            setToastBuffer([...toasts]);
        }
    }

    const Alert = {
        show: ({
            title,
            desc,
            showCloseButton = true,
            closeable = true,
            titleIcon = false,
            blur = false,
            buttons = false,
            animate = true,
        }) => {
            setAlert({
                visible: true,
                title,
                desc,
                closeable,
                titleIcon,
                blur,
                buttons,
                animate,
                showCloseButton
            });
        },
        close: () => {
            setAlert({ ...alert, visible: false });
        }
    }

    const value = { Toast, Alert }

    return <notalUIContext.Provider value={value} {...props}>
        <NotalUI_WB_HOC>
            {props.children}
            {isClient && showToastPortal && <ToastPortal>
                <AnimatePresence>
                    <AnimateSharedLayout>
                        <motion.div
                            layout
                            variants={{
                                show: { opacity: 1, y: 0 },
                                hidden: { opacity: 0, y: 70 }
                            }}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            className="absolute pointer-events-none left-0 right-0 top-0 bottom-0 z-50 flex flex-col justify-end items-end"
                        >
                            <AnimatePresence>
                                {toastBuffer.map((toast, index) => <ToastComponent
                                    title={toast?.title}
                                    desc={toast?.desc}
                                    icon={toast?.icon}
                                    closeable={toast?.closeable}
                                    className={toast?.className}
                                    onClick={() => {
                                        if (!toast?.closeable) return;

                                        if (typeof Toast?.onClick == "function") {
                                            Toast?.onClick(index);
                                        } else {
                                            Toast.close(index);
                                        }
                                    }}
                                    buttons={toast?.buttons}
                                    showClose={toast?.showClose}
                                    key={index}
                                    id={toast.id}
                                    onRender={() => Toast.render(index)}
                                    rendered={toast?.rendered}
                                />)}
                            </AnimatePresence>
                        </motion.div>
                    </AnimateSharedLayout>
                </AnimatePresence>
            </ToastPortal>}
            <AlertModal
                open={alert.visible}
                title={alert.title}
                titleIcon={alert.titleIcon}
                blur={alert.blur}
                desc={alert.desc}
                buttons={alert.buttons}
                onClose={() => {
                    if (!alert.closeable) return;

                    if (typeof Alert?.onClose == "function") {
                        Alert?.onClose();
                    } else {
                        Alert.close();
                    }
                }}
                closeable={alert.closeable}
                showCloseButton={alert.showCloseButton}
                animate={alert.animate}
            />
        </NotalUI_WB_HOC>
    </notalUIContext.Provider>
}