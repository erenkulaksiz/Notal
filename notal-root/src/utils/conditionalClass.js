
export const allClass = ({ defaultClasses, extraClasses, conditions = [] }) => {
    const classes = `${defaultClasses} ${extraClasses ? extraClasses + " " : ""}${conditions.join(" ")}`;

    return classes;
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