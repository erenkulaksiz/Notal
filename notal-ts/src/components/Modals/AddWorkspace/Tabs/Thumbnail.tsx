import { Select, Colorpicker } from "@components";
import { AddWorkspaceActionType } from "../AddWorkspace.d";
import { CloudUploadIcon } from "@icons";
import type { ThumbnailTabProps } from ".";

export function ThumbnailTab({
  state,
  dispatch,
  onThumbnailChange,
  thumbnailRef,
}: ThumbnailTabProps) {
  return (
    <>
      <label htmlFor="thumbnailType">Workspace Thumbnail Type</label>
      <Select
        value={state?.thumbnail?.type}
        onChange={(e) =>
          dispatch({
            type: AddWorkspaceActionType.SET_THUMB_TYPE,
            payload: e.target.value,
          })
        }
        className="w-full"
        id="thumbnailType"
        options={[
          {
            id: "gradient",
            text: "Color Gradient",
          },
          {
            id: "image",
            text: "Image",
          },
          {
            id: "singleColor",
            text: "Single Color",
          },
        ]}
      />
      {state?.thumbnail?.type == "image" && (
        <div
          className="flex flex-col text-blue-400 mt-2 items-center justify-center w-full h-16 border-2 border-solid border-blue-400 group hover:border-blue-300 hover:text-blue-300 rounded-xl cursor-pointer"
          onClick={() => {
            if (!state.thumbnailLoading) {
              thumbnailRef?.current?.click();
            }
          }}
        >
          <CloudUploadIcon size={24} fill="currentColor" />
          Upload Thumbnail
          <input
            type="file"
            ref={thumbnailRef}
            style={{ display: "none" }}
            onChange={onThumbnailChange}
            accept="image/png, image/jpeg"
          />
        </div>
      )}
      {state?.thumbnail?.type == "singleColor" && (
        <div className="flex flex-col items-start">
          <label htmlFor="cardColor">Workspace Color</label>
          <Colorpicker
            id="cardColor"
            color={state?.thumbnail?.color}
            onChange={(color) => {
              dispatch({
                type: AddWorkspaceActionType.SET_THUMB_COLOR,
                payload: color,
              });
            }}
          />
        </div>
      )}
      {state?.thumbnail?.type == "gradient" && (
        <div className="flex items-center gap-2">
          <div>
            <label htmlFor="workspaceStartColor">Start Color</label>
            <Colorpicker
              id="workspaceStartColor"
              color={state?.thumbnail?.colors?.start}
              onChange={(color) => {
                dispatch({
                  type: AddWorkspaceActionType.SET_THUMB_GRADIENT_COLORS,
                  payload: {
                    start: color,
                  },
                });
              }}
            />
          </div>
          <div>
            <label htmlFor="workspaceEndColor">End Color</label>
            <Colorpicker
              id="workspaceEndColor"
              color={state?.thumbnail?.colors?.end}
              onChange={(color) => {
                dispatch({
                  type: AddWorkspaceActionType.SET_THUMB_GRADIENT_COLORS,
                  payload: {
                    end: color,
                  },
                });
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
