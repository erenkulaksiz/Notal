import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DragDropContext } from "@hello-pangea/dnd";

import { Button, AddCardModal } from "@components";

export default {
  title: "Interactive/Modals/AddCardModal",
  component: AddCardModal,
} as ComponentMeta<typeof AddCardModal>;

const Template: ComponentStory<typeof AddCardModal> = (args) => {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <Button onClick={() => setVisible(true)}>Open Modal</Button>
      <DragDropContext onDragEnd={() => {}}>
        <AddCardModal
          open={visible}
          onClose={() => setVisible(false)}
          onAdd={() => setVisible(false)}
        />
      </DragDropContext>
    </>
  );
};

export const Default = Template.bind({});
