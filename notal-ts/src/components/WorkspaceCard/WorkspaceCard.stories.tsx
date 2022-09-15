import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { HomeWorkspaceCard } from "./WorkspaceCard";

export default {
  title: "Interactive/Home/WorkspaceCard",
  component: HomeWorkspaceCard,
} as ComponentMeta<typeof HomeWorkspaceCard>;

const Template: ComponentStory<typeof HomeWorkspaceCard> = (args) => (
  <HomeWorkspaceCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  workspace: {
    title: "Workspace Title",
    _id: "workspace",
    id: "workspace",
    createdAt: 1,
    starred: false,
    updatedAt: 1,
    thumbnail: {
      type: "singleColor",
      color: "blue",
    },
    workspaceVisible: false,
  },
};
Default.parameters = {
  layout: "none",
};

export const SkeletonLoader = Template.bind({});
SkeletonLoader.args = {
  workspace: {
    title: "Workspace Title",
    _id: "workspace",
    id: "workspace",
    createdAt: 1,
    starred: false,
    updatedAt: 1,
    thumbnail: {
      type: "singleColor",
      color: "blue",
    },
    workspaceVisible: false,
  },
  skeleton: true,
};
SkeletonLoader.parameters = {
  layout: "none",
};
