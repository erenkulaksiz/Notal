import { useState } from 'react';
import { Button, Text, Modal, Input, Row } from '@nextui-org/react';

import {
    AddIcon,
    CrossIcon,
    CheckIcon
} from '../../../icons';

const AddFieldModal = ({ visible, onClose, onAdd }) => {

    const [titleError, setTitleError] = useState("");

    const [title, setTitle] = useState("");

    const add = () => {
        if (title.length < 3 || title.length > 30) {
            setTitleError("Title must be between 3 and 30 characters long.");
            return;
        }
        onAdd({ title });
    }

    const close = () => {
        setTitle("");
        setTitleError("");
        onClose();
    }

    return (<Modal
        closeButton
        aria-labelledby="add-field"
        open={visible}
        onClose={close}
    >
        <Modal.Header>
            <AddIcon height={24} width={24} style={{ fill: "currentColor" }} />
            <Text b id="add-field" size={18} css={{ ml: 4 }}>
                Add a field
            </Text>
        </Modal.Header>
        <Modal.Body>
            <Row css={{ fd: "column" }}>
                <Input
                    clearable
                    bordered
                    fullWidth
                    color="primary"
                    label={<Text css={{ color: "$gray700", fontWeight: "500" }}>Field Title</Text>}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={30}
                />
                {titleError != false && <Text color={"$error"}>{titleError}</Text>}
            </Row>
        </Modal.Body>
        <Modal.Footer css={{ justifyContent: "space-between" }}>
            <Button auto flat color="error" css={{ width: "46%" }} onClick={onClose}>
                <CrossIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Cancel
            </Button>
            <Button auto css={{ width: "46%" }} onClick={add}>
                <CheckIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Add
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default AddFieldModal;