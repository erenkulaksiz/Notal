interface allClassTypes {
  defaultClasses: string;
  extraClasses: string;
  conditions: boolean[] | string[];
}

export function allClass({
  defaultClasses,
  extraClasses,
  conditions,
}: allClassTypes) {
  const allClasses = defaultClasses.split(" ");
  if (extraClasses) {
    allClasses.push(...extraClasses.split(" "));
  }
  const newClass = allClasses.filter(Boolean);
  return [...newClass, conditions.join(" ")].join(" ");
}
