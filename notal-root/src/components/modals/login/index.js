import { useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

import { Modal, LoginSelector } from "@components";
import useAuth from "@hooks/auth";

import IconWhite from "@public/icon_white.webp";
import IconGalactic from "@public/icon_galactic.webp";

const LoginModal = ({ open, onClose, onLoginSuccess }) => {
    const auth = useAuth();
    const { resolvedTheme } = useTheme();
    const [oauthError, setOauthError] = useState("");

    const onLoginWithGoogle = async () => {
        console.log("trying to login with google");
        const login = await auth.login.google();
        if (login?.authError?.errorCode == "auth/account-exists-with-different-credential") {
            setOauthError(`This account exist with different credential. Please try another method.`);
            return;
        } else if (login?.authError?.errorCode == "auth/user-disabled") {
            setOauthError(`Your account has been disabled. Sorry for the inconvenience.`);
            return;
        }
        onLoginSuccess();
    }

    const onLoginWithGithub = async () => {
        const login = await auth.login.github();
        console.log("github login errors:", login.authError);
        if (login?.authError?.errorCode == "auth/account-exists-with-different-credential") {
            setOauthError(`This account exist with different credential. Please try another method.`);
            return;
        } else if (login?.authError?.errorCode == "auth/user-disabled") {
            setOauthError(`Your account has been disabled. Sorry for the inconvenience.`);
            return;
        }
        onLoginSuccess();
    }

    return (<Modal
        open={open}
        onClose={onClose}
        className="w-[90%] sm:w-[440px]"
        blur
    >
        <Modal.Title animate>
            <div className="w-full flex flex-col justify-center items-center pt-6">
                {typeof resolvedTheme != "undefined" && <div className="w-40 h-8 object-contain">
                    <Image
                        src={resolvedTheme == "dark" ? IconWhite : IconGalactic}
                        alt="Logo of Notal"
                        priority
                        placeholder="blur"
                    />
                </div>}
                <span className="text-2xl font-medium mt-8">Sign up on Notal</span>
            </div>
        </Modal.Title>
        <Modal.Body className="p-4" animate>
            <LoginSelector
                onLoginWithGithub={onLoginWithGithub}
                onLoginWithGoogle={onLoginWithGoogle}
                oauthError={oauthError}
            />
        </Modal.Body>
    </Modal>)
}

export default LoginModal;