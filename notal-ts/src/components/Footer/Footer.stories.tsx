import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Footer } from "@components";

export default {
  title: "Static/Footer",
  component: Footer,
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = (args) => <Footer {...args} />;

export const Default = Template.bind({});
