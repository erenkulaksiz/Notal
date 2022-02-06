import { useState } from 'react';
import { Button, Text, Modal, Input, Row, Textarea, } from '@nextui-org/react';

import {
    FieldCard,
    ColorSelect
} from '../../';

import {
    AddIcon,
    CrossIcon,
    CheckIcon
} from '../../../icons';

import {
    CardColors
} from '../../../utils';


const AddCardModal = ({ visible, onClose, onAdd }) => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [color, setColor] = useState({ code: "", name: "", showName: "" });
    const [tag, setTag] = useState("");

    const [titleError, setTitleError] = useState("");

    const add = () => {
        if (title.length < 3 || title.length > 30) {
            setTitleError("Title must be between 3 and 30 characters long.");
            return;
        }
        setTitleError("");
        onAdd({ title, desc, color: color.code });
        close();
    }

    const close = () => {
        setTitle("");
        setDesc("");
        setTag("");
        setColor({ code: "", name: "", showName: "" });
        setTitleError("");
        onClose();
    }

    return (<Modal
        closeButton
        aria-labelledby="add-card"
        open={visible}
        onClose={close}
        css={{ overflow: "visible" }}
    >
        <Modal.Header>
            <AddIcon height={24} width={24} style={{ fill: "currentColor" }} />
            <Text b id="add-card" size={18} css={{ ml: 4 }}>
                Add a Card
            </Text>
        </Modal.Header>
        <Modal.Body css={{ overflow: "visible" }}>
            <FieldCard
                card={{ title: title != "" ? title : "Enter a title...", desc, color: color.code, tag: { title: tag != "" ? tag : "tag" } }}
                isOwner={false}
            />
            <Row css={{ fd: "column", m: 0, mb: 8 }}>
                <Input
                    bordered
                    fullWidth
                    color="primary"
                    label={<Text css={{ color: "$gray700", fontWeight: "500" }}>Card Title</Text>}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={30}
                />
                {titleError != false && <Text color={"$error"}>{titleError}</Text>}
            </Row>
            <Row css={{ fd: "column", m: 0, mb: 8 }}>
                <Textarea
                    bordered
                    fullWidth
                    color="primary"
                    label={<Text css={{ color: "$gray700", fontWeight: "500" }}>Card Description (Optional)</Text>}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    text
                />
            </Row>
            <Row css={{ fd: "column", m: 0, overflow: "visible", mb: 6 }}>
                <Text css={{ color: "$gray700", fontWeight: "500", ml: 4 }}>Card Color (Optional)</Text>
                <ColorSelect
                    content={CardColors} // will show card colors here
                    onSelect={({ element }) => setColor({ code: element.code, name: element.name, showName: element.showName })}
                    selected={color}
                />
            </Row>
            <Row css={{ fd: "column", m: 0, }}>
                <Input
                    bordered
                    fullWidth
                    color="primary"
                    label={<Text css={{ color: "$gray700", fontWeight: "500" }}>Card Tag (Optional)</Text>}
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    maxLength={16}
                />
            </Row>
        </Modal.Body>
        <Modal.Footer css={{ justifyContent: "space-between" }}>
            <Button auto flat color="error" css={{ width: "46%" }} onClick={onClose}>
                <CrossIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Cancel
            </Button>
            <Button auto css={{ width: "46%" }}
                onClick={add}>
                <CheckIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Add
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default AddCardModal;