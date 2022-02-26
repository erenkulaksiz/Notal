import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";

import useAuth from "@hooks/auth";

import { GetWorkspaces } from "@utils";

import {
    AddWorkspaceBanner,
    AddWorkspaceButton,
    AddWorkspaceModal,
    DeleteWorkspaceModal,
    HomeWorkspaceCard,
    Select,
    Tooltip
} from '@components';

import {
    DashboardFilledIcon, FilterIcon
} from '@icons';

const HomeNavWorkspaces = ({ workspaces, validate }) => {
    const auth = useAuth();
    // Modals
    const [newWorkspaceModal, setNewWorkspaceModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ workspace: -1, visible: false });

    const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
    const [filter, setFilter] = useState(null);
    const [_workspaces, _setWorkspaces] = useState([]);

    useEffect(() => {
        console.log("workspaces: ", workspaces);
        if (workspaces) {
            _setWorkspaces(workspaces.data);
            setLoadingWorkspaces(false);
        }
    }, [workspaces]);

    const workspace = {
        create: async ({ title, desc, starred }) => {
            const newWorkspaces = _workspaces;
            newWorkspaces.push({ title, desc, starred, createdAt: Date.now(), workspaceVisible: false });
            _setWorkspaces([...newWorkspaces]);

            const data = await auth.workspace.createWorkspace({ title, desc, starred, workspaceVisible: false });

            const authCookie = Cookies.get("auth");
            const workspaces = await GetWorkspaces({ uid: validate?.uid, token: authCookie });
            _setWorkspaces([...workspaces.data]);
        },
        delete: async ({ id }) => {
            setDeleteModal({ visible: false, workspace: -1 }); // set visiblity to false and id to -1

            const newWorkspaces = _workspaces;
            newWorkspaces.splice(_workspaces.findIndex(el => el._id == id), 1);
            _setWorkspaces([...newWorkspaces]);

            const data = await auth.workspace.deleteWorkspace({ id });
        },
        star: async ({ id }) => {
            const newWorkspaces = _workspaces;
            const workspaceIndex = newWorkspaces.findIndex(el => el._id == id)
            newWorkspaces[workspaceIndex].starred = !newWorkspaces[workspaceIndex].starred;
            _setWorkspaces([...newWorkspaces]);

            const data = await auth.workspace.starWorkspace({ id });
            if (data?.error) console.error("error on star workspace: ", data.error);
        },
        /*
        closeModal: () => {
            setNewWorkspaceVisible(false);
            setNewWorkspaceErr({ ...newWorkspace, desc: false, title: false });
            setNewWorkspace({ ...newWorkspace, title: "", desc: "", starred: "" });
        },
        */
        getWorkspacesWithFilter: (workspaces) => {
            switch (filter) {
                case "favorites":
                    if (workspaces) return workspaces.filter(el => el.starred == true);
                    else return []
                case "privateWorkspaces":
                    if (workspaces) return workspaces.filter(el => !!el?.workspaceVisible == false);
                    else return []
                default:
                    if (workspaces) return workspaces;
                    else return []
            }
        }
    }

    return (<div className="flex flex-1 px-8 py-4 flex-col">
        <div className="w-full flex-row items-center flex flex-wrap">
            <div className="flex flex-row h-10 items-center">
                <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 p-2 dark:bg-neutral-800 bg-neutral-100 mr-3 rounded-lg">
                    <div className="hidden md:flex">
                        <DashboardFilledIcon size={24} fill="currentColor" />
                    </div>
                    <div className="flex md:hidden">
                        <DashboardFilledIcon size={24} fill="currentColor" style={{ transform: "scale(0.8)" }} />
                    </div>
                </div>
                <h1 className="flex items-center text-lg md:text-2xl font-bold">Workspaces</h1>
            </div>
            <div className="flex flex-1 justify-end items-center">
                <div className="w-full sm:w-48 flex flex-row items-center justify-end">
                    <FilterIcon size={24} fill="currentColor" className="mr-4" />
                    <Tooltip content="Filter Workspaces" direction="bottom">
                        <Select
                            onChange={e => setFilter(e.target.value)}
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
                            }]}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>

        {!loadingWorkspaces && <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.03 }}
            className="relative pb-4 mt-4 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 items-start auto-rows-max"
        >
            <AnimatePresence>
                {workspace.getWorkspacesWithFilter(_workspaces).map((element, index) => <HomeWorkspaceCard
                    workspace={element}
                    key={index}
                    index={index}
                    onStar={() => workspace.star({ id: element._id })}
                    onDelete={() => setDeleteModal({ ...deleteModal, visible: true, workspace: element._id })}
                />)}
            </AnimatePresence>

            <AddWorkspaceButton onClick={() => setNewWorkspaceModal(true)} />
        </motion.div>}

        {loadingWorkspaces && <div>
            loading workspaces...
        </div>}

        {(!loadingWorkspaces && workspace.getWorkspacesWithFilter(_workspaces).length == 0) && (
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
    </div>)
}

export default HomeNavWorkspaces;