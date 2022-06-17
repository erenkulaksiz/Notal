interface conditionalClassTypes {
  keys: {
    [key: string]: string | undefined;
  };
  selected: string;
}

export function conditionalClass({ keys, selected }: conditionalClassTypes) {
  if (keys[selected]) {
    return keys[selected];
  } else {
    if (keys["default"]) {
      return keys["default"];
    } else {
      return undefined;
    }
  }
}
