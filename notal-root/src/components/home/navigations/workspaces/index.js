import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import useSWR from "swr";
import { useRouter } from "next/router";

import { CheckToken } from "@utils";
import useAuth from "@hooks/auth";
//import useNotalUI from "@hooks/notalui";
import { fetchWorkspaces } from "@utils/fetcher";
import {
    AddWorkspaceBanner,
    AddWorkspaceButton,
    AddWorkspaceModal,
    DeleteWorkspaceModal,
    HomeWorkspaceCard,
    Select,
    Tooltip,
    HomeNavTitle
} from '@components';
import {
    DashboardFilledIcon, FilterIcon
} from '@icons';
import { FilterWorkspaces } from "@utils/filterWorkspaces";

const HomeNavWorkspaces = ({ validate, isValidating }) => {
    const auth = useAuth();
    const router = useRouter();
    //const NotalUI = useNotalUI();

    // Modals
    const [newWorkspaceModal, setNewWorkspaceModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ workspace: -1, visible: false });

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
            if (workspacesData?.data?.error?.code == "auth/id-token-expired") {
                //const token = await auth.users.getIdToken();
                setTimeout(() => {
                    router.replace(router.asPath);
                    workspacesData.mutate();
                }, 5000);
            } else {
                if (workspacesData?.data?.success) {
                    _setWorkspaces(workspacesData?.data);
                    setLoadingWorkspaces(false);
                }
            }
            if (workspacesData.error) {
                console.error("swr err: ", workspacesData.error);
            }
            const token = await auth.users.getIdToken();
            const res = CheckToken({ token: token.res, props: { validate } });
            if (!res) {
                setTimeout(() => router.replace(router.asPath), 1000);
            }
        })();
    }, [workspacesData]);

    useEffect(() => {
        _setWorkspaceValidating(workspacesData.isValidating);
        isValidating(workspacesData.isValidating);
    }, [workspacesData.isValidating]);

    useEffect(() => {
        (!_workspaces?.error && !loadingWorkspaces) && _setWorkspacesFiltered(FilterWorkspaces({ workspaces: _workspaces?.data, filter }));
    }, [filter, _workspaces]);

    const workspace = {
        create: async ({ title, desc, starred }) => {
            workspacesData.mutate({ ..._workspaces, data: [..._workspaces.data, { updatedAt: Date.now(), createdAt: Date.now(), title, desc, starred, workspaceVisible: false }] }, false);
            await auth.workspace.createWorkspace({ title, desc, starred, workspaceVisible: false });
            workspacesData.mutate(); // get refreshed workspaces
        },
        delete: async ({ id }) => {
            setDeleteModal({ visible: false, workspace: -1 }); // set visiblity to false and id to -1
            const newWorkspaces = _workspaces.data;
            newWorkspaces.splice(_workspaces.data.findIndex(el => el._id == id), 1);
            workspacesData.mutate({ ..._workspaces, data: [...newWorkspaces] }, false);
            auth.workspace.deleteWorkspace({ id });
        },
        star: async ({ id }) => {
            const newWorkspaces = _workspaces.data;
            const workspaceIndex = newWorkspaces.findIndex(el => el._id == id)
            newWorkspaces[workspaceIndex].starred = !newWorkspaces[workspaceIndex].starred;
            newWorkspaces[workspaceIndex].updatedAt = Date.now(); // update date
            workspacesData.mutate({ ..._workspaces, data: [...newWorkspaces] }, false);
            auth.workspace.starWorkspace({ id });
        },
    }

    return (<div className="flex flex-1 px-8 py-4 flex-col overflow-y-auto overflow-x-hidden">
        <div className="w-full grid gap-2 flex-row items-center flex-wrap grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
            <HomeNavTitle title="Workspaces">
                <DashboardFilledIcon size={24} fill="currentColor" />
            </HomeNavTitle>
            <div className="flex-1 flex flex-row items-center justify-end">
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
        </div>

        <motion.div
            initial="hidden"
            animate="show"
            className="relative pb-4 mt-4 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 items-start auto-rows-max"
        >
            <AnimatePresence>
                {!loadingWorkspaces && _workspacesFiltered.map((element, index) => <HomeWorkspaceCard
                    workspace={element}
                    key={index}
                    index={index}
                    onStar={() => workspace.star({ id: element._id })}
                    onDelete={() => setDeleteModal({ ...deleteModal, visible: true, workspace: element._id })}
                />)}
            </AnimatePresence>

            {loadingWorkspaces && [1, 2, 3, 4].map((item) => <HomeWorkspaceCard skeleton key={item} />)}
            {!loadingWorkspaces && <AddWorkspaceButton
                onClick={() => setNewWorkspaceModal(true)}
                workspaceLength={_workspacesFiltered?.length}
            />}

            {/*<Button onClick={() => NotalUI.Toast.trigger({ title: "Selam!", desc: "ov yee" })}>
                asdkasdj
            </Button>*/}

        </motion.div>

        {(!_workspaceValidating && !loadingWorkspaces && _workspacesFiltered.length == 0) && (
            <div className="w-full h-full relative">
                <AddWorkspaceBanner />
            </div>
        )}

        <DeleteWorkspaceModal
            open={deleteModal.visible}
            onClose={() => setDeleteModal({ ...deleteModal, visible: false })}
            onDelete={() => {
                setDeleteModal({ ...deleteModal, visible: false });
                workspace.delete({ id: deleteModal.workspace });
            }}
        />
        <AddWorkspaceModal
            open={newWorkspaceModal}
            onClose={() => setNewWorkspaceModal(false)}
            onAdd={({ title, desc, starred }) => workspace.create({ title, desc, starred })}
        />
    </div >)
}

export default HomeNavWorkspaces;