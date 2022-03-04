const FieldCardIndicator = ({ count }) => {
    if (!count || count == 0) {
        return <div />
    }

    return (<div className="shadow flex items-center justify-center w-8 h-8 p-2 text-lg font-bold bg-white dark:bg-neutral-900 rounded-lg">
        {count}
    </div>)
}

export default FieldCardIndicator;