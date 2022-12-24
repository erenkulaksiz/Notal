import { Modal, Tooltip, Avatar } from "@components";
import { SettingsIcon } from "@icons";

import type { WorkspaceSettingsProps } from "./WorkspaceSettings.d";

export function WorkspaceSettingsModal({
  open,
  workspace,
  onClose,
  onWorkspaceUpdate,
}: WorkspaceSettingsProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      animate
      className="w-[90%] sm:w-[400px] p-4 px-5 relative"
    >
      <Modal.Title animate>
        <SettingsIcon size={24} fill="currentColor" />
        <span className="text-lg font-medium ml-1">Workspace Settings</span>
      </Modal.Title>
    </Modal>
  );
}
