import { Text, Row, useTheme, Card, Link as ALink } from '@nextui-org/react';
import styled from "styled-components";

import {
    ArrowDownIcon,
    CheckIcon
} from '../../icons';

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

const ColorSelect = ({ content, onSelect, selected }) => {
    const { isDark } = useTheme();

    return (<Details>
        <summary style={{
            userSelect: "none",
            position: "relative",
            "&::WebkitDetailsMarket": {
                display: "none",
            }
        }}>
            <Card shadow={false} bordered clickable>
                <Row css={{ justifyContent: "space-between", flexDirection: "row" }}>
                    <Row>
                        {selected.code && <CardColor color={selected.code} style={{ marginTop: 8 }} />}
                        <Text css={{ width: "50%", color: selected.code ? selected.code : "CurrentColor", marginLeft: selected.code ? 18 : 0 }} b={selected.code != ""}>{selected.code ? selected.showName : "Set Color"}</Text>
                    </Row>
                    <ArrowDownIcon size={24} fill={"currentColor"} />
                </Row>
            </Card>
        </summary>
        <Card css={{ zIndex: 500, height: 160, position: "absolute", left: 0, width: "auto", boxShadow: "$lg", bg: isDark ? "#1c1c1c" : "$background" }}>
            {content.map((element, index) => {
                return (<ALink key={index} onClick={() => element.selectable != false && onSelect({ element })} css={{ p: 8, alignItems: "center", color: isDark ? "$white" : "$black", }}>
                    <div style={{ position: "relative", paddingBottom: 10, }}>
                        <CardColor color={element.code} />
                    </div>
                    <Text css={{ color: element.code, ml: 18, }} b>{element.showName}</Text>
                    {selected.name == element.name && <CheckIcon size={24} fill={element.code} style={{ marginLeft: 8 }} />}
                </ALink>)
            })}
        </Card>
    </Details>)
}

export default ColorSelect;