import { useState, useEffect } from "react";
import { UserIcon, LogoutIcon, DarkIcon, LightIcon } from "@icons";
import { Button, Switch } from "@components";
import { useTheme } from 'next-themes';

const Navbar = ({ user }) => {
    const { resolvedTheme, setTheme } = useTheme();
    const client = (typeof window === 'undefined') ? false : true;

    return (<nav className="p-3 dark:bg-black bg-white flex flex-row sticky top-0 z-40">
        <div className="w-1/2">
            {typeof resolvedTheme != "undefined" && <img
                src={resolvedTheme == "dark" ? "./icon_white.png" : "./icon_galactic.png"}
                className="object-contain max-h-max w-40"
            />}
        </div>
        <div className="w-1/2 flex items-center justify-end">
            <details className="relative inline-block bg-transparent">
                <summary
                    style={{
                        userSelect: "none",
                        listStyle: "none"
                    }}>
                    <div className="p-[2px] w-10 h-10 rounded-full cursor-pointer bg-gradient-to-tr from-blue-700 to-pink-700">
                        <img
                            src="https://firebasestorage.googleapis.com/v0/b/notal-1df19.appspot.com/o/avatars%2FcAoPPPr3BDR9RxUu6NAxb3aryq82?alt=media&token=d4682df3-9944-40b9-a899-435f11beb5ee"
                            className="w-10 h-9 rounded-full border-[2px] dark:border-black border-white"
                        />
                    </div>
                </summary>
                <div className="p-4 absolute top-full rounded-lg right-0 dark:bg-neutral-900/50 filter backdrop-blur-md bg-white/50 shadow-xl w-60 z-50">
                    {client && <Switch
                        onChange={e => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                        value={resolvedTheme == "dark"}
                        className="mb-2"
                        icon={resolvedTheme == "dark" ? <LightIcon size={24} fill="black" style={{ transform: "scale(0.7)" }} /> : <DarkIcon size={24} fill="black" style={{ transform: "scale(0.7)" }} />}
                    />}
                    <h2 className="text-current font-bold text-xl">{user?.fullname ? user?.fullname : "@" + user?.username}</h2>
                    <h4 className="text-current text-md">{user?.email}</h4>
                    <Button className="w-full mt-2" icon={<UserIcon size={24} fill="white" />} gradient>
                        <span>Profile</span>
                    </Button>
                    <Button className="w-full mt-2" icon={<LogoutIcon size={24} fill="white" />} gradient>
                        <span>Sign Out</span>
                    </Button>
                </div>
            </details>
            <style jsx>{`
            details[open] > summary:before {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 1;
                display: block;
                cursor: default;
                content: " ";
            }
        `}</style>
        </div>
    </nav>)
}

export default Navbar;