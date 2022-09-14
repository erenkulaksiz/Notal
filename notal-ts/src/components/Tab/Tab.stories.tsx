import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Tab from "./Tab";

export default {
  title: "Interactive/Tab",
  component: Tab,
} as ComponentMeta<typeof Tab>;

const Template: ComponentStory<typeof Tab> = (args) => <Tab {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: [
    <Tab.TabView title="Tabview 1" key={1}>
      <span>Tab view 1</span>
    </Tab.TabView>,
    <Tab.TabView title="Tabview 2" key={2}>
      <span>Tab view 2</span>
    </Tab.TabView>,
  ],
  selected: 0,
};
