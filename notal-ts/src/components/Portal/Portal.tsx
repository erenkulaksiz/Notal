import { useEffect, useMemo } from "react";
import ReactDOM from "react-dom";

import { isClient } from "@utils";
import type { PortalProps } from "./Portal.d";

export function CreatePortal({
  children,
  parent,
  className,
  portalName,
}: PortalProps) {
  const el = useMemo(() => document.createElement("div"), []);

  useEffect(() => {
    if (!el) return;
    if (!isClient()) return;

    const target = parent && parent["appendChild"] ? parent : document.body;
    const classList = [portalName];

    if (typeof className != "undefined") {
      className.split(" ").forEach((item) => classList.push(item));
    }

    classList.forEach((item) => el.classList.add(item ?? ""));

    target.appendChild(el);
    return () => {
      target.removeChild(el);
    };
  }, [el, parent, className]);

  return ReactDOM.createPortal(children, el);
}
