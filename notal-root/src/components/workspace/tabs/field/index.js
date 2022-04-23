import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";

import Handler from "@utils/handler";
import {
    WorkspaceField,
    WorkspaceAddFieldBanner,
    EditCardModal,
    EditFieldModal,
    AddCardModal,
} from "@components";
import useAuth from "@hooks/auth";
import useNotalUI from "@hooks/notalui";

const WorkspaceTabFields = ({
    _workspace,
    loadingWorkspace,
    isOwner,
    workspaceData,
    notFound,
    _workspaceValidating,
    props,
}) => {
    const auth = useAuth();
    const NotalUI = useNotalUI();

    const [addCardModal, setAddCardModal] = useState({ visible: false, fieldId: "", fieldTitle: "" });
    const [editCardModal, setEditCardModal] = useState({ visible: false, card: {}, fieldId: "" });
    const [editFieldModal, setEditFieldModal] = useState({ visible: false, title: "", fieldId: "" });

    return (
        <>
            {loadingWorkspace && [1, 2, 3].map((item) => (
                <WorkspaceField skeleton key={item} /> // show skeleton loaders
            ))}
            {!loadingWorkspace && _workspace?.data?.fields?.map((field, index) => (
                <Droppable droppableId={field._id} key={field._id}>
                    {(provided, snapshot) => (
                        <WorkspaceField
                            provided={provided}
                            field={field}
                            onDelete={() => Handler.workspace({ workspaceData, auth, _workspace, props, NotalUI }).field.delete({ id: field._id })}
                            onAddCard={() => setAddCardModal({ ...addCardModal, visible: true, fieldId: field._id, fieldTitle: field.title })}
                            onEditCard={({ card }) => setEditCardModal({ ...editCardModal, visible: true, card, fieldId: field._id })}
                            onDeleteCard={({ id }) => Handler.workspace({ workspaceData, auth, _workspace, props, NotalUI }).card.delete({ id, fieldId: field._id })}
                            onCollapse={() => Handler.workspace({ workspaceData, auth, _workspace, props, NotalUI }).field.collapse({ id: field._id })}
                            onSettings={() => setEditFieldModal({ ...editFieldModal, visible: true, title: field?.title, fieldId: field._id })}
                            isOwner={isOwner}
                            workspaceUsers={_workspace?.data?.users}
                        />
                    )}
                </Droppable>
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
                    Handler.workspace({ workspaceData, auth, _workspace, props, NotalUI }).card.edit({
                        id,
                        title,
                        desc,
                        fieldId: editCardModal.fieldId
                    })
                    setEditCardModal({ ...editCardModal, visible: false });
                }}
            />
            <EditFieldModal
                open={editFieldModal.visible}
                title={editFieldModal.title}
                onClose={() => setEditFieldModal({ ...editFieldModal, visible: false })}
                onEdit={({ title }) => {
                    Handler.workspace({ workspaceData, auth, _workspace, props, NotalUI }).field.edit({ title, fieldId: editFieldModal.fieldId });
                    setEditFieldModal({ ...editFieldModal, visible: false });
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
        </>
    )
}

export default WorkspaceTabFields;