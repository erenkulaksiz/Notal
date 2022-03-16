import { useState, useEffect } from "react";
import {
    Modal,
    Button,
    Input,
    Select,
    HomeWorkspaceCard,
    Tooltip
} from "@components";
import {
    EditIcon,
    CrossIcon,
    CheckIcon,
    SettingsIcon
} from "@icons";
import { HexColorPicker } from "react-colorful";
import { CardColors } from "@utils/constants";

const WorkspaceSettingsModal = ({ open, onClose, onSubmit, workspace }) => {
    const [editWorkspace, setEditWorkspace] = useState({ title: "", desc: "", thumbnail: { type: "image", file: "", color: "#666666", colors: { start: "#0eeaed", end: "#00575e" } } });

    useEffect(() => {
        console.log("thumb: ", workspace?.thumbnail);
        setEditWorkspace({
            title: workspace?.title,
            desc: workspace?.desc,
            thumbnail: workspace?.thumbnail
        })
    }, [workspace]);

    const close = () => {
        onClose();
        setEditWorkspace({
            title: workspace?.title,
            desc: workspace?.desc,
            thumbnail: workspace?.thumbnail,
        });
    }

    const submit = () => {
        if (editWorkspace.thumbnail.type != "image") {
            if (editWorkspace.thumbnail.type == "singleColor") {
                onSubmit({
                    title: editWorkspace.title,
                    desc: editWorkspace.desc,
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
        }
    }

    return (<Modal open={open} onClose={close} className="w-[90%] sm:w-[400px] p-4 px-5">
        <Modal.Title animate>
            <SettingsIcon size={24} fill="currentColor" />
            <span className="text-lg font-medium">Workspace Settings</span>
        </Modal.Title>
        <Modal.Body className="grid grid-cols-1 gap-2 pb-2 pt-4">
            <div className="w-full">
                <HomeWorkspaceCard
                    preview
                    workspace={{
                        workspaceVisible: workspace?.workspaceVisible,
                        starred: workspace?.starred,
                        title: editWorkspace.title,
                        desc: editWorkspace.desc,
                        thumbnail: editWorkspace.thumbnail,
                        _id: workspace?._id,
                    }}
                />
            </div>
            <label htmlFor="workspaceTitle">Workspace Title</label>
            <Input
                fullWidth
                placeholder="Workspace Title"
                onChange={(e) => setEditWorkspace({ ...editWorkspace, title: e.target.value })}
                value={editWorkspace.title}
                id="workspaceTitle"
            />
            <label htmlFor="workspaceTitle">Workspace Description</label>
            <Input
                fullWidth
                placeholder="Workspace Description"
                onChange={(e) => setEditWorkspace({ ...editWorkspace, desc: e.target.value })}
                value={editWorkspace.desc}
                id="workspaceDesc"
            />
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
            {editWorkspace?.thumbnail?.type == "singleColor" && <div className="flex flex-col items-start">
                <label htmlFor="cardColor">Card Color</label>
                <Tooltip
                    useFocus
                    blockContent={false}
                    containerClassName="px-0 py-0"
                    direction="right"
                    content={<div className="flex flex-col relative">
                        <HexColorPicker color={editWorkspace.thumbnail.color} onChange={(color) => setEditWorkspace({ ...editWorkspace, thumbnail: { ...editWorkspace.thumbnail, color } })} />
                        <div className="flex flex-row flex-wrap">
                            {CardColors.map((color, index) => <button
                                key={index}
                                className="w-6 h-6 m-1 rounded-lg"
                                style={{ backgroundColor: color.code }}
                                onClick={() => setEditWorkspace({ ...editWorkspace, thumbnail: { ...editWorkspace.thumbnail, color: color.code } })}
                            />)}
                        </div>
                    </div>}
                >
                    <input
                        type="text"
                        id="cardColor"
                        value={editWorkspace.thumbnail.color}
                        className="p-0 w-20 h-7 rounded mr-2"
                        style={{ backgroundColor: editWorkspace.thumbnail.color || "gray" }}
                        onChange={(e) => setNewWorkspace({ ...editWorkspace, thumbnail: { ...editWorkspace.thumbnail, color: e.target.value } })}
                        maxLength={7}
                    />
                </Tooltip>
            </div>}
            {editWorkspace?.thumbnail?.type == "gradient" && <div className="flex items-center">
                <div>
                    <label htmlFor="cardStartColor">Start Color</label>
                    <Tooltip
                        useFocus
                        blockContent={false}
                        containerClassName="px-0 py-0"
                        direction="right"
                        content={<div className="flex flex-col relative">
                            <HexColorPicker color={editWorkspace?.thumbnail?.colors?.start} onChange={(color) => setEditWorkspace({ ...editWorkspace, thumbnail: { ...editWorkspace.thumbnail, colors: { ...editWorkspace.thumbnail.colors, start: color } } })} />
                            <div className="flex flex-row flex-wrap">
                                {CardColors.map((color, index) => <button
                                    key={index}
                                    className="w-6 h-6 m-1 rounded-lg"
                                    style={{ backgroundColor: color.code }}
                                    onClick={() => setEditWorkspace({ ...editWorkspace, thumbnail: { ...newWorkspace.thumbnail, colors: { ...editWorkspace.thumbnail.colors, start: color.code } } })}
                                />)}
                            </div>
                        </div>}
                    >
                        <input
                            type="text"
                            id="cardStartColor"
                            value={editWorkspace?.thumbnail?.colors?.start}
                            className="p-0 w-20 h-7 rounded mr-2"
                            style={{ backgroundColor: editWorkspace?.thumbnail?.colors?.start || "gray" }}
                            onChange={(e) => setEditWorkspace({ ...editWorkspace, thumbnail: { ...editWorkspace.thumbnail, colors: { ...editWorkspace.thumbnail.colors, start: e.target.value } } })}
                            maxLength={7}
                        />
                    </Tooltip>
                </div>
                <div>
                    <label htmlFor="cardEndColor">End Color</label>
                    <Tooltip
                        useFocus
                        blockContent={false}
                        containerClassName="px-0 py-0"
                        direction="right"
                        content={<div className="flex flex-col relative">
                            <HexColorPicker color={editWorkspace?.thumbnail?.colors?.end} onChange={(color) => setEditWorkspace({ ...editWorkspace, thumbnail: { ...editWorkspace.thumbnail, colors: { ...editWorkspace.thumbnail.colors, end: color } } })} />
                            <div className="flex flex-row flex-wrap">
                                {CardColors.map((color, index) => <button
                                    key={index}
                                    className="w-6 h-6 m-1 rounded-lg"
                                    style={{ backgroundColor: color.code }}
                                    onClick={() => setEditWorkspace({ ...editWorkspace, thumbnail: { ...editWorkspace.thumbnail, colors: { ...editWorkspace.thumbnail.colors, end: color.code } } })}
                                />)}
                            </div>
                        </div>}
                    >
                        <input
                            type="text"
                            id="cardEndColor"
                            value={editWorkspace?.thumbnail?.colors?.end}
                            className="p-0 w-20 h-7 rounded mr-2"
                            style={{ backgroundColor: editWorkspace?.thumbnail?.colors?.end || "gray" }}
                            onChange={(e) => setEditWorkspace({ ...editWorkspace, thumbnail: { ...editWorkspace.thumbnail, colors: { ...editWorkspace.thumbnail.colors, end: e.target.value } } })}
                            maxLength={7}
                        />
                    </Tooltip>
                </div>
            </div>}
        </Modal.Body>
        <Modal.Footer className="justify-between" animate>
            <Button
                className="w-[49%] bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500 h-10"
                onClick={close}
            >
                <CrossIcon size={24} fill="currentColor" />
                Cancel
            </Button>
            <Button
                className="w-[49%] h-10"
                onClick={submit}
            >
                <CheckIcon size={24} fill="currentColor" />
                Edit Workspace
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default WorkspaceSettingsModal;