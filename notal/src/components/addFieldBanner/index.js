import { Text, } from '@nextui-org/react';
import Image from "next/image";

import addfieldimg from '../../../public/addfieldbanner.png';

const AddFieldBanner = ({ isOwner }) => {
    return (<>
        <div className="add-field-container">
            <Image src={addfieldimg} style={{ zIndex: 50 }} width={300} height={300} placeholder="blur" objectFit='contain' priority={true} />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Text h2>{isOwner ? "Your" : "This"} workspace is empty.</Text>
                {isOwner && <Text css={{ color: "$accents6" }}>Add a field to get started.</Text>}
            </div>
        </div>
        <style jsx>{`
        .add-field-container{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: absolute;
            width: 100%;
            height: calc(100vh - 300px);
        }
    `}</style>
    </>)
}

export default AddFieldBanner;