import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Switch } from "./Switch";
import { CodeIcon } from "@icons";

export default {
  title: "Interactive/Switch",
  component: Switch,
} as ComponentMeta<typeof Switch>;

const Template: ComponentStory<typeof Switch> = (args) => <Switch {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: false,
};

export const Open = Template.bind({});
Open.args = {
  value: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  icon: (
    <CodeIcon
      width={24}
      height={24}
      fill="black"
      style={{
        transform: "scale(0.5)",
        position: "absolute",
        top: -4,
        right: 0,
        left: -4,
        bottom: 0,
      }}
    />
  ),
  value: false,
};
