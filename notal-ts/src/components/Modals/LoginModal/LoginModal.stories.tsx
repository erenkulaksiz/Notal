import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button, LoginModal } from "@components";

export default {
  title: "Interactive/Modals/LoginModal",
  component: LoginModal,
} as ComponentMeta<typeof LoginModal>;

const Template: ComponentStory<typeof LoginModal> = (args) => {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <Button onClick={() => setVisible(true)}>Open Modal</Button>
      <LoginModal
        open={visible}
        onClose={() => setVisible(false)}
        onLoginSuccess={() => {}}
      />
    </>
  );
};

export const Default = Template.bind({});
