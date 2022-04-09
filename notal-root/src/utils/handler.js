
const Handler = {
    workspace: ({
        workspaceData,
        auth,
        _workspace,
        props
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
                window.gtag("event", "editWorkspace", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
                console.log("editData:", data);
            },
            star: async () => {
                await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, starred: !_workspace?.data?.starred } }, false);
                const data = await auth.workspace.starWorkspace({ id: _workspace?.data?._id });
                console.log("starData:", data);
                window.gtag("event", "starWorkspace", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
            },
            delete: async (router) => {
                const data = await auth.workspace.deleteWorkspace({ id: _workspace?.data?._id });
                if (data.success) router.replace("/home");
                else if (data?.error) console.error("error on delete workspace: ", data.error);
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
                    workspaceData.mutate(); // Refresh data in order to get new ID's
                    console.log("addField data: ", data);
                    window.gtag("event", "addField", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
                },
                edit: async ({ fieldId, title }) => {
                    const currFields = _workspace?.data?.fields || [];
                    const fieldIndex = currFields.findIndex(field => field._id == fieldId);
                    currFields[fieldIndex].title = title;

                    await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, fields: currFields } }, false);

                    const data = await auth.workspace.field.editField({ field: currFields[fieldIndex], workspaceId: _workspace?.data?._id });

                    if (data?.error) {
                        console.error("error on edit field: ", data.error);
                    }
                },
                delete: async ({ id }) => {
                    const newFields = _workspace?.data?.fields;
                    newFields.splice(_workspace?.data?.fields.findIndex(el => el._id == id), 1);
                    await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, fields: newFields } }, false);
                    const data = await auth.workspace.field.removeField({ id, workspaceId: _workspace?.data?._id });
                    console.log("deleteField data: ", data);
                    window.gtag("event", "deleteField", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
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
                    await auth.workspace.field.editField({
                        id,
                        field: {
                            _id: newFields[fieldIndex]?._id,
                            title: newFields[fieldIndex]?.title,
                            filterBy: newFields[fieldIndex]?.filterBy,
                            collapsed: !!newFields[fieldIndex]?.collapsed,
                        },
                        workspaceId: _workspace?.data?._id,
                    });
                }
            },
            card: {
                add: async ({ fieldId, title, desc, color, tag }) => {
                    const newFields = _workspace?.data?.fields;
                    newFields[_workspace?.data?.fields?.findIndex(el => el._id == fieldId)].cards?.push(
                        {
                            _id: Date.now(),
                            title,
                            desc,
                            color,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            tag,
                            owner: auth.authUser.uid
                        }
                    );
                    await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, fields: newFields } }, false);
                    const data = await auth.workspace.field.addCard({
                        id: fieldId, workspaceId: _workspace?.data?._id, title, desc, color, tag
                    });
                    console.log("addCardToField data: ", data);
                    workspaceData.mutate();
                    if (data.success != true) {
                        console.log("add card error: ", data?.error);
                    }
                    window.gtag("event", "addCardToField", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
                },
                delete: async ({ id, fieldId }) => {
                    const newFields = _workspace?.data?.fields;
                    const cardIndex = newFields[_workspace?.data?.fields.findIndex(el => el._id == fieldId)].cards.findIndex(el => el._id == id);
                    newFields[_workspace?.data?.fields.findIndex(el => el._id == fieldId)].cards.splice(cardIndex, 1);
                    await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, fields: newFields } }, false);
                    const data = await auth.workspace.field.removeCard({ id, fieldId, workspaceId: _workspace?.data?._id });
                    console.log("removeCard data: ", data);
                    if (data.success != true) {
                        console.log("delete card error: ", data?.error);
                    }
                },
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
                    } else if (res.success = false) {
                        console.log("RES ERR create workspace -> ", res);
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
                        console.log("del res -> ", res);
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
                        console.log("del res -> ", res);
                    }
                },
            }
        }
    }
}

export default Handler;