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
import Log from "@utils/logger";

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

    const [showError, setShowError] = useState(false);

    const workspacesData = useSWR(
        ['api/fetchWorkspaces'],
        () => fetchWorkspaces({ token: Cookies.get("auth"), uid: validate?.data?.uid })
    );

    useEffect(() => {
        (async () => {
            if (workspacesData?.data?.error) {
                Log.error("swr error workspacesData: ", workspacesData?.data);
            }
            if (workspacesData?.data?.error?.code == "auth/id-token-expired" || workspacesData?.data?.error == "no-token") {
                //const token = await auth.users.getIdToken();
                router.replace(router.asPath);
                workspacesData.mutate();
            } else {
                if (workspacesData?.data?.success) {
                    _setWorkspaces(workspacesData?.data);
                    setLoadingWorkspaces(false);
                }
            }
            if (workspacesData.error) {
                Log.error("swr err: ", workspacesData.error);
                if (!showError) {
                    setShowError(true);
                    NotalUI.Alert.show({
                        title: "Error",
                        titleIcon: <CrossIcon size={24} fill="currentColor" />,
                        desc: "Couln't connect to the server. Please reload the page and make sure you have internet connection.",
                    });
                }
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
                                light="bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500"
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
        </motion.div>

        {(!_workspaceValidating && !loadingWorkspaces && _workspacesFiltered.length == 0) && (
            <div className="w-full h-full relative">
                <AddWorkspaceBanner />
            </div>
        )}

        <AddWorkspaceModal
            open={newWorkspaceModal}
            onClose={() => setNewWorkspaceModal(false)}
            onAdd={({ title, desc, starred, workspaceVisible, thumbnail }) => Handler.home({ NotalUI, workspacesData, auth, _workspaces }).workspace.create({ title, desc, starred, workspaceVisible, thumbnail })}
        />
    </div >)
}

export default HomeNavWorkspaces;