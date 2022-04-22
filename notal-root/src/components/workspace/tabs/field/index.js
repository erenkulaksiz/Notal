import { useState, useEffect } from "react";
import Handler from "@utils/handler";

import {
    WorkspaceField,
    WorkspaceAddFieldBanner,
    EditCardModal,
    EditFieldModal,
    WorkspaceSettingsModal,
    AddCardModal,
    AddFieldModal
} from "@components";
import useAuth from "@hooks/auth";
import useNotalUI from "@hooks/notalui";

const WorkspaceTabFields = ({
    _workspace,
    validate,
    loadingWorkspace,
    isOwner,
    workspaceData,
    notFound,
    _workspaceValidating,
    props,
}) => {
    const auth = useAuth();
    const NotalUI = useNotalUI();

    const [addFieldModal, setAddFieldModal] = useState({ visible: false, workspaceTitle: "" });
    const [addCardModal, setAddCardModal] = useState({ visible: false, fieldId: "", fieldTitle: "" });
    const [editCardModal, setEditCardModal] = useState({ visible: false, card: {}, fieldId: "" });

    const [settingsModal, setSettingsModal] = useState(false);
    const [editField, setEditField] = useState({ visible: false, title: "", fieldId: "" });

    return (
        <>
            {loadingWorkspace && [1, 2, 3].map((item) => (
                <WorkspaceField skeleton key={item} /> // show skeleton loaders
            ))}
            {!loadingWorkspace && _workspace?.data?.fields?.map((field) => (
                <WorkspaceField
                    field={field}
                    key={field._id}
                    onDelete={() => Handler.workspace({ workspaceData, auth, _workspace, props, NotalUI }).field.delete({ id: field._id })}
                    onAddCard={() => setAddCardModal({ ...addCardModal, visible: true, fieldId: field._id, fieldTitle: field.title })}
                    onEditCard={({ card }) => setEditCardModal({ ...editCardModal, visible: true, card, fieldId: field._id })}
                    onDeleteCard={({ id }) => Handler.workspace({ workspaceData, auth, _workspace, props, NotalUI }).card.delete({ id, fieldId: field._id })}
                    onCollapse={() => Handler.workspace({ workspaceData, auth, _workspace, props, NotalUI }).field.collapse({ id: field._id })}
                    onSettings={() => setEditField({ ...editField, visible: true, title: field?.title, fieldId: field._id })}
                    isOwner={isOwner}
                    workspaceUsers={_workspace?.data?.users}
                />
            ))}
            {(
                !loadingWorkspace
                && !notFound
                && !_workspaceValidating
                && (!_workspace?.data?.fields || _workspace?.data?.fields?.length == 0)
            ) && <WorkspaceAddFieldBanner />}
            <EditCardModal
                open={editCardModal.visible}
                card={editCardModal.card}
                onClose={() => setEditCardModal({ ...editCardModal, visible: false })}
                onEdit={({ title, desc, id }) => {
                    // i think it gives edited card data here...
                    Handler.workspace({ workspaceData, auth, _workspace, props, NotalUI }).card.edit({
                        id,
                        title,
                        desc,
                        fieldId: editCardModal.fieldId
                    })
                    setEditCardModal({ ...editCardModal, visible: false });
                    //#TODO: finish this
                }}
            />
            <EditFieldModal
                open={editField.visible}
                title={editField.title}
                onClose={() => setEditField({ ...editField, visible: false })}
                onEdit={({ title }) => {
                    Handler.workspace({ workspaceData, auth, _workspace, props, NotalUI }).field.edit({ title, fieldId: editField.fieldId });
                    setEditField({ ...editField, visible: false });
                }}
            />
            <WorkspaceSettingsModal
                open={settingsModal}
                workspace={_workspace?.data}
                onClose={() => setSettingsModal(false)}
                onSubmit={({ title, desc, thumbnail }) => {
                    Handler.workspace({ workspaceData, auth, _workspace, props, NotalUI }).edit({ title, desc, thumbnail });
                    setSettingsModal(false);
                }}
                onUserChange={() => {
                    workspaceData.mutate();
                    //setSettingsModal(false);
                }}
            />
            <AddCardModal
                open={addCardModal.visible}
                fieldTitle={addCardModal.fieldTitle}
                onClose={() => setAddCardModal({ ...addCardModal, visible: false })}
                onAdd={({ title, desc, color, tags, image }) => {
                    Handler.workspace({ workspaceData, auth, _workspace, props, NotalUI }).card.add({ title, desc, color, tags, fieldId: addCardModal.fieldId, image });
                    setAddCardModal({ ...addCardModal, visible: false });
                }}
            />
            <AddFieldModal
                open={addFieldModal.visible}
                workspaceTitle={addFieldModal.workspaceTitle}
                onClose={() => setAddFieldModal({ ...addFieldModal, visible: false })}
                onAdd={({ title }) => {
                    Handler.workspace({ workspaceData, auth, _workspace, props, NotalUI }).field.add({ title, sortBy: "index" });
                    setAddFieldModal({ ...addFieldModal, visible: false });
                }}
            />
        </>
    )
}

export default WorkspaceTabFields;