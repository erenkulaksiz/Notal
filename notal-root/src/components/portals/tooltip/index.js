import React from "react";
import ReactDOM from "react-dom";

const TooltipPortal = ({ children, parent, className }) => {
    const client = (typeof window === 'undefined') ? false : true;
    // Create div to contain everything
    const el = React.useMemo(() => client && document.createElement("div"), []);
    // On mount function
    React.useEffect(() => {
        // work out target in the DOM based on parent prop
        const target = parent && parent.appendChild ? parent : document.body;
        // Default classes
        const classList = ["notal-tooltips"];
        // If className prop is present add each class the classList
        if (className) className.split(" ").forEach((item) => classList.push(item));
        classList.forEach((item) => el.classList.add(item));
        // Append element to dom
        target.appendChild(el);
        // On unmount function
        return () => {
            // Remove element from dom
            target.removeChild(el);
        };
    }, [el, parent, className]);
    // return the createPortal function
    return ReactDOM.createPortal(children, el);
}

export default TooltipPortal;