import { Button } from "@components";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import { CheckIcon } from "@icons";

const AcceptCookies = ({ className }) => {
    const router = useRouter();
    const client = (typeof window === 'undefined') ? false : true;

    if (Cookies.get('cookies') == "true" || !client) return null;

    const onAccept = () => {
        Cookies.set('cookies', 'true');
        setTimeout(() => router.replace(router.asPath), 500);
    }

    return (<div className="fixed bottom-4 left-4 flex flex-col items-start w-64 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md p-4 rounded-xl drop-shadow-2xl" style={{ zIndex: 500 }}>
        <span>
            {"We use cookies to authenticate, analyze traffic and show personalized content. By clicking 'Accept Cookies' or continuing using this website you accept our use of cookies."}
        </span>
        <Button
            fullWidth
            gradient
            icon={<CheckIcon size={24} fill="currentColor" />}
            className="mt-2" onClick={onAccept}
        >
            Accept Cookies
        </Button>
    </div>)
}

export default AcceptCookies;