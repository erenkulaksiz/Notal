import { useState, useRef } from "react";
import { HexColorPicker } from "react-colorful";

import { CardColors } from "@utils/constants";

import {
    Modal,
    Button,
    Input,
    Checkbox,
    HomeWorkspaceCard,
    Select,
    Tooltip,
    Loading,
    Tab,
    ColorPicker
} from "@components";

import {
    AddIcon,
    CrossIcon,
    CheckIcon,
    StarFilledIcon,
    StarOutlineIcon,
    VisibleIcon,
    VisibleOffIcon,
    CloudUploadIcon
} from "@icons";

import useAuth from "@hooks/auth";

import Log from "@utils/logger"

const AddWorkspaceModal = ({ open, onClose, onAdd }) => {
    const auth = useAuth();
    const michael = "https://i.pinimg.com/474x/78/8f/f7/788ff7a1a2c291a33ea995dc8de5dbcc.jpg";

    const [newWorkspace, setNewWorkspace] = useState({ title: "Untitled", desc: "", starred: false, workspaceVisible: false, thumbnail: { type: "gradient", file: michael, color: "#666666", colors: { start: "#0eeaed", end: "#00575e" } } });
    const [newWorkspaceErr, setNewWorkspaceErr] = useState({ title: false, desc: false });
    const thumbnailRef = useRef();
    const [thumbnailLoading, setThumbnailLoading] = useState(false);

    const [tab, setTab] = useState(0);

    const close = () => {
        setNewWorkspaceErr({ ...newWorkspace, title: false, desc: false });
        setNewWorkspace({ ...newWorkspace, title: "Untitled", desc: "", starred: false, workspaceVisible: false, thumbnail: { type: "gradient", file: michael, color: "#666666", colors: { start: "#0eeaed", end: "#00575e" } } });
        setTab(0);
        onClose();
    }

    const submit = async () => {
        if (newWorkspace.title.length < 3) {
            setNewWorkspaceErr({ ...newWorkspaceErr, title: "Title must be minimum 3 characters long." });
            return;
        }
        if (newWorkspace.title.length > 32) {
            setNewWorkspaceErr({ ...newWorkspaceErr, title: "Title must be maximum 32 characters long." });
            return;
        }
        if (newWorkspace.desc.length > 96) {
            setNewWorkspaceErr({ ...newWorkspaceErr, desc: "Description must be maximum 96 characters long." });
            return;
        }
        if (newWorkspace.thumbnail.type != "image") {
            if (newWorkspace.thumbnail.type == "singleColor") {
                onAdd({
                    title: newWorkspace.title,
                    desc: newWorkspace.desc,
                    starred: newWorkspace.starred,
                    workspaceVisible: newWorkspace.workspaceVisible,
                    thumbnail: {
                        type: newWorkspace.thumbnail.type,
                        color: newWorkspace.thumbnail.color,
                    }
                });
                close();
            } else if (newWorkspace.thumbnail.type == "gradient") {
                onAdd({
                    title: newWorkspace.title,
                    desc: newWorkspace.desc,
                    starred: newWorkspace.starred,
                    workspaceVisible: newWorkspace.workspaceVisible,
                    thumbnail: {
                        type: newWorkspace.thumbnail.type,
                        colors: {
                            start: newWorkspace.thumbnail.colors.start,
                            end: newWorkspace.thumbnail.colors.end,
                        }
                    }
                });
                close();
            }
        } else {
            // image upload
            if (newWorkspace.thumbnail.fileData) {
                Log.debug(newWorkspace.thumbnail.fileData);
                const file = Math.round((newWorkspace.thumbnail.fileData.size / 1024));
                if (file >= 4096) {
                    alert("maximum upload size is 4mb");
                    return;
                }
                if (newWorkspace.thumbnail.fileData.type == "image/jpeg" || newWorkspace.thumbnail.fileData.type == "image/png" || newWorkspace.thumbnail.fileData.type == "image/jpg") {
                    setThumbnailLoading(true);
                    const res = await auth.workspace.uploadThumbnailTemp({ thumbnail: newWorkspace.thumbnail.fileData });

                    if (res.success) {
                        setThumbnailLoading(false);
                        // send res data to server now
                        Log.debug("thumbnail upload success! res: ", res);

                        onAdd({
                            title: newWorkspace.title,
                            desc: newWorkspace.desc,
                            starred: newWorkspace.starred,
                            workspaceVisible: newWorkspace.workspaceVisible,
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
                onAdd({
                    title: newWorkspace.title,
                    desc: newWorkspace.desc,
                    starred: newWorkspace.starred,
                    workspaceVisible: newWorkspace.workspaceVisible,
                    thumbnail: {
                        type: "image",
                        file: michael,
                    }
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
                setNewWorkspace({
                    ...newWorkspace,
                    thumbnail: {
                        ...newWorkspace.thumbnail,
                        file: reader.result,
                        fileData: file,
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    }

    return (<Modal open={open} onClose={() => !thumbnailLoading && close()} className="w-[90%] sm:w-[400px] p-4 px-5 relative">
        <Modal.Title animate>
            <AddIcon size={24} fill="currentColor" />
            <span className="text-lg font-medium ml-1">Add Workspace</span>
        </Modal.Title>
        <Modal.Body className="flex flex-col pb-2 min-h-[400px]" animate>
            {thumbnailLoading && <div className="absolute left-0 right-0 bottom-0 top-0 flex items-center justify-center bg-neutral-300/40 dark:bg-neutral-800/40 rounded-xl z-50">
                <Loading size="xl" />
            </div>}
            {/*<Input fullWidth icon={<UserIcon size={24} />} containerClassName="fill-neutral-600" placeholder="Workspace Title" />*/}
            <div className="w-full mb-4">
                <HomeWorkspaceCard
                    preview
                    workspace={{
                        workspaceVisible: newWorkspace.workspaceVisible,
                        title: newWorkspace.title || "Enter a title",
                        desc: newWorkspace.desc,
                        starred: newWorkspace.starred,
                        thumbnail: newWorkspace.thumbnail
                    }}
                />
            </div>
            <Tab
                selected={tab}
                onSelect={({ index }) => setTab(index)}
                id="workspaceTab"
                views={[
                    { title: "Workspace", id: "workspace" },
                    { title: "Thumbnail", id: "thumbnail" }
                ]}
            >
                <Tab.TabView index={0} className="pt-4 grid grid-cols-1 gap-2">
                    <label htmlFor="workspaceTitle">Workspace Title</label>
                    <Input
                        fullWidth
                        placeholder="Workspace Title"
                        onChange={(e) => setNewWorkspace({ ...newWorkspace, title: e.target.value })}
                        value={newWorkspace.title}
                        id="workspaceTitle"
                        maxLength={32}
                    />
                    {newWorkspaceErr.title != false && <span className="text-red-500">{newWorkspaceErr.title}</span>}
                    <label htmlFor="workspaceDescription">Workspace Description</label>
                    <Input
                        fullWidth
                        placeholder="Workspace Description"
                        onChange={(e) => setNewWorkspace({ ...newWorkspace, desc: e.target.value })}
                        value={newWorkspace.desc}
                        id="workspaceDescription"
                        maxLength={96}
                    />
                    {newWorkspaceErr.desc != false && <span className="text-red-500">{newWorkspaceErr.desc}</span>}
                    <div className="py-1 grid grid-cols-1 gap-2">
                        <div className="flex flex-row items-center">
                            {newWorkspace.starred ? <StarFilledIcon size={24} fill="currentColor" style={{ transform: "scale(0.7)" }} className="-ml-1" /> :
                                <StarOutlineIcon size={24} fill="currentColor" style={{ transform: "scale(0.7)" }} className="-ml-1" />}
                            <Checkbox
                                id="starredWorkspace"
                                value={newWorkspace.starred}
                                onChange={(e) => setNewWorkspace({ ...newWorkspace, starred: !newWorkspace.starred })}
                            >
                                Add to favorites
                            </Checkbox>
                        </div>
                        <div className="flex flex-row items-center">
                            {newWorkspace.workspaceVisible ? <VisibleIcon width={24} height={24} fill="currentColor" style={{ transform: "scale(0.7)" }} className="-ml-1" /> :
                                <VisibleOffIcon width={24} height={24} fill="currentColor" style={{ transform: "scale(0.7)" }} className="-ml-1" />}
                            <Checkbox
                                id="privateWorkspace"
                                value={!newWorkspace.workspaceVisible}
                                onChange={(e) => setNewWorkspace({ ...newWorkspace, workspaceVisible: !newWorkspace.workspaceVisible })}
                            >
                                Private Workspace
                            </Checkbox>
                        </div>
                    </div>
                </Tab.TabView>
                <Tab.TabView index={1} className="pt-4 grid grid-cols-1 gap-2">
                    <label htmlFor="thumbnailType">Workspace Thumbnail Type</label>
                    <Select
                        onChange={e => setNewWorkspace({ ...newWorkspace, thumbnail: { ...newWorkspace.thumbnail, type: e.target.value } })}
                        className="w-full"
                        id="thumbnailType"
                        options={[
                            {
                                id: "gradient",
                                text: "Color Gradient"
                            },
                            {
                                id: "image",
                                text: "Image",
                            },
                            {
                                id: "singleColor",
                                text: "Single Color"
                            },
                        ]}
                    />
                    {newWorkspace?.thumbnail?.type == "image" && <div
                        className="flex flex-col text-blue-400 mt-2 items-center justify-center w-full h-16 border-2 border-solid border-blue-400 group hover:border-blue-300 hover:text-blue-300 rounded-xl cursor-pointer"
                        onClick={() => {
                            if (!thumbnailLoading) thumbnailRef.current.click()
                        }}
                    >
                        <CloudUploadIcon size={24} fill="currentColor" />
                        Upload Thumbnail
                        <input type="file" ref={thumbnailRef} style={{ display: "none" }} onChange={onThumbnailChange} accept="image/png, image/jpeg" />
                    </div>}
                    {newWorkspace?.thumbnail?.type == "singleColor" && <div className="flex flex-col items-start">
                        <label htmlFor="cardColor">Workspace Color</label>
                        <ColorPicker
                            id="cardColor"
                            color={newWorkspace?.thumbnail?.color}
                            onColorChange={(color) => {
                                setNewWorkspace({ ...newWorkspace, thumbnail: { ...newWorkspace.thumbnail, color } })
                            }}
                        />
                    </div>}
                    {newWorkspace?.thumbnail?.type == "gradient" && <div className="flex items-center">
                        <div>
                            <label htmlFor="cardStartColor">Start Color</label>
                            <ColorPicker
                                id="cardStartColor"
                                color={newWorkspace?.thumbnail?.colors?.start}
                                onColorChange={(color) => {
                                    setNewWorkspace({ ...newWorkspace, thumbnail: { ...newWorkspace.thumbnail, colors: { ...newWorkspace.thumbnail.colors, start: color } } })
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="cardEndColor">End Color</label>
                            <ColorPicker
                                id="cardEndColor"
                                color={newWorkspace?.thumbnail?.colors?.end}
                                onColorChange={(color) => {
                                    setNewWorkspace({ ...newWorkspace, thumbnail: { ...newWorkspace.thumbnail, colors: { ...newWorkspace.thumbnail.colors, end: color } } })
                                }}
                            />
                        </div>
                    </div>}
                </Tab.TabView>
            </Tab>
        </Modal.Body>
        <Modal.Footer className="justify-between" animate>
            <Button
                light="bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500"
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
                Add Workspace
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default AddWorkspaceModal;