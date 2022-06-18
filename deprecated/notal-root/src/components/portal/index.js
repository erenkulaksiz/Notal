import { useEffect, useMemo } from "react";
import ReactDOM from "react-dom";

import { isClient } from "@utils";

const CreatePortal = ({ children, parent, className, portalName }) => {
    const el = useMemo(() => isClient && document.createElement("div"), []);

    useEffect(() => {
        const target = parent && parent.appendChild ? parent : document.body;

        const classList = [portalName];

        if (className) className.split(" ").forEach((item) => classList.push(item));
        classList.forEach((item) => el.classList.add(item));

        target.appendChild(el);
        return () => {
            target.removeChild(el);
        };
    }, [el, parent, className]);

    return ReactDOM.createPortal(children, el);
}

export default CreatePortal;