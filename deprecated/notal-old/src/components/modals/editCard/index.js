import { useEffect, useState } from 'react';
import { Button, Text, Modal, Input, Row, Textarea, Divider, Collapse } from '@nextui-org/react';

import {
    FieldCard,
    ColorSelect
} from '@components';

import {
    EditIcon,
    CrossIcon,
    CheckIcon,
} from '@icons';

import {
    CardColors,
} from '@utils/constants';

const EditCardModal = ({ visible, onClose, onEdit, card }) => {
    const [titleError, setTitleError] = useState("");
    const [descError, setDescError] = useState("");

    const [editTitle, setEditTitle] = useState(card.title);
    const [editDesc, setEditDesc] = useState(card.desc);
    const [editColor, setEditColor] = useState({ code: card.color, name: "", showName: "" });

    const [_card, _setCard] = useState(card);

    useEffect(() => { // #TODO: remove this useeffect
        _setCard(card);
        setEditTitle(card.title);
        setEditDesc(card.desc);
        setEditColor({ ...editColor, code: card.color, name: "", showName: "" });
    }, [card]);

    useEffect(() => {
        const newCard = _card;
        newCard.desc = editDesc;
        newCard.title = editTitle != "" ? editTitle : "Set Title";
        newCard.color = editColor.code;
        //setEditColor({...editColor, name: "", showName: ""});
        _setCard({ ...newCard });
    }, [editTitle, editDesc, editColor]);

    const edit = () => {
        if (editTitle.length < 3 || editTitle.length > 40) {
            setTitleError("Title must be between 3 and 40 characters long.");
            return;
        }

        onEdit({ title: editTitle, desc: editDesc, color: editColor.code, id: card._id });
        close();
    }

    const close = () => {
        setTitleError("");
        setDescError("");
        setEditTitle(card.title);
        setEditDesc(card.desc);
        setEditColor({ ...editColor, code: card.color, name: "", showName: "" });
        onClose();
    }

    return (<Modal
        closeButton
        aria-labelledby="edit-card"
        open={visible}
        onClose={close}
        css={{ overflow: "visible" }}
    >
        <Modal.Header>
            <EditIcon height={24} width={24} style={{ fill: "currentColor", marginRight: 4 }} />
            <Text b id="edit-card" size={18} css={{ ml: 4 }}>
                Edit Card
            </Text>
        </Modal.Header>
        <Modal.Body css={{ overflow: "visible" }}>
            <FieldCard
                card={_card}
                isOwner={false}
                style={{ marginTop: 8 }}
            />
            <Row css={{ fd: "column", m: 0, mb: 8 }}>
                <Input
                    bordered
                    fullWidth
                    color="primary"
                    label={<Text css={{ color: "$gray700", fontWeight: "500" }}>Card Title (Optional)</Text>}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    maxLength={40}
                />
                {titleError != false && <Text color={"$error"}>{titleError}</Text>}
            </Row>
            <Row css={{ fd: "column", m: 0, }}>
                <Textarea
                    bordered
                    fullWidth
                    color="primary"
                    label={<Text css={{ color: "$gray700", fontWeight: "500" }}>Card Description (Optional)</Text>}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                />
                {descError != false && <Text color={"$error"}>{descError}</Text>}
            </Row>
            <Row css={{ fd: "column", m: 0, overflow: "visible", mt: 6 }}>
                <Text css={{ color: "$gray700", fontWeight: "500", ml: 4 }}>Card Color (Optional)</Text>
                <ColorSelect
                    content={CardColors} // will show card colors here
                    onSelect={({ element }) => setEditColor({ code: element.name == "" ? "" : element.code, name: element.name == "" ? "" : element.name, showName: element.showName })}
                    selected={editColor}
                />
            </Row>
            <Collapse title="Card Details" shadow={false} divider={false} css={{ mt: 8 }}>
                <Row>
                    <Text b>{`Created At: 
                    ${new Date(_card.createdAt).getHours()}:${new Date(_card.createdAt).getMinutes()}
                    -
                    ${new Date(_card.createdAt).getDate()} 
                    ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][new Date(_card.createdAt).getMonth()]},
                    ${new Date(_card.createdAt).getFullYear()}
                    `}</Text>
                </Row>
                <Row>
                    {_card.createdAt != _card.updatedAt && <Text b>{`Last Updated At: 
                    ${new Date(_card.updatedAt).getHours()}:${new Date(_card.updatedAt).getMinutes()}
                    -
                    ${new Date(_card.updatedAt).getDate()} 
                    ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][new Date(_card.updatedAt).getMonth()]},
                    ${new Date(_card.updatedAt).getFullYear()}
                    `}</Text>}
                </Row>


            </Collapse>
        </Modal.Body>
        <Modal.Footer css={{ justifyContent: "space-between" }}>
            <Button auto flat color="error" css={{ width: "46%" }} onClick={close}>
                <CrossIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Cancel
            </Button>
            <Button auto css={{ width: "46%" }} onClick={edit}>
                <CheckIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Edit
            </Button>
        </Modal.Footer>
    </Modal >)
}

export default EditCardModal;