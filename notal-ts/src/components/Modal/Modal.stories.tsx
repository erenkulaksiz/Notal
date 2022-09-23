import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button, Input, Modal } from "@components";
import { EmailIcon, LoginIcon, PasswordIcon } from "@icons";

export default {
  title: "Interactive/Modal",
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => {
  const [visible, setVisible] = useState(true);

  return (
    <>
      {args.blur && (
        <img
          src="/helios_logo.png"
          className="absolute w-full h-full top-0 left-0 right-0 bottom-0 object-contain"
          alt="Helios logo"
        />
      )}
      <Button onClick={() => setVisible(true)} className="shadow-xl">
        Open Modal
      </Button>
      <Modal
        {...args}
        open={visible}
        onClose={() => setVisible(false)}
        className="w-[90%] sm:w-[440px]"
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <Modal.Title className="font-bold text-xl">Modal.Title</Modal.Title>
      <Modal.Body className="px-4">Modal.Body</Modal.Body>
      <Modal.Footer className="p-4">Modal.Footer</Modal.Footer>
    </>
  ),
};

export const AnimatedComponents = Template.bind({});
AnimatedComponents.args = {
  children: (
    <>
      <Modal.Title animate className="font-bold text-xl">
        Modal.Title
      </Modal.Title>
      <Modal.Body animate className="px-4">
        Modal.Body
      </Modal.Body>
      <Modal.Footer animate className="p-4">
        Modal.Footer
      </Modal.Footer>
    </>
  ),
};

export const AnimatedForm = Template.bind({});
AnimatedForm.args = {
  children: (
    <>
      <form
        className="flex flex-1 flex-col"
        onSubmit={(e) => e.preventDefault()}
      >
        <Modal.Title
          animate
          className="font-bold text-xl mt-4 text-black dark:text-white"
        >
          Login
        </Modal.Title>
        <Modal.Body animate className="px-4 mt-4">
          <Input
            onChange={() => {}}
            fullWidth
            height="h-10"
            id="email"
            type="email"
            placeholder="E-mail"
            icon={<EmailIcon size={24} className="fill-neutral-500/40" />}
          />
          <Input
            onChange={() => {}}
            fullWidth
            height="h-10"
            id="password"
            placeholder="Password"
            type="password"
            containerClassName="mt-2"
            icon={<PasswordIcon size={24} className="fill-neutral-500/40" />}
            password
            passwordVisibility
          />
        </Modal.Body>
        <Modal.Footer animate className="p-4 justify-between items-center">
          <a href="#" className="text-blue-600">
            forgot password?
          </a>
          <Button className="w-32" type="submit">
            <LoginIcon size={24} className="fill-white scale-75" />
            <span>Login</span>
          </Button>
        </Modal.Footer>
      </form>
    </>
  ),
};

export const BlurBackground = Template.bind({});
BlurBackground.args = {
  blur: true,
  children: (
    <>
      <Modal.Title animate className="font-bold text-xl">
        Modal.Title
      </Modal.Title>
      <Modal.Body animate className="px-4">
        Modal.Body
      </Modal.Body>
      <Modal.Footer animate className="p-4">
        Modal.Footer
      </Modal.Footer>
    </>
  ),
};
