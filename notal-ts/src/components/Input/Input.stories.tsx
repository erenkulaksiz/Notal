import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Input } from "./Input";
import { CodeIcon } from "@icons";

export default {
  title: "Interactive/Form/Input",
  component: Input,
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => {
  const [value, setValue] = useState("Input");

  return (
    <Input
      {...args}
      onChange={(event) => setValue(event.target.value)}
      value={value}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  placeholder: "Input placeholder",
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  fullWidth: true,
};
FullWidth.parameters = {
  layout: "left",
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  icon: <CodeIcon width={24} height={24} fill="currentColor" />,
};

export const WithPassword = Template.bind({});
WithPassword.args = {
  password: true,
};

export const WithPasswordVisiblity = Template.bind({});
WithPasswordVisiblity.args = {
  password: true,
  passwordVisibility: true,
};
