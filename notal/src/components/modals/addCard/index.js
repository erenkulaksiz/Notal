import { useState } from 'react';
import { Button, Text, Modal, Input } from '@nextui-org/react';

import AddIcon from '../../../../public/icons/add.svg';
import CrossIcon from '../../../../public/icons/cross.svg';
import CheckIcon from '../../../../public/icons/check.svg';

const AddCardModal = ({ visible, onClose, onAdd }) => {

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    const close = () => {
        setTitle("");
        setDesc("");
        onClose();
    }

    return (<Modal
        closeButton
        aria-labelledby="add-card"
        open={visible}
        onClose={close}
    >
        <Modal.Header>
            <AddIcon height={24} width={24} style={{ fill: "currentColor" }} />
            <Text b id="add-card" size={18} css={{ ml: 4 }}>
                Add a card
            </Text>
        </Modal.Header>
        <Modal.Body>
            <Input
                bordered
                fullWidth
                color="primary"
                placeholder="Card title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <Input
                bordered
                fullWidth
                color="primary"
                placeholder="Card desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
            />
        </Modal.Body>
        <Modal.Footer css={{ justifyContent: "space-between" }}>
            <Button auto flat color="error" css={{ width: "46%" }} onClick={onClose}>
                <CrossIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Cancel
            </Button>
            <Button auto css={{ width: "46%" }}
                onClick={() => {
                    onAdd({ title, desc });
                    close();
                }}>
                <CheckIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Add
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default AddCardModal;