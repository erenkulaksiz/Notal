import { Loading, Row, Text, useTheme } from "@nextui-org/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import {
    CheckIcon,
} from '../../icons';

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    border: 2px solid ${props => props.isDark ? "#110E0B" : "#C1C1C1"};
    padding: 4px;
    padding-right: 8px;
    padding-left: 8px;
    border-radius: 8px;
`;

const WorkspaceLoading = ({ loading }) => {
    const { isDark } = useTheme();
    const [showLoading, setShowLoading] = useState(false);
    const [showLoaded, setShowLoaded] = useState(false);

    useEffect(() => {
        switch (loading) {
            case true:
                setShowLoading(true);
                setShowLoaded(false);
                break;
            case false:
                if (showLoading) {
                    setShowLoading(false);
                    setShowLoaded(true);
                    setTimeout(() => setShowLoaded(false), 1500);
                }
                break;
        }
    }, [loading]);

    if (showLoading == false && showLoaded == false) {
        return null;
    }

    return (<Row css={{ alignItems: "center", justifyContent: "flex-end", paddingRight: 12 }}>
        <StyledContainer isDark={isDark}>
            {showLoading && <Loading size={"xs"} />}
            {showLoaded && <CheckIcon size={24} fill="currentColor" />}
            {showLoading && <Text css={{ ml: 4 }} b>Saving...</Text>}
            {showLoaded && <Text css={{ ml: 4 }} b>Saved!</Text>}
        </StyledContainer>
    </Row>)
}

export default WorkspaceLoading;