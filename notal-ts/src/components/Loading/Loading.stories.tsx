import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Loading } from "./Loading";

export default {
  title: "Static/Loading",
  component: Loading,
} as ComponentMeta<typeof Loading>;

const Template: ComponentStory<typeof Loading> = (args) => (
  <Loading {...args} />
);

export const Default = Template.bind({});
Default.args = {
  size: "sm",
};

export const Medium = Template.bind({});
Medium.args = {
  size: "md",
};

export const Large = Template.bind({});
Large.args = {
  size: "lg",
};

export const XLarge = Template.bind({});
XLarge.args = {
  size: "xl",
};
