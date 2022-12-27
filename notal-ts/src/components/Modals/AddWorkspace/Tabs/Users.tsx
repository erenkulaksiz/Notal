import { Input, Button, Avatar, Tooltip } from "@components";
import { AtIcon, AddIcon, DeleteIcon } from "@icons";
import { AddWorkspaceActionType } from "../AddWorkspace.d";
import type { UsersTabProps } from ".";

export function UsersTab({
  state,
  dispatch,
  addUserToWorkspace,
  removeUserFromWorkspace,
}: UsersTabProps) {
  return (
    <>
      <div className="text-sm dark:text-neutral-400 text-neutral-500">
        Add users to this workspace to work with together. You can edit users
        later.
      </div>
      <div className="flex flex-row gap-2">
        <Input
          fullWidth
          placeholder="Enter username..."
          onChange={(e) =>
            dispatch({
              type: AddWorkspaceActionType.SET_WORKSPACE_TEAM_USERNAME,
              payload: e.target.value.toLowerCase(),
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
                <Tooltip direction="right" content="Remove User">
                  <button>
                    <DeleteIcon
                      onClick={() => removeUserFromWorkspace(user)}
                      size={24}
                      className="fill-red-600 scale-90"
                    />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
