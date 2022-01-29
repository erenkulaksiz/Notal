import { Button, Text, Grid, Input, Modal, Row, Checkbox } from '@nextui-org/react';
import { useState, useEffect } from 'react';

import AddIcon from '../../../public/icons/add.svg';
import CrossIcon from '../../../public/icons/cross.svg';
import CheckIcon from '../../../public/icons/check.svg';

const AddWorkspaceModal = ({ newWorkspaceVisible, setNewWorkspaceVisible, onAdd }) => {

    const [newWorkspace, setNewWorkspace] = useState({ title: "", desc: "", starred: false });
    const [newWorkspaceErr, setNewWorkspaceErr] = useState({ title: false, desc: false });

    const submit = () => {
        if (newWorkspace.title.length < 3) {
            setNewWorkspaceErr({ ...newWorkspaceErr, title: "Please enter a valid title." });
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
        <Modal.Footer>
            <Grid.Container gap={2}>
                <Grid xs={6} justify='center'>
                    <Button auto css={{ width: "100%" }} flat color="error" onClick={closeModal}>
                        <CrossIcon height={24} width={24} style={{ fill: "currentColor" }} />
                        Cancel
                    </Button>
                </Grid>
                <Grid xs={6} justify='center'>
                    <Button auto css={{ width: "100%" }} onClick={submit}>
                        <CheckIcon height={24} width={24} style={{ fill: "currentColor" }} />
                        Delete
                    </Button>
                </Grid>
            </Grid.Container>
        </Modal.Footer>
    </Modal>)
}

export default AddWorkspaceModal;