import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button } from "@components";
import { CodeIcon } from "@icons";

export default {
  title: "Interactive/Form/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Button",
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: (
    <>
      <CodeIcon width={24} height={24} fill="currentColor" className="mr-1" />
      <span>Button</span>
    </>
  ),
};

export const Gradient = Template.bind({});
Gradient.args = {
  children: "Button",
  gradient: true,
};

export const Light = Template.bind({});
Light.args = {
  children: "Button",
  className: "text-black",
  light: true,
};

export const NotRounded = Template.bind({});
NotRounded.args = {
  children: "Button",
  rounded: "rounded-none",
};

export const FullRounded = Template.bind({});
FullRounded.args = {
  children: "Button",
  rounded: true,
};

export const NoFocusRing = Template.bind({});
NoFocusRing.args = {
  children: "Button",
  ring: "outline-none",
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  children: "Button",
  size: "sm",
};

export const LargeSize = Template.bind({});
LargeSize.args = {
  children: "Button",
  size: "lg",
};

export const XLargeSize = Template.bind({});
XLargeSize.args = {
  children: "Button",
  size: "xl",
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  children: "Button",
  fullWidth: true,
};
FullWidth.parameters = {
  layout: "left",
};

export const Loading = Template.bind({});
Loading.args = {
  children: "Button",
  loading: true,
};

export const RedButton = Template.bind({});
RedButton.args = {
  children: "Button",
  light: "bg-red-600",
};
