import { Button } from "@components";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const AcceptCookies = ({ className }) => {
    if (Cookies.get('cookies') == "true") return null;

    const router = useRouter();

    const onAccept = () => {
        Cookies.set('cookies', 'true');
        router.replace(router.asPath);
    }

    return (<div className="fixed bottom-4 left-4 flex flex-col items-start w-64 bg-neutral-900 p-4 rounded-xl drop-shadow-2xl" style={{ zIndex: 500 }}>
        <span>
            We use cookies to authenticate, analyze traffic and show personalized content. By clicking "Accept Cookies" or continuing using this website you accept our use of cookies.
        </span>
        <Button fullWidth className="mt-2" onClick={onAccept}>
            Accept Cookies
        </Button>
    </div>)
}

export default AcceptCookies;