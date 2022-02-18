
const Checkbox = () => {
    return (<div class="flex flex-row">
        <input class="appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckDefault" />
        <label class="inline-block text-gray-800" for="flexCheckDefault">
            Default checkbox
        </label>
    </div>)
}

export default Checkbox;