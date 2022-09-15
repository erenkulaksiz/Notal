import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AlertModal } from "./Alert";
import { Button } from "@components";

export default {
  title: "Interactive/Modals/AlertModal",
  component: AlertModal,
} as ComponentMeta<typeof AlertModal>;

const Template: ComponentStory<typeof AlertModal> = (args) => {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <Button onClick={() => setVisible(true)}>Open Alert</Button>
      <AlertModal
        {...args}
        alert={{ ...args.alert, visible }}
        onClose={() => setVisible(false)}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  alert: {
    title: "Example Alert",
    desc: "Lorem ipsum dolor amet.",
    visible: true,
  },
};

export const WithoutCrossCloseButton = Template.bind({});
WithoutCrossCloseButton.args = {
  alert: {
    title: "Example Alert",
    desc: "Lorem ipsum dolor amet.",
    visible: true,
    showCloseButton: false,
  },
};

export const WithCustomContent = Template.bind({});
WithCustomContent.args = {
  alert: {
    customContent: (
      <div className="flex flex-row items-center">
        <Button className="mr-2">Button</Button>
        <span>Custom Content</span>
      </div>
    ),
    showCloseButton: false,
    visible: true,
  },
};

export const WithButtons = Template.bind({});
WithButtons.args = {
  alert: {
    title: "Example Alert",
    desc: "Lorem ipsum dolor amet.",
    visible: true,
    buttons: [
      <Button fullWidth key={1}>
        Button 1
      </Button>,
      <Button fullWidth light="bg-red-600" key={2}>
        Button 2
      </Button>,
    ],
  },
};

export const WithCloseButton = Template.bind({});
WithCloseButton.args = {
  alert: {
    title: "Example Alert",
    desc: "Lorem ipsum dolor amet.",
    visible: true,
    showCloseButton: true,
  },
};

export const NotCloseable = Template.bind({});
NotCloseable.args = {
  alert: {
    title: "Example Alert",
    desc: "Lorem ipsum dolor amet.",
    visible: true,
    notCloseable: true,
  },
};
