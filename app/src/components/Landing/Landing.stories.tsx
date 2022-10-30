import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Landing } from "@components";

export default {
  title: "Static/Landing",
  component: Landing,
} as ComponentMeta<typeof Landing>;

const Template: ComponentStory<typeof Landing> = (args) => <Landing />;

export const Default = Template.bind({});
Default.args = {};
