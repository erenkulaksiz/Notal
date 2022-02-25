
const Select = ({ options, onChange, value, selectedIndex = 0 }) => {
    return (<select
        onChange={onChange}
        value={value}
        class="outline-none focus:outline-2 focus:outline-blue-500/50 border-2 border-solid border-neutral-300 dark:border-neutral-800 appearance-none flex w-full px-3 py-1.5 text-base font-normal text-gray-700 dark:text-white bg-white dark:bg-neutral-900 bg-clip-padding bg-no-repeat rounded-xl transition ease-in-out m-0focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">
        {options && options.map((element, index) => <option
            key={index}
            selected={selectedIndex == index}
            value={element.id}
        >
            {element.text}
        </option>)}
    </select>)
}

export default Select;