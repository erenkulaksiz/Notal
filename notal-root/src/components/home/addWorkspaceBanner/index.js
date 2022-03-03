import { EmptyImage } from "@icons";
import Image from "next/image";

const AddWorkspaceBanner = () => {
    return <div className="min-h-[400px] absolute left-0 right-0 bottom-0 top-0 pb-48 flex flex-col justify-center items-center">
        <Image src={EmptyImage} style={{ zIndex: 90 }} width={148} height={148} placeholder="blur" objectFit="contain" priority alt="Add workspace banner" />
        <h2 className="mt-2 text-xl font-medium text-center">You have no workspaces</h2>
        <h3 className="mt-2 text-sm text-center">{"Click 'Add Workspace' button to get started."}</h3>
    </div>
}

export default AddWorkspaceBanner;