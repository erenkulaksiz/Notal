import React, { ReactNode, useState, cloneElement } from "react";
import { LayoutGroup, motion } from "framer-motion";

import { BuildComponent } from "@utils/style/buildComponent";

interface TabButtonProps {
  children: ReactNode;
  selected: boolean;
  hover: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  setSelected: (arg: number) => void;
  setHover: (arg: number) => void;
  className: string;
  title: string;
}

interface TabHeaderProps {
  children: ReactNode;
  headerClassName?: string;
  loadingWorkspace: boolean;
}

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
}

function TabButton({
  children,
  selected,
  hover,
  onMouseEnter,
  onMouseLeave,
  onClick,
  setSelected,
  setHover,
  className,
  title,
}: TabButtonProps) {
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={({ key }) =>
        key === "Enter"
          ? () => {
              setSelected(-1);
              setHover(-1);
            }
          : null
      }
      title={title}
      className={className}
      onClick={onClick}
    >
      <span className="z-20 relative">{children}</span>
      {hover && (
        <motion.div
          className="absolute left-1 right-1 top-1 bottom-1 z-10 dark:bg-neutral-700 bg-neutral-200 rounded-md"
          layoutId="tabheader"
          transition={{
            layout: {
              duration: 0.2,
              ease: "easeOut",
            },
          }}
        ></motion.div>
      )}
      {selected && (
        <motion.div
          className="absolute left-3 right-3 h-1 -bottom-1 rounded-xl z-10 bg-blue-600"
          layoutId="tabunderline"
          transition={{
            layout: {
              type: "spring",
              damping: 25,
              stiffness: 400,
              mass: 0.55,
            },
          }}
        ></motion.div>
      )}
    </button>
  );
}

function TabHeader({
  children,
  headerClassName,
  loadingWorkspace,
}: TabHeaderProps) {
  const TabHeaderSkeleton = () => {
    return (
      <div className="w-full h-10 flex flex-row dark:bg-neutral-800 bg-neutral-100 p-2 rounded-lg">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="w-[20%] rounded mr-2 dark:bg-neutral-900 bg-neutral-200 animate-pulse h-full"
          ></div>
        ))}
      </div>
    );
  };

  if (loadingWorkspace) return <TabHeaderSkeleton />;

  const BuildTabHeader = BuildComponent({
    name: "Notal UI Tab Header",
    defaultClasses:
      "h-10 flex flex-1 flex-row relative border-2 border-solid dark:border-neutral-800 border-neutral-200 rounded-lg",
    extraClasses: headerClassName,
  });

  return <nav className={BuildTabHeader.classes}>{children}</nav>;
}

function TabView({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
}) {
  const BuildTabView = BuildComponent({
    name: "Notal UI Tab View",
    defaultClasses: "w-full",
    extraClasses: className,
  });

  return <div className={BuildTabView.classes}>{children}</div>;
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
}: TabProps) {
  const [hover, setHover] = useState(-1);

  const BuildTab = BuildComponent({
    name: "Notal UI Tab",
    defaultClasses: "w-full relative",
    extraClasses: className,
  });

  const BuildTabHeaderContainer = BuildComponent({
    name: "Notal UI Tab Header Container",
    defaultClasses: "flex overflow-x-auto overflow-y-hidden pb-1",
    extraClasses: headerContainerClassName,
  });

  return (
    <div className={BuildTab.classes}>
      <div className={BuildTabHeaderContainer.classes}>
        <TabHeader
          headerClassName={headerClassName}
          loadingWorkspace={loadingWorkspace}
        >
          <LayoutGroup id={id}>
            {Array.isArray(children) &&
              children?.map((children, index) => (
                <TabButton
                  className="flex items-center justify-center w-full min-w-[100px] h-full group relative text-sm sm:text-md"
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
