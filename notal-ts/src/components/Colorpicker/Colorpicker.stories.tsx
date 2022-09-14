import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Colorpicker } from "./Colorpicker";

export default {
  title: "Interactive/Colorpicker",
  component: Colorpicker,
} as ComponentMeta<typeof Colorpicker>;

const Template: ComponentStory<typeof Colorpicker> = (args) => {
  const [color, setColor] = useState("#00ff00");

  return (
    <Colorpicker
      {...args}
      onChange={(color) => setColor(color)}
      color={color}
    />
  );
};

export const Default = Template.bind({});
