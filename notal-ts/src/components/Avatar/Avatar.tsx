import { BuildComponent } from "@utils/style";

import type { AvatarProps } from "./Avatar.d";

export function Avatar({ size, src, alt, className }: AvatarProps) {
  const BuildAvatar = BuildComponent({
    name: "Avatar",
    defaultClasses: "rounded-full object-fit",
    extraClasses: className,
    conditionalClasses: [
      {
        xs: "w-2 h-2",
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5",
        xl: "w-6 h-6",
        "2xl": "w-7 h-7",
        "3xl": "w-8 h-8",
        "4xl": "w-9 h-9",
      },
    ],
    selectedClasses: [size],
  });

  return <img src={src} className={BuildAvatar.classes} alt={alt} />;
}
