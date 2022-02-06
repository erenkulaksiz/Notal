import { Text, } from '@nextui-org/react';
import styled from "styled-components";
import Image from "next/image";

import addfieldimg from '../../../public/addfieldbanner.png';

const StyledBanner = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: calc(100vh - 300px);
`;

const AddFieldBanner = ({ isOwner }) => {
    return (<StyledBanner>
        <Image src={addfieldimg} style={{ zIndex: 50 }} width={300} height={300} placeholder="blur" objectFit='contain' priority={true} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Text h2>{isOwner ? "Your" : "This"} workspace is empty.</Text>
            {isOwner && <Text css={{ color: "$accents6" }}>Add a field to get started.</Text>}
        </div>
    </StyledBanner>)
}

export default AddFieldBanner;