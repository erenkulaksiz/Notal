import { UserIcon, ShareIcon, PeopleIcon, TaskIcon } from "@icons";

export const Features = [
  {
    title: "Create Tasks",
    desc: "Create tasks and assign them to your team members.",
    icon: (
      <TaskIcon
        size={20}
        fill="currentColor"
        style={{ transform: "scale(.8)" }}
      />
    ),
  },
  {
    title: "Personalize",
    desc: "You can customize your profile how you'd like, change your bio, add social links and more.",
    icon: (
      <UserIcon
        size={20}
        fill="currentColor"
        style={{ transform: "scale(.8)" }}
      />
    ),
  },
  {
    title: "Share",
    desc: "You can share your bookmarks and workspaces with a link, you can also set their visibility to private.",
    icon: (
      <ShareIcon
        size={20}
        fill="currentColor"
        style={{ transform: "scale(.8)" }}
      />
    ),
  },
  {
    title: "Create Teams",
    desc: "You can invite whoever you want to your team. You can create bookmarks & workspaces inside teams and work together with your teammates!",
    icon: (
      <PeopleIcon
        size={20}
        fill="currentColor"
        style={{ transform: "scale(.8)" }}
      />
    ),
  },
];
