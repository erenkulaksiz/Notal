
export const allClass = ({ defaultClasses, extraClasses, conditions = [] }) => {
    const allClasses = defaultClasses.split(" ");
    if (extraClasses) {
        allClasses.push(...extraClasses.split(" "));
    }
    const newClass = allClasses.filter(Boolean);
    const newConditions = conditions.filter(Boolean);
    return [...newClass, newConditions.join(" ")].join(" ");
}

export const conditionalClass = ({ keys, selected }) => {
    if (keys[selected]) {
        return keys[selected];
    } else {
        if (keys.default) {
            return keys.default;
        } else {
            return "";
        }
    }
}