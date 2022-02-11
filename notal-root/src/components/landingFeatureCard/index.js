
const LandingFeatureCard = ({ feature }) => {
    return (<div
        className="backdrop-blur dark:bg-white/5 bg-white/25 dark:text-white text-black p-4 py-3 flex-col rounded-xl"
    >
        <div className="flex flex-row pb-2">
            <div className="p-2 backdrop-blur self-start rounded-full mr-2">
                {feature.icon}
            </div>
            <h2 className="text-xl font-bold text-black dark:text-white flex items-center">
                {feature.title}
            </h2>
        </div>
        <span className="text-white mt-12 text-current">{feature.desc}</span>
    </div>)
}

export default LandingFeatureCard;