import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button, AddCardModal } from "@components";

export default {
  title: "Interactive/Modals/AddCardModal",
  component: AddCardModal,
} as ComponentMeta<typeof AddCardModal>;

const Template: ComponentStory<typeof AddCardModal> = (args) => {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <Button onClick={() => setVisible(true)}>Open Modal</Button>
      <AddCardModal
        open={visible}
        onClose={() => setVisible(false)}
        onAdd={() => setVisible(false)}
      />
    </>
  );
};

export const Default = Template.bind({});
