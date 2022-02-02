import { useState } from 'react';
import { Button, Text, Modal, Input } from '@nextui-org/react';

import AddIcon from '../../../../public/icons/add.svg';
import CrossIcon from '../../../../public/icons/cross.svg';
import CheckIcon from '../../../../public/icons/check.svg';

const AddFieldModal = ({ visible, onClose, onAdd }) => {

    const [title, setTitle] = useState("");

    const close = () => {
        setTitle("");
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
            <Input
                clearable
                bordered
                fullWidth
                color="primary"
                placeholder="Field title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
        </Modal.Body>
        <Modal.Footer css={{ justifyContent: "space-between" }}>
            <Button auto flat color="error" css={{ width: "46%" }} onClick={onClose}>
                <CrossIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Cancel
            </Button>
            <Button auto css={{ width: "46%" }} onClick={() => onAdd({ title })}>
                <CheckIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Add
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default AddFieldModal;