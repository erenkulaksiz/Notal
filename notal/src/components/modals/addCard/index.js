import { useState } from 'react';
import { Button, Text, Modal, Input, Row, Card, useTheme, Link as ALink } from '@nextui-org/react';
import styled from 'styled-components';

import AddIcon from '../../../../public/icons/add.svg';
import CrossIcon from '../../../../public/icons/cross.svg';
import CheckIcon from '../../../../public/icons/check.svg';
import ArrowDownIcon from '../../../../public/icons/arrow_down.svg';

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

const AddCardModal = ({ visible, onClose, onAdd }) => {
    const { isDark } = useTheme();

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [color, setColor] = useState({ code: "", name: "" });

    const close = () => {
        setTitle("");
        setDesc("");
        setColor({ code: "", name: "" });
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
            <Row css={{ fd: "column", m: 0, mb: 8 }}>
                <Input
                    bordered
                    fullWidth
                    color="primary"
                    label={<Text css={{ color: "$gray700", fontWeight: "500" }}>Card Title</Text>}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </Row>
            <Row css={{ fd: "column", m: 0 }}>
                <Input
                    bordered
                    fullWidth
                    color="primary"
                    label={<Text css={{ color: "$gray700", fontWeight: "500" }}>Card Description</Text>}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />
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
                                    {color.code && <CardColor color={color.code} style={{ marginTop: 8 }} />}
                                    <Text css={{ width: "50%", color: color.code ? color.code : "CurrentColor", marginLeft: color.code ? 18 : 0 }} b>{color.code ? color.name : "Set Color"}</Text>
                                </Row>
                                <ArrowDownIcon size={24} fill={"currentColor"} />
                            </Row>
                        </Card>
                    </summary>
                    <Card css={{ zIndex: 500, position: "absolute", left: 0, width: "auto", boxShadow: "$lg", bg: isDark ? "#1c1c1c" : "$background" }}>
                        <ALink onClick={() => setColor({ code: "", name: "" })} css={{ p: 8, color: isDark ? "$white" : "$black", position: "relative" }}>
                            <Text css={{ color: "CurrentColor" }} b>None</Text>
                        </ALink>
                        <ALink onClick={() => setColor({ code: "#a30b0b", name: "Red" })} css={{ p: 8 }}>
                            <div style={{ position: "relative", paddingBottom: 10, }}>
                                <CardColor color="#a30b0b" />
                            </div>
                            <Text css={{ color: "#a30b0b", ml: 18 }} b>Red</Text>
                        </ALink>
                        <ALink onClick={() => setColor({ code: "#10AC63", name: "Green" })} css={{ p: 8 }}>
                            <div style={{ position: "relative", paddingBottom: 10, }}>
                                <CardColor color="#10AC63" />
                            </div>
                            <Text css={{ color: "#10AC63", ml: 18 }} b>Green</Text>
                        </ALink>
                        <ALink onClick={() => setColor({ code: "#0070F3", name: "Blue" })} css={{ p: 8 }}>
                            <div style={{ position: "relative", paddingBottom: 10, }}>
                                <CardColor color="#0070F3" />
                            </div>
                            <Text css={{ color: "#0070F3", ml: 18 }} b>Blue</Text>
                        </ALink>
                        <ALink onClick={() => setColor({ code: "#D28519", name: "Yellow" })} css={{ p: 8 }}>
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
            <Button auto flat color="error" css={{ width: "46%" }} onClick={onClose}>
                <CrossIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Cancel
            </Button>
            <Button auto css={{ width: "46%" }}
                onClick={() => {
                    onAdd({ title, desc, color: color.code });
                    close();
                }}>
                <CheckIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Add
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default AddCardModal;