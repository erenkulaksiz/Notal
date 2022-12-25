import React, { useState, useEffect, useRef } from "react";

import { useWorkspace } from "@hooks";
import { FieldTypes } from "@types";
import { scale } from "@utils";

function getWindowDimensions() {
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

  const fields = workspace?.workspace?.data?.data?.fields;

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      if (!smartScrollRef?.current) return;
      if (
        Math.floor(getWindowDimensions().width * 0.1) <
        Math.floor(smartScrollRef?.current?.clientWidth)
      ) {
        setWindowDimensions(getWindowDimensions());
      }
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
      className="fixed right-4 bottom-5 z-50 h-12 dark:bg-neutral-600/20 bg-neutral-100 overflow-hidden backdrop-blur rounded-md p-[6px] flex flex-row gap-1"
    >
      {Array.isArray(fields) &&
        fields?.map((field: FieldTypes) => (
          <div
            key={`smartScroll_field_${field._id}`}
            className="h-full w-6 dark:bg-neutral-500 bg-neutral-200 backdrop-blur-md"
          ></div>
        ))}
      {workspace.isWorkspaceOwner && (
        <div className="h-full w-6 dark:bg-neutral-600 bg-neutral-200 backdrop-blur-md flex items-center justify-center">
          +
        </div>
      )}
      <div
        className="absolute top-0 bottom-0 dark:bg-neutral-400/50 bg-neutral-300/50 cursor-col-resize"
        style={{ width: windowDimensions.width * 0.1, left: scrollPos * 0.1 }}
      ></div>
    </div>
  );
}
