const FieldCardIndicator = ({ cardCount }) => {
    if (!cardCount || cardCount == 0) {
        return <div />
    }

    return (<div className="flex items-center justify-center w-8 h-8 p-2 text-lg font-bold bg-white dark:bg-neutral-800 border-2 dark:border-neutral-800 rounded-lg">
        {cardCount}
    </div>)
}

export default FieldCardIndicator;