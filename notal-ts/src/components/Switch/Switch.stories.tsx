import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Switch } from "./Switch";
import { CodeIcon } from "@icons";

export default {
  title: "Interactive/Form/Switch",
  component: Switch,
} as ComponentMeta<typeof Switch>;

const Template: ComponentStory<typeof Switch> = (args) => {
  const [value, setValue] = useState(false);

  return (
    <Switch
      {...args}
      value={value}
      onChange={(event) => setValue(event.target.checked)}
      id="switch"
    />
  );
};

export const Default = Template.bind({});

export const WithIcon = Template.bind({});
WithIcon.args = {
  icon: (
    <CodeIcon
      width={24}
      height={24}
      fill="black"
      style={{
        transform: "scale(0.5)",
        position: "absolute",
        top: -4,
        right: 0,
        left: -4,
        bottom: 0,
      }}
    />
  ),
};
