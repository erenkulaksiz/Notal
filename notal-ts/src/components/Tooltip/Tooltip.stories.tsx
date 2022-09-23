import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Tooltip } from "@components";
import { CodeIcon } from "@icons";

export default {
  title: "Interactive/Tooltip",
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => (
  <Tooltip {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: "Inner content, hover over me",
  content: "Tooltip Content",
  direction: "top",
  outline: false,
};

export const LeftDirection = Template.bind({});
LeftDirection.args = {
  children: "Inner content, hover over me",
  content: "Tooltip Content",
  direction: "left",
  outline: true,
};

export const RightDirection = Template.bind({});
RightDirection.args = {
  children: "Inner content, hover over me",
  content: "Tooltip Content",
  direction: "right",
  outline: true,
};

export const BottomDirection = Template.bind({});
BottomDirection.args = {
  children: "Inner content, hover over me",
  content: "Tooltip Content",
  direction: "bottom",
  outline: true,
};

export const HideArrow = Template.bind({});
HideArrow.args = {
  children: "Inner content, hover over me",
  content: "Tooltip Content",
  direction: "bottom",
  outline: true,
  hideArrow: true,
};

export const CustomContent = Template.bind({});
CustomContent.args = {
  children: "Inner content, hover over me",
  content: (
    <>
      <CodeIcon />
      <span className="ml-2">This is custom content!</span>
    </>
  ),
  direction: "right",
  outline: true,
  hideArrow: true,
};
