import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Toast } from "./Toast";

export default {
  title: "Interactive/Toast",
  component: Toast,
} as ComponentMeta<typeof Toast>;

const Template: ComponentStory<typeof Toast> = (args) => {
  const [rendered, setRendered] = useState(false);

  const toastArgs = args.toast;

  return (
    <Toast
      onRender={() => setRendered(true)}
      toast={{
        ...toastArgs,
        rendered,
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  toast: {
    title: "Default Toast",
    desc: "Description",
  },
};

export const InfoToast = Template.bind({});
InfoToast.args = {
  toast: {
    title: "Info Toast",
    desc: "Description",
    type: "info",
  },
};

export const ErrorToast = Template.bind({});
ErrorToast.args = {
  toast: {
    title: "Error Toast",
    desc: "Description",
    type: "error",
  },
};

export const SuccessToast = Template.bind({});
SuccessToast.args = {
  toast: {
    title: "Success Toast",
    desc: "Description",
    type: "success",
  },
};
