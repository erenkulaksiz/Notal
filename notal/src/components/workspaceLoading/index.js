import { Loading, Row, Text, useTheme } from "@nextui-org/react";
import { useEffect, useState } from "react";

import {
    CheckIcon,
} from '../../icons';

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

    return (<div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 12 }}>
        <div className="notal-loading-container" style={{ border: `2px solid ${isDark ? "#575757" : "#9e9e9e"}`, color: isDark ? "#575757" : "#9e9e9e" }}>
            {showLoading && <Loading size={"xs"} />}
            {showLoaded && <CheckIcon size={24} fill="currentColor" />}
            {showLoading && <Text css={{ ml: 6, color: "CurrentColor" }} b>Saving...</Text>}
            {showLoaded && <Text css={{ ml: 6, color: "CurrentColor" }} b>Saved!</Text>}
        </div>
        <style jsx global>{`
            .notal-loading-container {
                display: flex;
                align-items: center;
                padding: 4px;
                padding-right: 8px;
                padding-left: 8px;
                border-radius: 8px;
            }
        `}</style>
    </div>)
}

export default WorkspaceLoading;