const FieldCardIndicator = ({ count }) => {
    if (!count || count == 0) {
        return <div />
    }

    return (<div className="shadow flex mt-2 ml-2 items-center justify-center w-10 h-10 p-2 text-lg font-bold bg-white dark:bg-neutral-900 rounded-lg">
        {count}
    </div>)
}

export default FieldCardIndicator;