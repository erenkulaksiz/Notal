import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Checkbox } from "./Checkbox";

export default {
  title: "Interactive/Checkbox",
  component: Checkbox,
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      {...args}
      onChange={(checked) => setChecked(checked)}
      checked={checked}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  children: "Checkbox",
  id: "checkbox",
};
