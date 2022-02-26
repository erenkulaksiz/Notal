import { useState } from "react";
import { Modal, LoginSelector } from "@components";

import useAuth from "@hooks/auth";
//import AuthService from "@service/AuthService";

const LoginModal = ({ open, onClose, onLoginSuccess }) => {
    const auth = useAuth();
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
        className="w-[90%] sm:w-[400px]"
        blur
    >
        <Modal.Title animate>
            <span className="text-2xl font-bold">Sign up/in using...</span>
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