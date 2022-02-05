import { useEffect, useState } from 'react';
import { Button, Text, Modal, Input, Row } from '@nextui-org/react';

import {
    EditIcon,
    CrossIcon,
    CheckIcon
} from '../../../icons';

const EditFieldModal = ({ visible, onClose, onEdit, title }) => {

    useEffect(() => {
        setEditTitle(title);
    }, [title]); // #TODO: get rid of useEffect here

    const [titleError, setTitleError] = useState("");

    const [editTitle, setEditTitle] = useState(title);

    const edit = () => {
        if (editTitle.length < 3 || editTitle.length > 20) {
            setTitleError("Title must be between 2 and 20 characters long.");
            return;
        }
        onEdit({ title: editTitle });
        close();
    }

    const close = () => {
        setTitleError("");
        setEditTitle(title);
        onClose();
    }

    return (<Modal
        closeButton
        aria-labelledby="edit-field"
        open={visible}
        onClose={close}
    >
        <Modal.Header>
            <EditIcon height={24} width={24} style={{ fill: "currentColor" }} />
            <Text b id="edit-field" size={18} css={{ ml: 4 }}>
                Edit Field
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
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    maxLength={20}
                />
                {titleError != false && <Text color={"$error"}>{titleError}</Text>}
            </Row>
        </Modal.Body>
        <Modal.Footer css={{ justifyContent: "space-between" }}>
            <Button auto flat color="error" css={{ width: "46%" }} onClick={onClose}>
                <CrossIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Cancel
            </Button>
            <Button auto css={{ width: "46%" }} onClick={edit}>
                <CheckIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Edit
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default EditFieldModal;