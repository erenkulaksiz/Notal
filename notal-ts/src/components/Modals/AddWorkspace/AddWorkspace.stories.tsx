import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button, AddWorkspaceModal } from "@components";

export default {
  title: "Interactive/Modals/AddWorkspaceModal",
  component: AddWorkspaceModal,
} as ComponentMeta<typeof AddWorkspaceModal>;

const Template: ComponentStory<typeof AddWorkspaceModal> = (args) => {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <Button onClick={() => setVisible(true)}>Open Modal</Button>
      <AddWorkspaceModal
        open={visible}
        onClose={() => setVisible(false)}
        onAdd={() => setVisible(false)}
      />
    </>
  );
};

export const Default = Template.bind({});
