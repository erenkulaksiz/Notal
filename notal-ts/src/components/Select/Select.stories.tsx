import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Select } from "./Select";

export default {
  title: "Interactive/Select",
  component: Select,
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => {
  const [selected, setSelected] = useState();

  return (
    <Select
      {...args}
      id="select"
      value={selected}
      onChange={(event) => setSelected(event.target.value)}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  options: [
    {
      text: "Option 1",
    },
    {
      text: "Option 2",
    },
    {
      text: "Option 3",
    },
    {
      text: "Option Disabled",
      disabled: true,
    },
  ],
};
