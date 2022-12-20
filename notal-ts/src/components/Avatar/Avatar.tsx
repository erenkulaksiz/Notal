import { BuildComponent } from "@utils/style";

import type { AvatarProps } from "./Avatar.d";

export function Avatar({ size, src }: AvatarProps) {
  const BuildAvatar = BuildComponent({
    name: "Avatar",
    defaultClasses: "rounded-full object-contain",
    conditionalClasses: [
      {
        xs: "w-2 h-2",
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5",
        xl: "w-6 h-6",
      },
    ],
    selectedClasses: [size],
  });

  return <img src={src} className={BuildAvatar.classes} />;
}
