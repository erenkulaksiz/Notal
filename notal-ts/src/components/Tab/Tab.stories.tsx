import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Tab } from "@components";
import { CodeIcon, HeartIcon } from "@icons";

export default {
  title: "Interactive/Tab",
  component: Tab,
} as ComponentMeta<typeof Tab>;

const Template: ComponentStory<typeof Tab> = (args) => {
  const [selected, setSelected] = useState(0);

  return (
    <Tab
      {...args}
      selected={selected}
      onSelect={(selected) => setSelected(selected)}
      id="tab"
    />
  );
};

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

export const MoreTabviews = Template.bind({});
MoreTabviews.args = {
  children: [
    <Tab.TabView title="Tabview 1" key={1}>
      <span>Tab view 1</span>
    </Tab.TabView>,
    <Tab.TabView title="Tabview 2" key={2}>
      <span>Tab view 2</span>
    </Tab.TabView>,
    <Tab.TabView title="Tabview 3" key={3}>
      <span>Tab view 3</span>
    </Tab.TabView>,
    <Tab.TabView title="Tabview 4" key={4}>
      <span>Tab view 4</span>
    </Tab.TabView>,
    <Tab.TabView title="Tabview 5" key={5}>
      <span>Tab view 5</span>
    </Tab.TabView>,
  ],
  selected: 0,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: [
    <Tab.TabView
      title="Tabview 1"
      key={1}
      icon={<CodeIcon width={24} height={24} fill="currentColor" />}
    >
      <span>Tab view 1</span>
    </Tab.TabView>,
    <Tab.TabView
      title="Tabview 2"
      key={2}
      icon={<HeartIcon width={24} height={24} fill="currentColor" />}
    >
      <span>Tab view 2</span>
    </Tab.TabView>,
  ],
  selected: 0,
};
