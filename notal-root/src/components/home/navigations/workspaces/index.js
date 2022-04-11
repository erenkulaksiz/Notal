import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import useSWR from "swr";
import { useRouter } from "next/router";

import useAuth from "@hooks/auth";
import useNotalUI from "@hooks/notalui";
import { fetchWorkspaces } from "@utils/fetcher";
import {
    AddWorkspaceBanner,
    AddWorkspaceButton,
    AddWorkspaceModal,
    HomeWorkspaceCard,
    Select,
    Tooltip,
    HomeNavTitle,
    Button
} from '@components';
import {
    CheckIcon,
    CrossIcon,
    InfoIcon,
    DashboardFilledIcon,
    FilterIcon,
    SendIcon,
    DeleteIcon
} from '@icons';
import { FilterWorkspaces } from "@utils/filterWorkspaces";
import Handler from "@utils/handler";

const HomeNavWorkspaces = ({ validate, isValidating }) => {
    const auth = useAuth();
    const router = useRouter();
    const NotalUI = useNotalUI();

    // Modals
    const [newWorkspaceModal, setNewWorkspaceModal] = useState(false);

    const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
    const [filter, setFilter] = useState(null);
    const [_workspaces, _setWorkspaces] = useState({});
    const [_workspacesFiltered, _setWorkspacesFiltered] = useState([]);
    const [_workspaceValidating, _setWorkspaceValidating] = useState(true);

    const workspacesData = useSWR(
        ['api/fetchWorkspaces'],
        () => fetchWorkspaces({ token: Cookies.get("auth"), uid: validate?.data?.uid })
    );

    useEffect(() => {
        (async () => {
            if (workspacesData?.data?.error) {
                console.error("swr error workspacesData: ", workspacesData?.data);
            }
            if (workspacesData?.data?.error?.code == "auth/id-token-expired" || workspacesData?.data?.error == "no-token") {
                //const token = await auth.users.getIdToken();
                setTimeout(() => {
                    router.replace(router.asPath);
                    workspacesData.mutate();
                }, 2000);
            } else {
                if (workspacesData?.data?.success) {
                    _setWorkspaces(workspacesData?.data);
                    setLoadingWorkspaces(false);
                }
            }
            if (workspacesData.error) {
                console.error("swr err: ", workspacesData.error);
            }
        })();
    }, [workspacesData]);

    useEffect(() => {
        _setWorkspaceValidating(workspacesData.isValidating);
        isValidating(workspacesData.isValidating);
    }, [workspacesData.isValidating]);

    useEffect(() => {
        (!_workspaces?.error && !loadingWorkspaces) && _setWorkspacesFiltered([...FilterWorkspaces({ workspaces: _workspaces?.data, filter })]);
    }, [filter, _workspaces]);

    return (<div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <HomeNavTitle
            title="Workspaces"
            starredWorkspacesCount={_workspaces?.data?.filter(el => el.starred).length}
            count={{
                workspaces: _workspaces?.data?.length,
                starred: _workspaces?.data?.filter(el => !!el.starred).length,
                private: _workspaces?.data?.filter(el => !el.workspaceVisible).length
            }}
        >
            <DashboardFilledIcon size={24} fill="currentColor" />
        </HomeNavTitle>
        {/*<div className="w-full mt-4 grid gap-2 flex-row items-center flex-wrap grid-cols-1 sm:grid-cols-1 md:grid-cols-1">
            <div className="flex-1 flex px-4 flex-row items-center justify-end">
                <FilterIcon size={24} fill="currentColor" className="mr-4" />
                <Tooltip
                    content={<label htmlFor="workspaceFilter">Filter Workspaces</label>}
                    direction="bottom"
                    allContainerClassName="sm:w-64 w-full"
                >
                    <Select
                        onChange={e => setFilter(e.target.value)}
                        className="w-full"
                        id="workspaceFilter"
                        options={[{
                            id: null,
                            text: "All Workspaces"
                        },
                        {
                            id: "favorites",
                            text: "Favorites"
                        },
                        {
                            id: "privateWorkspaces",
                            text: "Private"
                        },
                        {
                            id: "createdAt",
                            text: "Create Time"
                        },
                        {
                            id: "updatedAt",
                            text: "Last Update Time"
                        }
                        ]}
                    />
                </Tooltip>
            </div>
                    </div>*/}

        <motion.div
            initial="hidden"
            animate="show"
            className="relative pb-4 px-4 mt-4 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 items-start auto-rows-max"
        >
            <AnimatePresence>
                {!loadingWorkspaces && _workspacesFiltered.map((element, index) => <HomeWorkspaceCard
                    workspace={element}
                    key={index}
                    index={index}
                    onStar={() => Handler.home({ NotalUI, workspacesData, auth, _workspaces }).workspace.star({ id: element._id })}
                    onDelete={() => NotalUI.Alert.show({
                        title: "Delete Workspace",
                        titleIcon: <DeleteIcon size={24} fill="currentColor" />,
                        desc: `Are you sure want to delete ${element?.title} workspace?`,
                        showCloseButton: false,
                        buttons: [
                            <Button
                                className="bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500 h-10"
                                onClick={() => NotalUI.Alert.close()}
                                key={1}
                                fullWidth="w-[49%]"
                            >
                                <CrossIcon size={24} fill="currentColor" />
                                Cancel
                            </Button>,
                            <Button
                                onClick={() => {
                                    Handler.home({ NotalUI, workspacesData, auth, _workspaces }).workspace.delete({ id: element._id });
                                    NotalUI.Alert.close();
                                }}
                                key={2}
                                fullWidth="w-[49%]"
                            >
                                <CheckIcon size={24} fill="currentColor" />
                                Delete
                            </Button>
                        ]
                    })
                    }
                />)}
            </AnimatePresence>

            {loadingWorkspaces && [1, 2, 3, 4].map((item) => <HomeWorkspaceCard skeleton key={item} />)}
            {!loadingWorkspaces && <AddWorkspaceButton
                onClick={() => setNewWorkspaceModal(true)}
                workspaceLength={_workspacesFiltered?.length}
            />}

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

        </motion.div>

        {
            (!_workspaceValidating && !loadingWorkspaces && _workspacesFiltered.length == 0) && (
                <div className="w-full h-full relative">
                    <AddWorkspaceBanner />
                </div>
            )
        }

        <AddWorkspaceModal
            open={newWorkspaceModal}
            onClose={() => setNewWorkspaceModal(false)}
            onAdd={({ title, desc, starred, workspaceVisible, thumbnail }) => Handler.home({ NotalUI, workspacesData, auth, _workspaces }).workspace.create({ title, desc, starred, workspaceVisible, thumbnail })}
        />
    </div >)
}

export default HomeNavWorkspaces;