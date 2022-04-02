/**
 *  BuildComponent function makes it easy to build classes.
 *  Similar to clsx or classnames packages.
 *  
 *  Refactor: Use string instead of array, like str += "classname"
 * 
    const BuildButton = BuildComponent({
        name: "Button",
        defaultClasses: "z-10 hover:opacity-80 active:opacity-100 flex flex-row items-center p-4 py-2 relative active:scale-95 transition-all duration-75 text-white font-semibold text-sm",
        extraClasses: className,
        conditionalClasses: [
            {
                default: "w-auto",
                fullWidth: "w-full"
            },
            {
                default: "rounded-xl",
                rounded: "rounded-full"
            },
            {
                gradient: "bg-gradient-to-r from-sky-600 to-violet-700"
            },
            {
                sm: "h-8",
                lg: "h-12",
                xl: "h-16",
            },
            {
                ring: "outline-none focus:outline-2 focus:outline-blue-500/50"
            },
            {
                default: "bg-blue-600 hover:bg-blue-500 active:bg-blue-700",
                light: "bg-transparent hover:bg-transparent active:bg-gray-800/50"
            }
        ],
        selectedClasses: [
            fullWidth && "fullWidth",
            rounded && "rounded",
            gradient && "gradient",
            size,
            !light && "ring", // if not 'light' button, have a ring
            light && "light",
        ]
    });
 */
const BuildComponent = ({
    name = "Default Component", // The component name we are going to built. eg: 'Button' - string
    defaultClasses, // Default classes the component will recieve. 'bg-white' - string
    extraClasses, // Extra classes that component recieve, e.g. button but blue - string
    conditionalClasses = [], // The classes that component potentially recieve - array[object]
    selectedClasses = [] // The selected classes that component has - array[string]
}) => {
    const allClasses = defaultClasses.split(" ");
    if (extraClasses) {
        allClasses.push(...extraClasses.split(" "));
    }
    // Classes without conditionals.
    const builtClass = [...allClasses.filter(Boolean)];

    if (conditionalClasses.length != 0) {
        selectedClasses.map((element, index) => {
            if (conditionalClasses[index][element]) {
                builtClass.push(conditionalClasses[index][element]);
            } else {
                if (conditionalClasses[index].default) {
                    builtClass.push(conditionalClasses[index].default);
                }
            }
        });
    }

    // Built all classes with conditionals, now convert to string
    const classes = builtClass.join(' ');

    return {
        name,
        classes,
    }
}

export default BuildComponent;