import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button, AddFieldModal } from "@components";

export default {
  title: "Interactive/Modals/AddFieldModal",
  component: AddFieldModal,
} as ComponentMeta<typeof AddFieldModal>;

const Template: ComponentStory<typeof AddFieldModal> = (args) => {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <Button onClick={() => setVisible(true)}>Open Modal</Button>
      <AddFieldModal
        open={visible}
        onClose={() => setVisible(false)}
        onAdd={() => setVisible(false)}
        workspaceTitle="Test Workspace"
      />
    </>
  );
};

export const Default = Template.bind({});
