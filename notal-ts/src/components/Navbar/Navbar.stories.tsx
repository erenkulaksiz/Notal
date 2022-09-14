import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Navbar } from "./Navbar";

export default {
  title: "Interactive/Navbar",
  component: Navbar,
} as ComponentMeta<typeof Navbar>;

const Template: ComponentStory<typeof Navbar> = (args) => <Navbar {...args} />;

export const Default = Template.bind({});

export const Validating = Template.bind({});
Validating.args = {
  validating: true,
};
