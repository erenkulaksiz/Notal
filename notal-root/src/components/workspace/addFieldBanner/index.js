import { EmptyImage } from "@icons";
import Image from "next/image";

const WorkspaceAddFieldBanner = () => {
    return (<div className="w-full p-2 flex justify-center items-center flex-col">
        <Image src={EmptyImage} style={{ zIndex: 90 }} width={148} height={148} placeholder="blur" objectFit="contain" priority alt="Add workspace banner" />
        <h2 className="mt-2 text-xl font-medium text-center">Empty Workspace</h2>
        <h3 className="mt-2 text-sm text-center">{"Click 'Add Card' bottom on right bottom to get started."}</h3>
    </div>)
}

export default WorkspaceAddFieldBanner;