import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Input } from "./Input";

export default {
  title: "Interactive/Input",
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
