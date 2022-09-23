import React, {
  ReactNode,
  useState,
  cloneElement,
  isValidElement,
} from "react";
import { LayoutGroup } from "framer-motion";

import { BuildComponent } from "@utils/style/buildComponent";
import { TabView, TabHeader, TabButton } from "./components";

interface TabProps {
  children?: ReactNode;
  selected: number; // index of selected tab
  onSelect: (index: number) => void; // callback when tab is selected
  headerClassName?: string; // classname for header
  loadingWorkspace?: boolean; // boolean to show loading indicator
  id: string; // id of tab
  className?: string; // classname for tab
  headerContainerClassName?: string; // classname for header container
  globalTabViewClassName?: string;
  headerVisible?: boolean;
}

function Tab({
  children,
  selected,
  onSelect,
  id,
  className,
  headerClassName,
  headerContainerClassName,
  globalTabViewClassName, // applies these classnames to all tabviews inside tab
  loadingWorkspace = false,
  headerVisible = true,
}: TabProps) {
  const [hover, setHover] = useState(-1);

  const BuildTab = BuildComponent({
    name: "Notal UI Tab",
    defaultClasses: "w-full relative",
    extraClasses: className,
  });

  const BuildTabHeaderContainer = BuildComponent({
    name: "Notal UI Tab Header Container",
    defaultClasses: "flex w-full overflow-x-auto overflow-y-hidden pb-1",
    extraClasses: headerContainerClassName,
  });

  return (
    <div className={BuildTab.classes}>
      {headerVisible && (
        <div className={BuildTabHeaderContainer.classes}>
          <TabHeader
            headerClassName={headerClassName}
            loadingWorkspace={loadingWorkspace}
          >
            <LayoutGroup id={id}>
              {Array.isArray(children) &&
                children?.map((children, index) => (
                  <TabButton
                    className="flex items-center justify-center w-full min-w-[100px] h-full group relative text-sm sm:text-md text-black dark:text-white"
                    key={index}
                    selected={selected == index}
                    setSelected={() => onSelect(index)}
                    onClick={() => onSelect(index)}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(-1)}
                    hover={hover == index}
                    setHover={(index) => setHover(index)}
                    title={children.props.title}
                    aria-label={children.props.title}
                  >
                    <div className="flex flex-row items-center">
                      {children.props.icon && (
                        <div>{children.props.icon && children.props.icon}</div>
                      )}
                      <div>{children.props.title ?? "Default"}</div>
                    </div>
                  </TabButton>
                ))}
            </LayoutGroup>
          </TabHeader>
        </div>
      )}
      {Array.isArray(children) &&
        children?.map((child, index) => {
          if (index != selected) return;

          if (globalTabViewClassName) {
            // check if theres global classname
            const clone = cloneElement(child, {
              className: globalTabViewClassName,
              key: index,
            });
            return clone;
          }
          return child;
        })}
    </div>
  );
}

Tab.TabView = TabView;

export default Tab;
