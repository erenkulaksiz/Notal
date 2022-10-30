interface BuildComponentTypes {
  name?: string;
  defaultClasses?: string;
  extraClasses?: string;
  conditionalClasses?: Array<{
    [key: string]: string | boolean | number | undefined;
  }>;
  selectedClasses?: Array<string | boolean | undefined>;
}

export function BuildComponent({
  name = "Default Component", // The component name we are going to built. eg: 'Button' - string
  defaultClasses, // Default classes the component will recieve. 'bg-white' - string
  extraClasses, // Extra classes that component recieve, e.g. button but blue - string
  conditionalClasses, // The classes that component potentially recieve - array[object]
  selectedClasses, // The selected classes that component has - array[string]
}: BuildComponentTypes) {
  let allClasses = ""; // set initial data. eg: 'bg-white'
  if (defaultClasses) allClasses += defaultClasses;
  if (extraClasses)
    allClasses += defaultClasses ? ` ${extraClasses}` : extraClasses; // add extra classes to the default classes
  if (conditionalClasses) {
    // if we have conditional classes, we will have selected classes too.
    if (selectedClasses) {
      selectedClasses.forEach(
        (selectedClass: string | boolean | undefined, index: number) => {
          if (typeof conditionalClasses[index] != "undefined") {
            // if the selected class is in the conditional classes
            const selectedObj = conditionalClasses[index];
            if (typeof selectedClass != "undefined") {
              if (selectedObj[selectedClass.toString()]) {
                // if the selected class has a value, add it to the all classes
                allClasses += ` ${
                  conditionalClasses[index][selectedClass.toString()]
                }`;
              } else {
                if (conditionalClasses[index]["default"]) {
                  // if the selected class has no value, add the default value to the all classes
                  allClasses += ` ${conditionalClasses[index]["default"]}`;
                }
              }
            }
          }
        }
      );
    }
  }

  return {
    name,
    classes: allClasses,
  };
}
