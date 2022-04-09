/**
* BuildComponent function makes it easy to build classes for custom components.
* @param {string} name - Name of the component.
* @param {string} defaultClasses - Default classes for the component.
* @param {string} extraClasses - Extra classes for the component.
* @param {array} conditionalClasses - Array of objects, which is conditional classes for the component.
* @param {array} selectedClasses - Array of strings, which is selected classes for the component.
* @returns {object} data - Object with the following properties:
* @returns {string} data.name - Name of the component.
* @returns {string} data.classes - Classes for the component.
*/
const BuildComponent = ({
    name = "Default Component", // The component name we are going to built. eg: 'Button' - string
    defaultClasses, // Default classes the component will recieve. 'bg-white' - string
    extraClasses, // Extra classes that component recieve, e.g. button but blue - string
    conditionalClasses = [], // The classes that component potentially recieve - array[object]
    selectedClasses = [] // The selected classes that component has - array[string]
}) => {
    let allClasses = defaultClasses; // set initial data. eg: 'bg-white'
    if (extraClasses) allClasses += ` ${extraClasses}`; // add extra classes to the default classes
    if (conditionalClasses.length > 0) {
        // if we have conditional classes, we will have selected classes too.
        selectedClasses.forEach((selectedClass, index) => {
            if (conditionalClasses[index]) {
                // if the selected class is in the conditional classes
                if (conditionalClasses[index][selectedClass]) {
                    // if the selected class has a value, add it to the all classes
                    allClasses += ` ${conditionalClasses[index][selectedClass]}`;
                } else {
                    if (conditionalClasses[index].default) {
                        // if the selected class has no value, add the default value to the all classes
                        allClasses += ` ${conditionalClasses[index].default}`;
                    }
                }
            }
        });
    }

    return {
        name,
        classes: allClasses,
    }
}

export default BuildComponent;

/**
const BuildButton = BuildComponent({
    name: "Button",
    defaultClasses: "cursor-pointer z-10 overflow-hidden hover:opacity-80 active:opacity-80 flex flex-row items-center p-4 py-2 relative active:scale-95 transition-all duration-75 text-white font-semibold text-sm",
    extraClasses: className,
    conditionalClasses: [
        {
            false: "w-auto",
            true: "w-full"
        },
        {
            default: rounded,
            false: "rounded-xl",
            true: "rounded-full"
        },
        {
            true: "bg-gradient-to-r from-sky-600 to-violet-700"
        },
        {
            default: size,
            sm: "h-8",
            lg: "h-12",
            xl: "h-16",
        },
        {
            default: light,
            false: "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 outline-none focus:outline-blue-500/50",//also remove ring
            true: "bg-transparent hover:bg-transparent active:dark:bg-neutral-800/50 active:bg-neutral-200/50"
        },
        {
            default: "focus:outline-2 " + ring,
            true: "focus:outline-2",
        }
    ],
    selectedClasses: [
        fullWidth,
        rounded,
        gradient,
        size,
        light,
        ring,
    ]
});
*/