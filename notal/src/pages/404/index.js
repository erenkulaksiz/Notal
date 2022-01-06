import { useRouter } from 'next/router';
import Button from '../../components/button';

import BackIcon from '../../../public/icons/back.svg';
import HomeFilledIcon from '../../../public/icons/home_filled.svg';

const Page404 = () => {
    const router = useRouter();

    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>

        <h1 style={{ marginBottom: 24, fontSize: "4em", fontWeight: "600", textAlign: "center" }}>[404]</h1>
        <div style={{ fontSize: "1.8em", fontWeight: "600", textAlign: "center" }}>
            We couldn't find the page you were looking for.
        </div>
        <Button
            text="Home"
            onClick={() => router.replace("/")}
            style={{ height: 54, borderRadius: 8, width: 380, marginTop: 24 }}
            icon={<HomeFilledIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
        />
        <Button
            text="Back"
            onClick={() => router.back()}
            style={{ height: 54, borderRadius: 8, width: 380, marginTop: 12 }}
            icon={<BackIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
        />
    </div>
}

export default Page404;