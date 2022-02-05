import { useEffect, useState } from 'react';
import { Button, Text, Modal, Input, Row, Textarea, useTheme, Card, Link as ALink } from '@nextui-org/react';
import styled from 'styled-components';

import {
    FieldCard,
} from '../../';

import {
    EditIcon,
    CrossIcon,
    CheckIcon,
    ArrowDownIcon
} from '../../../icons';

const CardColor = styled.div`
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: ${props => props.color};
    z-index: 5;
    border-radius: 100%;
`;

const Details = styled.details`
    position: relative;
    display: inline-block;
    background-color: transparent;
    width: 100%;
    &[open] > summary:before {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        display: block;
        cursor: default;
        content: " ";
    }
`;

const EditCardModal = ({ visible, onClose, onEdit, card }) => {
    const { isDark } = useTheme();

    const [titleError, setTitleError] = useState("");
    const [descError, setDescError] = useState("");

    const [editTitle, setEditTitle] = useState(card.title);
    const [editDesc, setEditDesc] = useState(card.desc);
    const [editColor, setEditColor] = useState({ code: card.color, name: "" });

    const [_card, _setCard] = useState(card);

    useEffect(() => { // #TODO: remove this useeffect
        _setCard(card);
        setEditTitle(card.title);
        setEditDesc(card.desc);
        setEditColor({ ...editColor, code: card.color, name: "" });
    }, [card]);

    useEffect(() => {
        const newCard = _card;
        newCard.desc = editDesc;
        newCard.title = editTitle != "" ? editTitle : "Set Title";
        newCard.color = editColor.code;
        _setCard({ ...newCard });
    }, [editTitle, editDesc, editColor]);

    const edit = () => {
        if (editTitle.length < 3 || editTitle.length > 20) {
            setTitleError("Title must be between 3 and 20 characters long.");
            return;
        }

        console.log("edit id: ", card);

        onEdit({ title: editTitle, desc: editDesc, color: editColor.code, id: card._id });
    }

    const close = () => {
        setTitleError("");
        setDescError("");
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
            />
            <Row css={{ fd: "column", m: 0, mb: 8 }}>
                <Input
                    bordered
                    fullWidth
                    color="primary"
                    label={<Text css={{ color: "$gray700", fontWeight: "500" }}>Workspace Title</Text>}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    maxLength={20}
                />
                {titleError != false && <Text color={"$error"}>{titleError}</Text>}
            </Row>
            <Row css={{ fd: "column", m: 0, }}>
                <Textarea
                    bordered
                    fullWidth
                    color="primary"
                    label={<Text css={{ color: "$gray700", fontWeight: "500" }}>Workspace Description</Text>}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                />
                {descError != false && <Text color={"$error"}>{descError}</Text>}
            </Row>
            <Row css={{ fd: "column", m: 0, overflow: "visible", mt: 6 }}>
                <Text css={{ color: "$gray700", fontWeight: "500" }}>Card Color</Text>
                <Details>
                    <summary style={{
                        userSelect: "none",
                        position: "relative",
                        "&::WebkitDetailsMarket": {
                            display: "none",
                        }
                    }}>
                        <Card css={{ boxShadow: "$md" }}>
                            <Row css={{ justifyContent: "space-between", flexDirection: "row" }}>
                                <Row>
                                    {editColor.code && <CardColor color={editColor.code} style={{ marginTop: 8 }} />}
                                    <Text css={{ width: "50%", color: editColor.code ? editColor.code : "CurrentColor", marginLeft: editColor.code ? 18 : 0 }} b={editColor.code != ""}>{editColor.code ? editColor.name : "Set Color"}</Text>
                                </Row>
                                <ArrowDownIcon size={24} fill={"currentColor"} />
                            </Row>
                        </Card>
                    </summary>
                    <Card css={{ zIndex: 500, height: 160, position: "absolute", left: 0, width: "auto", boxShadow: "$lg", bg: isDark ? "#1c1c1c" : "$background" }}>
                        <ALink onClick={() => setEditColor({ code: "", name: "" })} css={{ p: 8, color: isDark ? "$white" : "$black", position: "relative" }}>
                            <Text css={{ color: "CurrentColor" }} b>None</Text>
                        </ALink>
                        <ALink onClick={() => setEditColor({ code: "#a30b0b", name: "Red" })} css={{ p: 8 }}>
                            <div style={{ position: "relative", paddingBottom: 10, }}>
                                <CardColor color="#a30b0b" />
                            </div>
                            <Text css={{ color: "#a30b0b", ml: 18 }} b>Red</Text>
                        </ALink>
                        <ALink onClick={() => setEditColor({ code: "#10AC63", name: "Green" })} css={{ p: 8 }}>
                            <div style={{ position: "relative", paddingBottom: 10, }}>
                                <CardColor color="#10AC63" />
                            </div>
                            <Text css={{ color: "#10AC63", ml: 18 }} b>Green</Text>
                        </ALink>
                        <ALink onClick={() => setEditColor({ code: "#0070F3", name: "Blue" })} css={{ p: 8 }}>
                            <div style={{ position: "relative", paddingBottom: 10, }}>
                                <CardColor color="#0070F3" />
                            </div>
                            <Text css={{ color: "#0070F3", ml: 18 }} b>Blue</Text>
                        </ALink>
                        <ALink onClick={() => setEditColor({ code: "#D28519", name: "Yellow" })} css={{ p: 8 }}>
                            <div style={{ position: "relative", paddingBottom: 10, }}>
                                <CardColor color="#D28519" />
                            </div>
                            <Text css={{ color: "#D28519", ml: 18 }} b>Yellow</Text>
                        </ALink>
                        <ALink css={{ p: 8 }}>
                            <div style={{ position: "relative", paddingBottom: 10, }}>
                                <CardColor color="gray" />
                            </div>
                            <Text css={{ color: "gray", ml: 18 }} b>Custom (coming soon)</Text>
                        </ALink>
                    </Card>
                </Details>
            </Row>
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