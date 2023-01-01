export interface CardColorTypes {
  type: string;
  name: string;
  code: string;
  showName: string;
}

export const CardColors = [
  {
    type: "color",
    name: "Red",
    code: "#a30b0b",
    showName: "Red",
  },
  {
    type: "color",
    name: "Green",
    code: "#10AC63",
    showName: "Green",
  },
  {
    type: "color",
    name: "Blue",
    code: "#0070F3",
    showName: "Blue",
  },
  {
    type: "color",
    name: "Yellow",
    code: "#D28519",
    showName: "Yellow",
  },
  {
    type: "color",
    name: "Purple",
    code: "#8B00FF",
    showName: "Purple",
  },
  {
    type: "color",
    name: "Pink",
    code: "#FF0080",
    showName: "Pink",
  },
  {
    type: "color",
    name: "Orange",
    code: "#FF8C00",
    showName: "Orange",
  },
] as Array<CardColorTypes>;
