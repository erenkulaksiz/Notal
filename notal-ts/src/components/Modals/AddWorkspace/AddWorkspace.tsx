import { useState, useRef, useReducer } from "react";

import {
  Modal,
  Button,
  Input,
  Checkbox,
  HomeWorkspaceCard,
  Select,
  Loading,
  Tab,
  Colorpicker,
  Avatar,
} from "@components";
import {
  AddIcon,
  CrossIcon,
  CheckIcon,
  StarFilledIcon,
  StarOutlineIcon,
  VisibleIcon,
  VisibleOffIcon,
  CloudUploadIcon,
  AtIcon,
  DeleteIcon,
} from "@icons";
import { Log, getRandomQuote, QUOTE_TYPES } from "@utils";
import { useAuth, useNotalUI } from "@hooks";
import { WorkspaceService } from "@services/WorkspaceService";
import { LIMITS } from "@constants/limits";
import { WorkspaceDefaults } from "@constants/workspacedefaults";
import {
  AddWorkspaceModalProps,
  AddWorkspaceActionType,
} from "./AddWorkspace.d";
import { reducer } from "./reducer";
import { fetchUserData } from "@utils/fetcher/userdata";
import { OwnerTypes } from "@types";

export function AddWorkspaceModal({
  open,
  onClose,
  onAdd,
}: AddWorkspaceModalProps) {
  const auth = useAuth();
  const [state, dispatch] = useReducer(reducer, {
    ...WorkspaceDefaults,
    thumbnailLoading: false,
    addUserLoading: false,
  });
  const NotalUI = useNotalUI();
  const randomWorkspacePlaceholder = useRef(
    getRandomQuote(QUOTE_TYPES.WORKSPACE_TITLE)
  );

  const [newWorkspaceErr, setNewWorkspaceErr] = useState<{
    title: string | boolean;
    desc: string | boolean;
  }>({
    title: false,
    desc: false,
  });
  const [tab, setTab] = useState<number>(0);
  const thumbnailRef = useRef<HTMLInputElement>(null);

  function close() {
    onClose();
    randomWorkspacePlaceholder.current = getRandomQuote(
      QUOTE_TYPES.WORKSPACE_TITLE
    );
    setNewWorkspaceErr({ ...newWorkspaceErr, title: false, desc: false });
    dispatch({
      type: AddWorkspaceActionType.SET_WORKSPACE,
      payload: WorkspaceDefaults,
    });
    dispatch({
      type: AddWorkspaceActionType.SET_ALL_LOADING, // Sets thumbnailLoading and addUserLoading to false
      payload: false,
    });
    dispatch({
      type: AddWorkspaceActionType.SET_WORKSPACE_TEAM_USERNAME,
      payload: "",
    });
    dispatch({
      type: AddWorkspaceActionType.RESET_USERS,
    });
    setTab(0);
  }

  async function submit() {
    if (
      state.title.trim().length < LIMITS.MIN.WORKSPACE_TITLE_CHARACTER_LENGTH
    ) {
      setNewWorkspaceErr({
        ...newWorkspaceErr,
        title: `Title must be minimum ${LIMITS.MIN.WORKSPACE_TITLE_CHARACTER_LENGTH} characters long.`,
      });
      return;
    }
    if (
      state.title.trim().length > LIMITS.MAX.WORKSPACE_TITLE_CHARACTER_LENGTH
    ) {
      setNewWorkspaceErr({
        ...newWorkspaceErr,
        title: `Title must be maximum ${LIMITS.MAX.WORKSPACE_TITLE_CHARACTER_LENGTH} characters long.`,
      });
      return;
    }
    if (
      state.desc &&
      state.desc.trim().length > LIMITS.MAX.WORKSPACE_DESC_CHARACTER_LENGTH
    ) {
      setNewWorkspaceErr({
        ...newWorkspaceErr,
        desc: `Description must be maximum ${LIMITS.MAX.WORKSPACE_DESC_CHARACTER_LENGTH} characters long.`,
      });
      return;
    }
    // reset errors
    setNewWorkspaceErr({ ...newWorkspaceErr, title: false, desc: false });

    // on non-image type thumbnails
    if (state.thumbnail.type != "image") {
      onAdd(state);
      close();
      return;
    }

    if (!state.thumbnail.fileData) return;
    Log.debug(state.thumbnail.fileData);

    // check file size
    const file = Math.round(state.thumbnail.fileData.size / 1024);
    if (file >= LIMITS.MAX.WORKSPACE_THUMBNAIL_IMAGE_SIZE) {
      NotalUI.Toast.show({
        title: "Error",
        desc: `File size must be less than ${LIMITS.MAX.WORKSPACE_THUMBNAIL_IMAGE_SIZE.toString().charAt(
          0
        )}MB.`,
        type: "error",
        once: true,
        id: "add-workspace-thumbnail-error",
      });
      return;
    }

    // check file type
    const fileType = state.thumbnail.fileData.type;

    if (
      fileType == "image/jpeg" ||
      fileType == "image/png" ||
      fileType == "image/jpg"
    ) {
      dispatch({
        type: AddWorkspaceActionType.SET_THUMB_LOADING,
        payload: true,
      });
      const res = await WorkspaceService.workspace.uploadThumbnail({
        image: state.thumbnail.fileData,
      });

      if (res && res.success) {
        dispatch({
          type: AddWorkspaceActionType.SET_THUMB_LOADING,
          payload: false,
        });
        dispatch({
          type: AddWorkspaceActionType.SET_THUMBNAIL,
          payload: {
            thumbnail: {
              ...state.thumbnail,
              file: res.url,
              fileData: null,
            },
          },
        });
        // send res data to server now
        Log.debug("thumbnail upload success! res: ", res);

        onAdd({
          ...state,
          thumbnail: {
            file: res.url,
            type: "image",
          },
          _id: Date.now().toString(),
          id: Date.now().toString(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        close();
        return;
      } else {
        // error
        Log.error("thumbnail upload error: ", res);
        dispatch({
          type: AddWorkspaceActionType.SET_THUMB_LOADING,
          payload: false,
        });
        NotalUI.Toast.show({
          title: "Error",
          desc: "An error occurred while uploading the file. Please check the console.",
          type: "error",
          once: true,
          id: "add-workspace-thumbnail-error",
        });
        return;
      }
    }
  }

  function onThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      let file = e.target.files[0];
      reader.onloadend = () => {
        dispatch({
          type: AddWorkspaceActionType.SET_THUMBNAIL,
          payload: {
            thumbnail: {
              ...state.thumbnail,
              file: reader.result,
              fileData: file,
            },
          },
        });
      };
      reader.readAsDataURL(file);
    }
  }

  async function addUserToWorkspace() {
    // First, fetch user details from the server and make sure user exists
    dispatch({
      type: AddWorkspaceActionType.SET_ADD_USER_LOADING,
      payload: true,
    });
    if (!state.team?.username) return;

    // Check if user trying to add himself
    if (state.team.username == auth?.validatedUser?.username) {
      NotalUI.Toast.show({
        title: "Error",
        desc: `You cant add yourself to your own workspace.`,
        type: "error",
        id: "add-user-own-workspace-error",
        once: true,
      });
      dispatch({
        type: AddWorkspaceActionType.SET_ADD_USER_LOADING,
        payload: false,
      });
      return;
    }

    const token = await auth?.user.getIdToken();
    if (!token?.success) return;
    const user = await fetchUserData({
      username: state.team.username?.trim(),
      token: token.res,
      uid: auth?.authUser?.uid,
    });
    if (!user?.success) {
      dispatch({
        type: AddWorkspaceActionType.SET_ADD_USER_LOADING,
        payload: false,
      });
      if (user?.error == "no-user-found") {
        NotalUI.Toast.show({
          title: "Error",
          desc: `Theres no user with username @${state?.team?.username?.trim()}`,
          type: "error",
        });
        return;
      }
      NotalUI.Toast.show({
        title: "Error",
        desc: "An error occurred while adding the user. Please check the console.",
        type: "error",
        once: true,
        id: "add-user-workspace-error",
      });
      return;
    }
    Log.debug("user: ", user);
    dispatch({
      type: AddWorkspaceActionType.ADD_USER,
      payload: user.data,
    });
  }

  function removeUserFromWorkspace(user: OwnerTypes) {
    dispatch({
      type: AddWorkspaceActionType.REMOVE_USER,
      payload: user?.username,
    });
  }

  return (
    <Modal
      open={open}
      onClose={() => !state.thumbnailLoading && close()}
      className="w-[90%] sm:w-[400px] p-4 px-5 relative"
      animate
    >
      <Modal.Title animate>
        <AddIcon size={24} fill="currentColor" />
        <span className="text-lg font-medium ml-1">Add Workspace</span>
      </Modal.Title>
      <Modal.Body className="flex flex-col pb-2 " animate>
        {(state.thumbnailLoading || state.addUserLoading) && (
          <div className="absolute left-0 right-0 bottom-0 top-0 flex items-center justify-center bg-neutral-300/40 dark:bg-neutral-800/40 rounded-xl z-[999]">
            <Loading size="xl" />
          </div>
        )}
        <div className="w-full mb-4 relative pointer-events-none">
          <div className="text-3xl font-medium absolute left-2 top-0 z-50 uppercase dark:text-white/50 text-black/30">
            Preview
          </div>
          <HomeWorkspaceCard
            preview
            workspace={{
              workspaceVisible: state.workspaceVisible,
              title: state.title.trim() || "Enter a title",
              desc: state.desc?.trim(),
              starred: state.starred,
              thumbnail: state.thumbnail,
              _id: WorkspaceDefaults._id,
              id: WorkspaceDefaults.id,
              createdAt: WorkspaceDefaults.createdAt,
              updatedAt: WorkspaceDefaults.updatedAt,
            }}
          />
        </div>
        <Tab
          selected={tab}
          onSelect={(index) => setTab(index)}
          id="workspaceTab"
          globalTabViewClassName="pt-2 flex flex-col gap-2"
          animated
        >
          <Tab.TabView title="Workspace">
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
                  If enabled, anyone can see your workspace even if they arent
                  signed in.
                </div>
              </div>
            </div>
          </Tab.TabView>
          <Tab.TabView title="Thumbnail">
            <label htmlFor="thumbnailType">Workspace Thumbnail Type</label>
            <Select
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
          </Tab.TabView>
          <Tab.TabView title="Users">
            <div className="text-sm dark:text-neutral-400 text-neutral-500">
              Add users to this workspace to work with together. You can edit
              users later.
            </div>
            <div className="flex flex-row gap-2">
              <Input
                fullWidth
                placeholder="Enter username..."
                onChange={(e) =>
                  dispatch({
                    type: AddWorkspaceActionType.SET_WORKSPACE_TEAM_USERNAME,
                    payload: e.target.value,
                  })
                }
                value={state.team?.username}
                id="teamAddUser"
                icon={<AtIcon width={24} height={24} fill="currentColor" />}
                onEnterPress={() =>
                  state.team?.username?.trim() && addUserToWorkspace()
                }
              />
              {state.team?.username?.trim() && (
                <Button
                  onClick={() => addUserToWorkspace()}
                  title="Add User"
                  className="items-center justify-center"
                >
                  <AddIcon width={24} height={24} fill="currentColor" />
                </Button>
              )}
            </div>
            {Array.isArray(state.team?.users) && state?.team?.users && (
              <div className="flex flex-col gap-2">
                {state.team?.users?.map((user) => (
                  <div
                    className="flex items-center border-2 border-neutral-500/40 dark:border-neutral-700 rounded-xl p-2 justify-between"
                    key={`workspaceUser_${user.uid}`}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <Avatar size="3xl" src={user?.avatar} />
                      <div className="flex flex-col">
                        <div className="text-lg font-semibold">
                          {`@${user?.username}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row items-center justify-end">
                      <button>
                        <DeleteIcon
                          onClick={() => removeUserFromWorkspace(user)}
                          size={24}
                          className="fill-red-600 scale-90"
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Tab.TabView>
        </Tab>
      </Modal.Body>
      <Modal.Footer className="justify-between items-end flex-1" animate>
        <Button
          light="bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500"
          onClick={() => !state.thumbnailLoading && close()}
          fullWidth="w-[49%]"
        >
          <CrossIcon size={24} fill="currentColor" />
          Cancel
        </Button>
        <Button
          onClick={() => !state.thumbnailLoading && submit()}
          loading={state.thumbnailLoading}
          fullWidth="w-[49%]"
        >
          <CheckIcon size={24} fill="currentColor" />
          Add Workspace
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
