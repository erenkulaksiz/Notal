import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { HomeWorkspaceCard } from "@components";

export default {
  title: "Interactive/Home/WorkspaceCard",
  component: HomeWorkspaceCard,
} as ComponentMeta<typeof HomeWorkspaceCard>;

const Template: ComponentStory<typeof HomeWorkspaceCard> = (args) => (
  <div className="w-[600px] h-[400px] relative flex items-center justify-center border-neutral-400 border-2">
    <span className="absolute top-2 left-2 text-neutral-400 font-medium">
      600x400
    </span>
    <HomeWorkspaceCard {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  workspace: {
    title: "Workspace title ajdsfj",
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

export const SkeletonLoader = Template.bind({});
SkeletonLoader.args = {
  workspace: {
    title: "Workspace",
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
