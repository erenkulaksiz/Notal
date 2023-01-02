import React, { useState, useEffect, useRef, useMemo } from "react";

import { useWorkspace } from "@hooks";
import { CardTypes, FieldTypes } from "@types";
import { scale } from "@utils";
import { Tooltip } from "@components";

function getWindowDimensions(): { width: number; height: number } {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function SmartScroll({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const [scrollPos, setScrollPos] = useState<number>(0);
  const workspace = useWorkspace();
  const smartScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fields = useMemo(
    () =>
      Array.isArray(workspace.workspace?.data?.data?.fields)
        ? workspace.workspace?.data?.data?.fields
        : [],
    [workspace.workspace?.data?.data?.fields]
  );

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  const windowDimension = windowDimensions.width * 0.091;

  const isSmartScrollVisible = useMemo(() => {
    if (!smartScrollRef?.current?.clientWidth) return false;
    return windowDimension < smartScrollRef?.current?.clientWidth;
  }, [smartScrollRef?.current?.clientWidth, windowDimensions]);

  const smartScrollBorderWidth = useMemo(() => {
    if (!smartScrollRef?.current?.clientWidth) return 0;
    const clientWidth = smartScrollRef?.current?.clientWidth;
    return windowDimension > clientWidth ? clientWidth : windowDimension;
  }, [windowDimensions.width, smartScrollRef?.current?.clientWidth]);

  useEffect(() => {
    function handleResize() {
      if (!smartScrollRef?.current) return;
      setWindowDimensions(getWindowDimensions());
    }

    function containerScroll() {
      setScrollPos(containerRef.current?.scrollLeft ?? 0);
    }

    window.addEventListener("resize", handleResize);
    containerRef?.current?.addEventListener("scroll", containerScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef?.current?.removeEventListener("scroll", containerScroll);
    };
  }, []);

  function calculatePos(e: React.MouseEvent<HTMLDivElement>) {
    const pos =
      scale(
        e.clientX - e.currentTarget.getClientRects()[0].left,
        [0, e.currentTarget.clientWidth],
        [0, containerRef.current?.scrollWidth ?? 0]
      ) -
      windowDimensions.width / 2; // mouse ortada olsun

    containerRef.current?.scrollTo({
      left: pos,
    });
  }

  if (fields?.length === 0) return null;

  return (
    <div className="fixed right-4 bottom-5 z-50 hover:opacity-80 opacity-20 ease-in-out duration-300 group">
      <div
        ref={smartScrollRef}
        onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
          setIsDragging(true);
          calculatePos(e);
        }}
        onMouseLeave={() => setIsDragging(false)}
        onMouseUp={() => setIsDragging(false)}
        onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
          if (!isDragging) return;
          calculatePos(e);
        }}
        style={{
          opacity: isSmartScrollVisible ? 1 : 0,
          cursor: isSmartScrollVisible
            ? isDragging
              ? "grabbing"
              : "grab"
            : "default",
        }}
        className="shadow group-hover:pointer-events-auto ease-in-out duration-700 transition-all pointer-events-none h-12 dark:bg-neutral-600/20 bg-neutral-200 backdrop-blur rounded-lg p-[6px] flex flex-row gap-[2px]"
      >
        {Array.isArray(fields) &&
          fields?.map((field: FieldTypes, index: number) => {
            let fieldClassnames =
              "h-full w-[24px] dark:bg-neutral-500 bg-neutral-300 backdrop-blur-md flex flex-col gap-[1px]";
            if (index == 0) {
              fieldClassnames =
                "h-full w-[24px] dark:bg-neutral-500 overflow-hidden rounded-tl-md rounded-bl-md bg-neutral-300 backdrop-blur-md flex flex-col gap-[1px]";
            }
            if (
              index == fields.length - 1 &&
              (!workspace.isWorkspaceOwner || !workspace.isWorkspaceUser)
            ) {
              fieldClassnames =
                "h-full w-[24px] dark:bg-neutral-500 overflow-hidden rounded-tr-md rounded-br-md bg-neutral-300 backdrop-blur-md flex flex-col gap-[1px]";
            }
            return (
              <Tooltip
                key={`smartScroll_field_${field._id}`}
                content={
                  <div>
                    <div className="text-sm font-semibold">{field.title}</div>
                    {field?.cards?.length > 0 ? (
                      <div className="text-xs text-neutral-500">
                        {`${field.cards?.length} ${
                          field.cards?.length > 1 ? "cards" : "card"
                        }`}
                      </div>
                    ) : (
                      <div className="text-xs text-neutral-500">empty</div>
                    )}
                  </div>
                }
                noPadding
                containerClassName="px-2 py-1"
                blockContent
                outline
                animated={false}
              >
                <div className={fieldClassnames} title={field?.title}>
                  {Array.isArray(field?.cards) &&
                    field?.cards?.length > 0 &&
                    field?.cards?.map((card: CardTypes) => {
                      return (
                        <div
                          key={`smartScroll_card_${card?._id}`}
                          className="w-full h-[4px] dark:bg-neutral-600"
                        ></div>
                      );
                    })}
                </div>
              </Tooltip>
            );
          })}
        {(workspace.isWorkspaceOwner || workspace.isWorkspaceUser) && (
          <div className="h-full w-6 rounded-tr-md rounded-br-md dark:bg-neutral-700 bg-neutral-200 backdrop-blur-md flex items-center justify-center">
            +
          </div>
        )}
        {isSmartScrollVisible && (
          <div
            className="absolute rounded-lg top-0 bottom-0 border-2 border-blue-600 pointer-events-none"
            style={{
              width: smartScrollBorderWidth,
              left: scrollPos * 0.1,
            }}
          ></div>
        )}
      </div>
    </div>
  );
}
