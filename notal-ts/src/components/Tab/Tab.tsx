import React, { useState, cloneElement } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import { BuildComponent } from "@utils/style/buildComponent";
import { TabView, TabHeader, TabButton } from "./components";

import type { TabProps } from "./Tab.d";
import { Log } from "@utils";

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
  animated = false, // animate tabview transitions
  animatedTabViewClassName = "h-full w-full", // classnames to apply to animated tabview
}: TabProps) {
  const [hover, setHover] = useState(-1);

  const BuildTab = BuildComponent({
    name: "Notal UI Tab",
    defaultClasses: "w-full relative",
    extraClasses: className,
  });

  const BuildTabHeaderContainer = BuildComponent({
    name: "Notal UI Tab Header Container",
    defaultClasses: "flex w-full overflow-x-auto overflow-y-hidden",
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
                    className="flex items-center justify-center w-full min-w-[100px] h-full group relative text-sm sm:text-md text-black dark:text-white outline-none focus:outline-2 focus:outline-blue-500/50"
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
      {animated ? (
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={selected}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={animatedTabViewClassName}
          >
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
          </motion.div>
        </AnimatePresence>
      ) : (
        Array.isArray(children) &&
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
        })
      )}
    </div>
  );
}

Tab.TabView = TabView;

export default Tab;
