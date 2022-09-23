import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AcceptCookies } from "@components";

export default {
  title: "Interactive/AcceptCookies",
  component: AcceptCookies,
} as ComponentMeta<typeof AcceptCookies>;

const Template: ComponentStory<typeof AcceptCookies> = (args) => (
  <AcceptCookies />
);

export const Default = Template.bind({});
