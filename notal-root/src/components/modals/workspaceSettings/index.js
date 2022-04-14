import { useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import {
    Modal,
    Button,
    Input,
    Select,
    HomeWorkspaceCard,
    Tooltip,
    Tab,
    Loading,
    ColorPicker
} from "@components";
import {
    CrossIcon,
    CheckIcon,
    SettingsIcon,
    CloudUploadIcon,
    AddIcon,
    DeleteIcon
} from "@icons";
import { CardColors } from "@utils/constants";
import useAuth from "@hooks/auth";
import useNotalUI from "@hooks/notalui";

import { Log } from "@utils";

const WorkspaceSettingsModal = ({ open, onClose, onSubmit, onUserChange, workspace }) => {
    const NotalUI = useNotalUI();
    const auth = useAuth();
    const michael = "https://i.pinimg.com/474x/78/8f/f7/788ff7a1a2c291a33ea995dc8de5dbcc.jpg";
    const [editWorkspace, setEditWorkspace] = useState({ title: "", desc: "", thumbnail: { type: "image", file: michael, color: "#666666", colors: { start: "#0eeaed", end: "#00575e" } } });
    const [thumbnailLoading, setThumbnailLoading] = useState(false);
    const [tab, setTab] = useState(0);
    const thumbnailRef = useRef();
    const [addWorkspaceOwner, setAddWorkspaceOwner] = useState("");

    const [editErr, setEditErr] = useState({ title: false, desc: false });

    useEffect(() => {
        Log.debug("thumb: ", workspace?.thumbnail);
        setEditWorkspace({
            title: workspace?.title,
            desc: workspace?.desc,
            workspaceVisible: workspace?.workspaceVisible,
            thumbnail: {
                ...workspace?.thumbnail,
                file: workspace?.thumbnail?.file || michael,
                color: workspace?.thumbnail?.color || "#ff0000",
                colors: {
                    start: workspace?.thumbnail?.colors?.start || "#00d0ff",
                    end: workspace?.thumbnail?.colors?.end || "#16b88f",
                }
            },
            users: workspace?.users,
            owner: workspace?.owner,
        });
    }, [workspace]);

    const workspaceOwner = editWorkspace?.users?.filter(el => el.uid == editWorkspace?.owner)[0];
    const workspaceUsers = editWorkspace?.users?.filter(el => el.uid != editWorkspace?.owner);

    const close = () => {
        onClose();
        setTab(0);
        setEditWorkspace({
            title: workspace?.title,
            desc: workspace?.desc,
            workspaceVisible: workspace?.workspaceVisible,
            thumbnail: workspace?.thumbnail,
            users: workspace?.users,
            owner: workspace?.owner,
        });
        setEditErr({ title: false, desc: false });
        setAddWorkspaceOwner("");
    }

    const submit = async () => {
        if (editWorkspace.title.length < 3) {
            setEditErr({ ...editErr, title: "Title must be minimum 3 characters long." });
            return;
        }
        if (editWorkspace.title.length > 32) {
            setEditErr({ ...editErr, title: "Title must be maximum 32 characters long." });
            return;
        }
        if (editWorkspace.desc.length > 96) {
            setEditErr({ ...editErr, desc: "Description must be maximum 96 characters long." });
            return;
        }
        if (editWorkspace.thumbnail.type != "image") {
            if (editWorkspace.thumbnail.type == "singleColor") {
                onSubmit({
                    title: editWorkspace.title,
                    desc: editWorkspace.desc,
                    workspaceVisible: editWorkspace.workspaceVisible,
                    thumbnail: {
                        type: editWorkspace.thumbnail.type,
                        color: editWorkspace.thumbnail.color,
                    },
                });
                onClose();
            } else if (editWorkspace.thumbnail.type == "gradient") {
                onSubmit({
                    title: editWorkspace.title,
                    desc: editWorkspace.desc,
                    workspaceVisible: editWorkspace.workspaceVisible,
                    thumbnail: {
                        type: editWorkspace.thumbnail.type,
                        colors: {
                            start: editWorkspace.thumbnail.colors.start,
                            end: editWorkspace.thumbnail.colors.end,
                        }
                    },
                });
                onClose();
            }
        } else if (editWorkspace.thumbnail.type == "image") {
            // image upload
            if (editWorkspace.thumbnail.fileData) {
                Log.debug(editWorkspace.thumbnail.fileData);
                const file = Math.round((editWorkspace.thumbnail.fileData.size / 1024));
                if (file >= 4096) {
                    alert("maximum upload size is 4mb");
                    return;
                }
                if (editWorkspace.thumbnail.fileData.type == "image/jpeg" || editWorkspace.thumbnail.fileData.type == "image/png" || editWorkspace.thumbnail.fileData.type == "image/jpg") {
                    setThumbnailLoading(true);
                    const res = await auth.workspace.uploadThumbnailTemp({ thumbnail: editWorkspace.thumbnail.fileData });

                    if (res.success) {
                        setThumbnailLoading(false);
                        // send res data to server now
                        Log.debug("thumbnail upload success! res: ", res);

                        onSubmit({
                            title: editWorkspace.title,
                            desc: editWorkspace.desc,
                            workspaceVisible: editWorkspace.workspaceVisible,
                            thumbnail: {
                                type: "image",
                                file: res.url
                            }
                        })
                        close();
                    } else {
                        Log.debug("thumbnail upload error: ", res);
                        setThumbnailLoading(false);
                    }
                } else {
                    alert("only png, jpeg and jpg is allowed");
                }
            } else {
                onSubmit({
                    title: editWorkspace.title,
                    desc: editWorkspace.desc,
                    workspaceVisible: editWorkspace.workspaceVisible,
                    thumbnail: editWorkspace.thumbnail
                })
                close();
            }
        }
    }

    const onThumbnailChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            let file = e.target.files[0];
            reader.onloadend = () => {
                setEditWorkspace({
                    ...editWorkspace,
                    thumbnail: {
                        ...editWorkspace.thumbnail,
                        file: reader.result,
                        fileData: file,
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    }

    const addUser = async ({ username }) => {
        const res = await auth.workspace.addUser({
            id: workspace._id,
            username,
        });
        Log.debug("res::", res);
        if (res?.success) {
            onUserChange();
        } else if (res?.error == "user-not-found") {
            alert("user not found");
        } else if (res?.error == "user-already-added") {
            alert("user already added");
        }
    }

    const deleteUser = async ({ id }) => {
        const res = await auth.workspace.removeUser({
            id: workspace._id,
            userId: id
        });
        if (res?.success) {
            onUserChange();
        } else {
            alert("error check console");
            Log.debug(res);
        }
    }

    return (<Modal open={open} onClose={() => !thumbnailLoading && close()} className="w-[90%] sm:w-[400px] p-4 px-5">
        <Modal.Title animate>
            <SettingsIcon size={24} fill="currentColor" />
            <span className="text-lg font-medium">{`Workspace ${workspace?.title} Settings`}</span>
        </Modal.Title>
        <Modal.Body className="pb-2 pt-4">
            {thumbnailLoading && <div className="absolute left-0 right-0 bottom-0 top-0 flex items-center justify-center bg-neutral-300/40 dark:bg-neutral-800/40 rounded-xl z-50">
                <Loading size="xl" />
            </div>}
            <div className="w-full mb-4">
                <HomeWorkspaceCard
                    preview
                    workspace={{
                        workspaceVisible: workspace?.workspaceVisible,
                        starred: workspace?.starred,
                        title: editWorkspace.title || "Enter a title",
                        desc: editWorkspace.desc,
                        thumbnail: editWorkspace.thumbnail,
                        _id: workspace?._id,
                    }}
                />
            </div>
            <Tab
                selected={tab}
                onSelect={({ index }) => setTab(index)}
                id="settingsWorkspaceTab"
                views={[
                    { title: "Workspace", id: "workspace" },
                    { title: "Thumbnail", id: "thumbnail" },
                    { title: "Users", id: "users" }
                ]}
            >
                <Tab.TabView index={0} className="pt-4 grid grid-cols-1 gap-2">
                    <label htmlFor="workspaceTitle">Workspace Title</label>
                    <Input
                        fullWidth
                        placeholder="Workspace Title"
                        onChange={(e) => setEditWorkspace({ ...editWorkspace, title: e.target.value })}
                        value={editWorkspace.title}
                        id="workspaceTitle"
                        maxLength={32}
                    />
                    {editErr.title != false && <span className="text-red-500">{editErr.title}</span>}
                    <label htmlFor="workspaceTitle">Workspace Description</label>
                    <Input
                        fullWidth
                        placeholder="Workspace Description"
                        onChange={(e) => setEditWorkspace({ ...editWorkspace, desc: e.target.value })}
                        value={editWorkspace.desc}
                        id="workspaceDesc"
                        maxLength={96}
                    />
                    {editErr.desc != false && <span className="text-red-500">{editErr.desc}</span>}
                </Tab.TabView>
                <Tab.TabView index={1} className="pt-4 grid grid-cols-1 gap-2">
                    <label htmlFor="thumbnailType">Workspace Thumbnail</label>
                    <Select
                        onChange={e => setEditWorkspace({ ...editWorkspace, thumbnail: { ...editWorkspace.thumbnail, type: e.target.value } })}
                        className="w-full"
                        id="thumbnailType"
                        value={editWorkspace?.thumbnail?.type}
                        options={[
                            {
                                id: "image",
                                text: "Image",
                            },
                            {
                                id: "singleColor",
                                text: "Single Color"
                            },
                            {
                                id: "gradient",
                                text: "Color Gradient"
                            }
                        ]}
                    />
                    {editWorkspace?.thumbnail?.type == "image" && <div
                        className="flex flex-col text-blue-400 mt-2 items-center justify-center w-full h-16 border-2 border-solid border-blue-400 group hover:border-blue-300 hover:text-blue-300 rounded-xl cursor-pointer"
                        onClick={() => {
                            if (!thumbnailLoading) thumbnailRef.current.click()
                        }}
                    >
                        <CloudUploadIcon size={24} fill="currentColor" />
                        Upload Thumbnail
                        <input type="file" ref={thumbnailRef} style={{ display: "none" }} onChange={onThumbnailChange} accept="image/png, image/jpeg" />
                    </div>}
                    {editWorkspace?.thumbnail?.type == "singleColor" && <div className="flex flex-col items-start">
                        <label htmlFor="cardColor">Workspace Color</label>
                        <ColorPicker
                            color={editWorkspace?.thumbnail?.color}
                            onColorChange={(color) => {
                                setEditWorkspace({ ...editWorkspace, thumbnail: { ...editWorkspace.thumbnail, color } })
                            }}
                            id="cardColor"
                        />
                    </div>}
                    {editWorkspace?.thumbnail?.type == "gradient" && <div className="flex items-center">
                        <div>
                            <label htmlFor="cardStartColor">Start Color</label>
                            <ColorPicker
                                color={editWorkspace?.thumbnail?.colors?.start}
                                onColorChange={(color) => {
                                    setEditWorkspace({ ...editWorkspace, thumbnail: { ...editWorkspace.thumbnail, colors: { ...editWorkspace.thumbnail.colors, start: color } } })
                                }}
                                id="cardStartColor"
                            />
                        </div>
                        <div>
                            <label htmlFor="cardEndColor">End Color</label>
                            <ColorPicker
                                color={editWorkspace?.thumbnail?.colors?.end}
                                onColorChange={(color) => {
                                    setEditWorkspace({ ...editWorkspace, thumbnail: { ...editWorkspace.thumbnail, colors: { ...editWorkspace.thumbnail.colors, end: color } } })
                                }}
                                id="cardEndColor"
                            />
                        </div>
                    </div>}
                </Tab.TabView>
                <Tab.TabView index={2} className="pt-4 grid grid-cols-1 gap-2">
                    <p className="border-b-2 border-b-solid border-b-neutral-200 dark:border-b-neutral-800 pb-2">Add up to 20 users to your workspace to work with together.</p>
                    <label>Workspace Owner</label>
                    <div className="w-full h-16 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        {workspaceOwner?.username}
                    </div>
                    {workspaceUsers?.length != 0 && <div className="flex gap-2 flex-col">
                        <label>Workspace Users ({workspaceUsers?.length})</label>
                        {workspaceUsers?.map((user, index) => (<div
                            key={index}
                            className="flex flex-row justify-between items-center w-full h-16 bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg text-black dark:text-white"
                        >
                            <span>{user?.username}</span>
                            <Button
                                onClick={() => deleteUser({ id: user?.uid })}
                                size="sm"
                                className="px-2"
                                light
                            >
                                <DeleteIcon size={24} className="fill-red-700 dark:fill-red-600" />
                            </Button>
                        </div>))}
                    </div>}
                    <div className="flex flex-row">
                        <Input
                            fullWidth
                            containerClassName="flex-1"
                            placeholder="Username"
                            value={addWorkspaceOwner}
                            onChange={(e) => setAddWorkspaceOwner(e.target.value)}
                        />
                        <Button className="ml-2" onClick={() => addUser({ username: addWorkspaceOwner })}>
                            <AddIcon size={24} fill="currentColor" />
                            Add User
                        </Button>
                    </div>
                </Tab.TabView>
            </Tab>
        </Modal.Body>
        <Modal.Footer className="justify-between" animate>
            <Button
                light="bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500 h-10"
                onClick={() => !thumbnailLoading && close()}
                fullWidth="w-[49%]"
            >
                <CrossIcon size={24} fill="currentColor" />
                Cancel
            </Button>
            <Button
                onClick={() => !thumbnailLoading && submit()}
                loading={thumbnailLoading}
                fullWidth="w-[49%]"
            >
                <CheckIcon size={24} fill="currentColor" />
                Edit Workspace
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default WorkspaceSettingsModal;