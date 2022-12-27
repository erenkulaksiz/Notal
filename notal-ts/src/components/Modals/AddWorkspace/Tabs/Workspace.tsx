import { useRef } from "react";

import { Input, Checkbox } from "@components";
import { getRandomQuote, QUOTE_TYPES } from "@utils";
import { LIMITS } from "@constants/limits";
import { AddWorkspaceActionType } from "../AddWorkspace.d";
import {
  StarFilledIcon,
  StarOutlineIcon,
  VisibleIcon,
  VisibleOffIcon,
} from "@icons";
import type { WorkspaceTabProps } from ".";

export function WorkspaceTab({
  state,
  dispatch,
  newWorkspaceErr,
  submit,
}: WorkspaceTabProps) {
  const randomWorkspacePlaceholder = useRef(
    getRandomQuote(QUOTE_TYPES.WORKSPACE_TITLE)
  );

  return (
    <>
      <label
        htmlFor="workspaceTitle"
        className="flex flex-row items-center gap-2"
      >
        <span>Workspace Title*</span>
        <div className="text-xs text-neutral-400">
          {`${state.title.trim().length} / ${
            LIMITS.MAX.WORKSPACE_TITLE_CHARACTER_LENGTH
          }`}
        </div>
      </label>
      <Input
        fullWidth
        placeholder={randomWorkspacePlaceholder.current}
        onChange={(e) =>
          dispatch({
            type: AddWorkspaceActionType.SET_TITLE,
            payload: e.target.value,
          })
        }
        value={state.title}
        id="workspaceTitle"
        maxLength={LIMITS.MAX.WORKSPACE_TITLE_CHARACTER_LENGTH}
        onEnterPress={() => !state.thumbnailLoading && submit()}
      />
      {newWorkspaceErr.title != false && (
        <span className="text-red-500">{newWorkspaceErr.title}</span>
      )}
      <label
        htmlFor="workspaceDescription"
        className="flex flex-row items-center gap-2"
      >
        Workspace Description
        {state.desc?.trim().length != 0 && (
          <div className="text-xs text-neutral-400">
            {`${state?.desc?.trim().length} / ${
              LIMITS.MAX.WORKSPACE_DESC_CHARACTER_LENGTH
            }`}
          </div>
        )}
      </label>
      <Input
        fullWidth
        placeholder="Workspace Description"
        onChange={(e) =>
          dispatch({
            type: AddWorkspaceActionType.SET_DESC,
            payload: e.target.value,
          })
        }
        value={state.desc}
        id="workspaceDescription"
        maxLength={LIMITS.MAX.WORKSPACE_DESC_CHARACTER_LENGTH}
      />
      {newWorkspaceErr.desc != false && (
        <span className="text-red-500">{newWorkspaceErr.desc}</span>
      )}
      <div className="grid grid-cols-1 gap-2">
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            {state.starred ? (
              <StarFilledIcon
                size={24}
                fill="currentColor"
                style={{ transform: "scale(0.7)" }}
                className="-ml-1"
              />
            ) : (
              <StarOutlineIcon
                size={24}
                fill="currentColor"
                style={{ transform: "scale(0.7)" }}
                className="-ml-1"
              />
            )}
            <Checkbox
              id="starredWorkspace"
              checked={state.starred}
              onChange={(starred) =>
                dispatch({
                  type: AddWorkspaceActionType.SET_STARRED,
                  payload: starred,
                })
              }
            >
              Add to favorites
            </Checkbox>
          </div>
          <div className="text-sm dark:text-neutral-400 text-neutral-500">
            Add this workspace to your favorites.
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            {state.workspaceVisible ? (
              <VisibleIcon
                width={24}
                height={24}
                fill="currentColor"
                style={{ transform: "scale(0.7)" }}
                className="-ml-1"
              />
            ) : (
              <VisibleOffIcon
                width={24}
                height={24}
                fill="currentColor"
                style={{ transform: "scale(0.7)" }}
                className="-ml-1"
              />
            )}
            <Checkbox
              id="privateWorkspace"
              checked={state.workspaceVisible}
              onChange={(workspaceVisible) =>
                dispatch({
                  type: AddWorkspaceActionType.SET_VISIBLE,
                  payload: workspaceVisible,
                })
              }
            >
              Public Workspace
            </Checkbox>
          </div>
          <div className="text-sm dark:text-neutral-400 text-neutral-500">
            If enabled, anyone can see your workspace even if they arent signed
            in.
          </div>
        </div>
      </div>
    </>
  );
}
