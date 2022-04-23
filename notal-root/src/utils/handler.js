import Log from "@utils/logger"

const Handler = {
    workspace: ({
        workspaceData,
        auth,
        _workspace,
        props,
        NotalUI
    }) => {
        return {
            edit: async ({ title = _workspace?.data?.title, desc = _workspace?.data?.desc, workspaceVisible = _workspace?.data?.workspaceVisible ?? false, thumbnail }) => {
                /*
                // check for any changes
                if (
                    _workspace?.data?.title == title
                    && _workspace?.data?.desc == desc
                    && _workspace?.data?.workspaceVisible == workspaceVisible
                    && _workspace?.data?.thumbnail != thumbnail) return;
                    */
                await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, title, desc, workspaceVisible, thumbnail } }, false);
                const data = await auth.workspace.editWorkspace({ id: _workspace?.data?._id, title, desc, workspaceVisible, thumbnail });
                Log.debug("editData:", data);
                if (data.success) {
                    workspaceData.mutate();
                    window.gtag("event", "editWorkspace", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
                } else {
                    NotalUI.Alert.show({
                        title: "Error",
                        desc: data?.error,
                    });
                    workspaceData.mutate();
                }
            },
            star: async () => {
                await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, starred: !_workspace?.data?.starred } }, false);
                const data = await auth.workspace.starWorkspace({ id: _workspace?.data?._id });
                Log.debug("starData:", data);
                if (data.success) {
                    window.gtag("event", "starWorkspace", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
                } else {
                    NotalUI.Alert.show({
                        title: "Error",
                        desc: data?.error,
                    });
                    workspaceData.mutate();
                }
            },
            delete: async (router) => {
                const data = await auth.workspace.deleteWorkspace({ id: _workspace?.data?._id });

                if (data.success) {
                    router.replace("/home");
                } else {
                    console.error("error on delete workspace: ", data.error);
                    NotalUI.Alert.show({
                        title: "Error",
                        desc: data?.error,
                    });
                    workspaceData.mutate();
                }
            },
            field: {
                add: async ({ title, sortBy }) => {
                    const currFields = _workspace?.data?.fields || [];
                    await workspaceData.mutate({
                        ..._workspace,
                        data: {
                            ..._workspace.data,
                            fields: [
                                ...currFields,
                                {
                                    _id: Date.now(),
                                    title,
                                    updatedAt: Date.now(),
                                    createdAt: Date.now(),
                                    sortBy,
                                    owner: auth.authUser.uid,
                                    cards: []
                                }
                            ]
                        }
                    }, false)
                    const data = await auth.workspace.field.addField({ title, id: _workspace?.data?._id, sortBy });
                    Log.debug("addField data: ", data);
                    if (data?.success) {
                        workspaceData.mutate(); // Refresh data in order to get new ID's
                        window.gtag("event", "addField", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
                    } else {
                        NotalUI.Alert.show({
                            title: "Error",
                            desc: data?.error,
                        });
                        workspaceData.mutate();
                    }
                },
                edit: async ({ fieldId, title }) => {
                    const currFields = _workspace?.data?.fields || [];
                    const fieldIndex = currFields.findIndex(field => field._id == fieldId);
                    currFields[fieldIndex].title = title;

                    await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, fields: currFields } }, false);

                    const data = await auth.workspace.field.editField({ field: currFields[fieldIndex], workspaceId: _workspace?.data?._id });

                    if (!data?.success) {
                        console.error("error on edit field: ", data.error);
                        NotalUI.Alert.show({
                            title: "Error",
                            desc: data?.error,
                        });
                    }
                },
                delete: async ({ id }) => {
                    const newFields = _workspace?.data?.fields;
                    newFields.splice(_workspace?.data?.fields.findIndex(el => el._id == id), 1);
                    await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, fields: newFields } }, false);
                    const data = await auth.workspace.field.removeField({ id, workspaceId: _workspace?.data?._id });
                    Log.debug("deleteField data: ", data);
                    window.gtag("event", "deleteField", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
                    if (!data?.success) {
                        NotalUI.Alert.show({
                            title: "Error",
                            desc: "Couldn't perform the action you want. Please check the console and contact via erenkulaksz@gmail.com"
                        });
                        workspaceData.mutate();
                    }
                },
                collapse: async ({ id }) => {
                    const newFields = _workspace?.data?.fields;
                    const fieldIndex = _workspace?.data?.fields.findIndex(el => el._id == id);
                    if (newFields[fieldIndex]["collapsed"]) {
                        newFields[fieldIndex]["collapsed"] = false;
                    } else {
                        newFields[fieldIndex]["collapsed"] = true;
                    }
                    await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, fields: newFields } }, false);
                    const data = await auth.workspace.field.editField({
                        id,
                        field: {
                            _id: newFields[fieldIndex]?._id,
                            title: newFields[fieldIndex]?.title,
                            filterBy: newFields[fieldIndex]?.filterBy,
                            collapsed: !!newFields[fieldIndex]?.collapsed,
                        },
                        workspaceId: _workspace?.data?._id,
                    });
                    if (!data?.success) {
                        NotalUI.Alert.show({
                            title: "Error",
                            desc: "Couldn't perform the action you want. Please check the console and contact via erenkulaksz@gmail.com"
                        });
                        workspaceData.mutate();
                    }
                }
            },
            card: {
                add: async ({ fieldId, title, desc, color, tags, image }) => {
                    const newFields = _workspace?.data?.fields;
                    newFields[_workspace?.data?.fields?.findIndex(el => el._id == fieldId)].cards?.push(
                        {
                            _id: Date.now(),
                            title,
                            desc,
                            color,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            tags,
                            owner: auth.authUser.uid,
                            image,
                        }
                    );
                    await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, fields: newFields } }, false);
                    const data = await auth.workspace.field.addCard({
                        id: fieldId, workspaceId: _workspace?.data?._id, title, desc, color, tags, image
                    });
                    Log.debug("addCardToField data: ", data);
                    if (data?.success) {
                        workspaceData.mutate();
                        window.gtag("event", "addCardToField", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
                    } else if (data?.error == "tag-title-maxlength") {
                        NotalUI.Toast.show({
                            title: "Error",
                            desc: "Maximum tag title length is 16 characters.",
                            type: "error",
                        });
                    } else if (data?.error == "tag-color-invalid") {
                        NotalUI.Toast.show({
                            title: "Error",
                            desc: "Invalid color value. Please start color value with #",
                            type: "error",
                        });
                    } else {
                        NotalUI.Alert.show({
                            title: "Error",
                            desc: "Couldn't perform the action you want. Please check the console and contact via erenkulaksz@gmail.com"
                        });
                        Log.error("add card error: ", data?.error);
                    }
                },
                edit: async ({ title, desc, id, fieldId, color = "#ff0000", tag = {} }) => {
                    const newFields = _workspace?.data?.fields;
                    const cards = newFields[_workspace?.data?.fields?.findIndex(el => el._id == fieldId)].cards;
                    cards[cards.findIndex(el => el._id == id)] = {
                        ...cards[cards.findIndex(el => el._id == id)],
                        title,
                        desc,
                        color,
                        tag,
                    }; // update card completely
                    await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, fields: newFields } }, false);
                    const data = await auth.workspace.field.editCard({ id, workspaceId: _workspace?.data?._id, fieldId, title, desc, color, tag });
                    Log.debug("edit card data: ", data);
                },
                delete: async ({ id, fieldId }) => {
                    const newFields = _workspace?.data?.fields;
                    const cardIndex = newFields[_workspace?.data?.fields.findIndex(el => el._id == fieldId)].cards.findIndex(el => el._id == id);
                    newFields[_workspace?.data?.fields.findIndex(el => el._id == fieldId)].cards.splice(cardIndex, 1);
                    await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, fields: newFields } }, false);
                    const data = await auth.workspace.field.removeCard({ id, fieldId, workspaceId: _workspace?.data?._id });
                    Log.debug("removeCard data: ", data);
                    if (!data.success) {
                        NotalUI.Alert.show({
                            title: "Error",
                            desc: "Couldn't perform the action you want. Please check the console and contact via erenkulaksz@gmail.com"
                        });
                        Log.debug("delete card error: ", data?.error);
                        workspaceData.mutate();
                    }
                },
                reOrder: async ({ cardId, destination, source }) => {
                    // destination: { index: 0, droppableId: "xxx" }

                    const newFields = _workspace?.data?.fields;
                    const newFieldIndex = newFields?.findIndex(el => el._id == source.droppableId);
                    const newField = _workspace?.data?.fields[newFieldIndex];
                    const copyCard = { ...newField?.cards[source.index] };

                    newField?.cards?.splice(source.index, 1);

                    const insertFieldIndex = newFields?.findIndex(el => el._id == destination.droppableId);
                    const newInsertField = newFields[insertFieldIndex];

                    newInsertField?.cards?.splice(destination.index, 0, copyCard);

                    await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, fields: newFields } }, false);
                    console.log("copyCard: ", copyCard);
                }
            }
        }
    },
    home: ({
        NotalUI,
        workspacesData,
        auth,
        _workspaces,
    }) => {
        return {
            workspace: {
                create: async ({ title, desc, starred, workspaceVisible, thumbnail }) => {
                    // check how many workspaces user has on client, first
                    if (_workspaces?.data?.length >= 20) {
                        NotalUI.Toast.show({
                            title: "Cannot create workspace",
                            desc: "Maximum of 20 workspaces is allowed at the moment.",
                            icon: <CrossIcon size={24} fill="currentColor" />,
                            className: "dark:bg-red-600 bg-red-500 text-white"
                        });
                        return;
                    }
                    workspacesData.mutate({
                        ..._workspaces,
                        data: [
                            ..._workspaces.data,
                            {
                                updatedAt: Date.now(),
                                createdAt: Date.now(),
                                title,
                                desc,
                                starred,
                                workspaceVisible,
                                thumbnail
                            }
                        ]
                    }, false);
                    const res = await auth.workspace.createWorkspace({ title, desc, starred, workspaceVisible, thumbnail });
                    if (res.success == true) {
                        workspacesData.mutate(); // get refreshed workspaces
                    } else if (res.success == false) {
                        Log.debug("RES ERR create workspace -> ", res);
                        NotalUI.Alert.show({
                            title: "Error",
                            desc: res?.error
                        });
                        workspacesData.mutate();
                    }
                },
                delete: async ({ id }) => {
                    const newWorkspaces = _workspaces.data;
                    newWorkspaces.splice(_workspaces.data.findIndex(el => el._id == id), 1);
                    workspacesData.mutate({ ..._workspaces, data: [...newWorkspaces] }, false);
                    const res = await auth.workspace.deleteWorkspace({ id });
                    if (!res?.success) {
                        NotalUI.Toast.show({
                            desc: "An error occurred while deleting workspace.",
                            icon: <CrossIcon size={24} fill="currentColor" />,
                            className: "dark:bg-red-600 bg-red-500 text-white"
                        });
                        Log.debug("del res -> ", res);
                    }
                },
                star: async ({ id }) => {
                    const newWorkspaces = _workspaces.data;
                    const workspaceIndex = newWorkspaces.findIndex(el => el._id == id)
                    newWorkspaces[workspaceIndex].starred = !newWorkspaces[workspaceIndex].starred;
                    newWorkspaces[workspaceIndex].updatedAt = Date.now(); // update date
                    workspacesData.mutate({ ..._workspaces, data: [...newWorkspaces] }, false);
                    const res = await auth.workspace.starWorkspace({ id });
                    if (!res?.success) {
                        NotalUI.Toast.show({
                            desc: "An error occurred while starring workspace.",
                            icon: <CrossIcon size={24} fill="currentColor" />,
                            className: "dark:bg-red-600 bg-red-500 text-white"
                        });
                        Log.debug("del res -> ", res);
                    }
                },
            }
        }
    }
}

export default Handler;