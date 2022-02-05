import { Button, Text, Grid, Input, Modal, Row, Checkbox } from '@nextui-org/react';
import { useState } from 'react';

import {
    AddIcon,
    CrossIcon,
    CheckIcon
} from '../../../icons';

const AddWorkspaceModal = ({ newWorkspaceVisible, setNewWorkspaceVisible, onAdd }) => {

    const [newWorkspace, setNewWorkspace] = useState({ title: "", desc: "", starred: false });
    const [newWorkspaceErr, setNewWorkspaceErr] = useState({ title: false, desc: false });

    const submit = () => {
        if (newWorkspace.title.length < 3) {
            setNewWorkspaceErr({ ...newWorkspaceErr, title: "Title must be minimum 3 characters long." });
            return;
        }

        onAdd({ title: newWorkspace.title, desc: newWorkspace.desc, starred: newWorkspace.starred });
        setNewWorkspaceVisible(false);
        setNewWorkspaceErr({ ...newWorkspace, title: false, desc: false });
    }

    const closeModal = () => {
        setNewWorkspaceVisible(false);
        setNewWorkspaceErr({ ...newWorkspace, title: false, desc: false });
    }

    return (<Modal
        closeButton
        aria-labelledby="add-workspace"
        open={newWorkspaceVisible}
        onClose={closeModal}
    >
        <Modal.Header>
            <AddIcon height={24} width={24} style={{ fill: "currentColor" }} />
            <Text b id="add-workspace" size={18} css={{ ml: 4 }}>
                Add Workspace
            </Text>
        </Modal.Header>
        <Modal.Body>
            <Row css={{ fd: "column" }}>
                <Input
                    color="primary"
                    placeholder='Workspace Title'
                    bordered
                    fullWidth
                    onChange={e => setNewWorkspace({ ...newWorkspace, title: e.target.value })}
                />
                {newWorkspaceErr.title != false && <Text color={"$error"}>{newWorkspaceErr.title}</Text>}
            </Row>
            <Row>
                <Input
                    color="primary"
                    placeholder='Workspace Description'
                    bordered
                    fullWidth
                    onChange={e => setNewWorkspace({ ...newWorkspace, desc: e.target.value })}
                />
            </Row>
            <Row>
                <Checkbox onChange={e => setNewWorkspace({ ...newWorkspace, starred: e.target.checked })}>
                    Add to favorites
                </Checkbox>
            </Row>
        </Modal.Body>
        <Modal.Footer css={{ justifyContent: "space-between" }}>
            <Button auto css={{ width: "46%" }} flat color="error" onClick={closeModal}>
                <CrossIcon height={24} width={24} style={{ fill: "currentColor" }} />
                Cancel
            </Button>
            <Button auto css={{ width: "46%" }} onClick={submit}>
                <CheckIcon height={24} width={24} style={{ fill: "currentColor" }} />
                Add Workspace
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default AddWorkspaceModal;