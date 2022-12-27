import { useState, useRef, useReducer, useEffect } from "react";

import {
  Modal,
  Button,
  HomeWorkspaceCard,
  Loading,
  Tab,
  Tooltip,
} from "@components";
import { AddIcon, CrossIcon, CheckIcon, SettingsIcon, LinkIcon } from "@icons";
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

import Tabs from "./Tabs";

export function AddWorkspaceModal({
  open,
  onClose,
  onAdd,
  onEdit,
  editing,
  editWorkspace,
}: AddWorkspaceModalProps) {
  const auth = useAuth();
  const [state, dispatch] = useReducer(reducer, {
    ...WorkspaceDefaults,
    thumbnailLoading: false,
    addUserLoading: false,
    linkCopied: false,
  });
  const NotalUI = useNotalUI();
  const randomWorkspacePlaceholder = useRef(
    getRandomQuote(QUOTE_TYPES.WORKSPACE_TITLE)
  );

  useEffect(() => {
    if (open && editing) {
      if (typeof editWorkspace?.users != "object") return;
      if (typeof editWorkspace?.owner != "object") return;
      const users = editWorkspace.users;
      const workspaceOwner = editWorkspace?.owner?.uid;

      dispatch({
        type: AddWorkspaceActionType.SET_WORKSPACE,
        payload: {
          ...editWorkspace,
          fields: null,
          team: {
            users: Object.keys(users)
              .map((user: string) => users[user])
              .filter((user: OwnerTypes) => user.uid != workspaceOwner),
          },
        },
      });
    }
  }, [open]);

  useEffect(() => {
    if (state.linkCopied) {
      setTimeout(() => {
        dispatch({
          type: AddWorkspaceActionType.SET_LINK_COPIED,
          payload: false,
        });
      }, 3000);
    }
  }, [state.linkCopied]);

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
      typeof onAdd == "function" && onAdd(state);
      typeof onEdit == "function" && onEdit(state);
      close();
      return;
    }

    Log.debug("filedata", state.thumbnail.fileData);
    if (!state.thumbnail.fileData && editing) {
      typeof onEdit == "function" && onEdit(state);
      close();
      return;
    }

    if (!state.thumbnail.fileData) return;

    // check file size
    const file = Math.round(state?.thumbnail?.fileData?.size / 1024);
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

        typeof onAdd == "function" &&
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
        typeof onEdit == "function" &&
          onEdit({
            ...state,
            thumbnail: {
              file: res.url,
              type: "image",
            },
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
        {editing && (
          <>
            <SettingsIcon size={24} fill="currentColor" />
            <span className="text-lg font-medium ml-1">Workspace Settings</span>
          </>
        )}
        {!editing && (
          <>
            <AddIcon size={24} fill="currentColor" />
            <span className="text-lg font-medium ml-1">Add Workspace</span>
          </>
        )}
      </Modal.Title>
      <Modal.Body className="flex flex-col pb-2 " animate>
        {(state.thumbnailLoading || state.addUserLoading) && (
          <div className="absolute left-0 right-0 bottom-0 top-0 flex items-center justify-center bg-neutral-300/40 dark:bg-neutral-800/40 rounded-xl z-[999]">
            <Loading size="xl" />
          </div>
        )}
        <div className="w-full relative gap-2 flex flex-col mb-2">
          <div className="pointer-events-none">
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
          {editing && (
            <div className="w-full flex flex-row items-center p-2 border-2 border-neutral-500/40 dark:border-neutral-700 rounded-lg gap-2">
              <Tooltip
                direction="left"
                content={state.linkCopied ? "Copied!" : "Copy Link"}
              >
                <button
                  className="border-2 rounded-md border-neutral-500/40 dark:border-neutral-700 px-1 cursor-pointer"
                  onClick={() => {
                    if (state.linkCopied) return;
                    navigator.clipboard.writeText(`notal.app/w/${state.id}`);
                    dispatch({
                      type: AddWorkspaceActionType.SET_LINK_COPIED,
                      payload: true,
                    });
                  }}
                >
                  <LinkIcon size={24} fill="currentColor" />
                </button>
              </Tooltip>
              <span>{`notal.app/w/${state.id}`}</span>
            </div>
          )}
        </div>
        <Tab
          selected={tab}
          onSelect={(index) => setTab(index)}
          id="workspaceTab"
          globalTabViewClassName="pt-2 flex flex-col gap-2"
          animated
        >
          <Tab.TabView title="Workspace">
            <Tabs.Workspace
              state={state}
              dispatch={dispatch}
              newWorkspaceErr={newWorkspaceErr}
              submit={submit}
            />
          </Tab.TabView>
          <Tab.TabView title="Thumbnail">
            <Tabs.Thumbnail
              state={state}
              dispatch={dispatch}
              onThumbnailChange={onThumbnailChange}
              thumbnailRef={thumbnailRef}
            />
          </Tab.TabView>
          <Tab.TabView title="Users">
            <Tabs.Users
              state={state}
              dispatch={dispatch}
              addUserToWorkspace={addUserToWorkspace}
              removeUserFromWorkspace={removeUserFromWorkspace}
            />
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
          {editing ? "Edit Workspace" : "Add Workspace"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
