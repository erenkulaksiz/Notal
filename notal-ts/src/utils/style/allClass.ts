interface allClassTypes {
  defaultClasses?: string;
  extraClasses?: string;
  conditions?: Array<string | undefined | boolean>;
}

export function allClass({
  defaultClasses,
  extraClasses,
  conditions,
}: allClassTypes) {
  const allClasses = [];
  if (defaultClasses) allClasses.push(defaultClasses);
  if (extraClasses) {
    allClasses.push(...extraClasses.split(" "));
  }
  const newClass = allClasses.filter(Boolean);
  if (!conditions) return [...newClass].join(" ");
  return [...newClass, conditions.join(" ")].join(" ");
}
