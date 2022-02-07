import { useState } from "react";
import useAuth from "../../../hooks/auth";
import { Button, Text, Grid, Row, Modal, Spacer, Card } from '@nextui-org/react';

import AuthService from '../../../service/AuthService';

import {
    LoginSelector,
    EmailLogin,
    ForgotPassword,
} from '../../';

import {
    CheckOutlineIcon,
    BackIcon
} from '../../../icons';

const LoginModal = ({ visible, onLoginSuccess, onClose }) => {
    const auth = useAuth();

    const close = () => {
        setModalError({ login: false, email: false, password: false });
        setModalView("");
        setOauthError("");
        setForgotError("");
        onClose();
    }

    const [modalError, setModalError] = useState({ login: false, email: false, password: false });
    const [modalView, setModalView] = useState("");
    const [oauthError, setOauthError] = useState("");
    const [forgotError, setForgotError] = useState("");

    const onLoginWithGoogle = async () => {
        const login = await auth.login.google();
        if (login?.authError?.errorCode == "auth/account-exists-with-different-credential") {
            setOauthError(`This account exist with different credential. Please try another method.`);
            return;
        }
        onLoginSuccess();
    }

    const onLoginWithGithub = async () => {
        const login = await auth.login.github();
        if (login?.authError?.errorCode == "auth/account-exists-with-different-credential") {
            setOauthError(`This account exist with different credential. Please try another method.`);
            return;
        }
        onLoginSuccess();
    }

    const onLogin = async ({ email, password }) => {
        const login = await auth.login.password({ email, password });

        if (login?.authError?.errorCode == "auth/user-not-found" || login?.authError?.errorCode == "auth/wrong-password") {
            setModalError({ ...modalError, login: "This email and password combination is incorrect.", password: false, email: false });
            return;
        } else {
            setModalError({ ...modalError, login: false });
        }
        onLoginSuccess();
    }

    const onForgotPassword = async ({ email }) => {
        const sendLink = await AuthService.sendPasswordResetLink({ email });
        if (sendLink?.error) {
            if (sendLink?.error?.code == "auth/user-not-found") {
                setForgotError("Cannot find a user with this email.");
                return;
            }
        }
        if (sendLink.success) {
            setModalView("sentEmail");
        }
    }

    return (<Modal
        closeButton
        aria-labelledby="login-modal"
        open={visible}
        onClose={close}
    >
        <Modal.Body css={{ pb: 0 }}>
            <Grid.Container gap={1}>
                {!modalView && <LoginSelector
                    onLoginWithEmail={() => setModalView("email")} // Login with email
                    onLoginWithGithub={onLoginWithGithub}
                    onLoginWithGoogle={onLoginWithGoogle}
                    oauthError={oauthError}
                />}
                {modalView == "email" && <EmailLogin
                    onBack={() => {
                        setModalView(null);
                        setModalError({ ...modalError, login: false, email: false, password: false });
                    }}
                    onLogin={onLogin}
                    setError={setModalError}
                    error={modalError}
                    onForgot={() => {
                        setModalView("forgot");
                        setForgotError("");
                    }}
                />}
                {modalView == "forgot" && <ForgotPassword
                    onForgotPassword={({ email }) => onForgotPassword({ email })}
                    onBack={() => {
                        setModalView("email");
                        setModalError({ ...modalError, login: false, email: false, password: false });
                    }}
                    setForgotError={setForgotError}
                    forgotError={forgotError}
                />}
                {modalView == "sentEmail" && <>
                    <Row css={{ mt: 6 }}>
                        <Button onClick={() => setModalView("email")}
                            icon={<BackIcon height={24} width={24} style={{ fill: "currentColor" }} />}>
                            Back
                        </Button>
                    </Row>
                    <Spacer y={1} />
                    <Card css={{ bg: "$gradient" }}>
                        <Grid.Container gap={2}>
                            <Grid xs={12} justify='center'>
                                <CheckOutlineIcon height={24} width={24} style={{ fill: "white", transform: "scale(2)" }} />
                            </Grid>
                            <Grid xs={12} justify='center' alignItems='center' css={{ textAlign: "center" }}>
                                <Text h3>An email has been sent to reset your password.</Text>
                            </Grid>
                        </Grid.Container>
                    </Card>
                </>}
            </Grid.Container>
        </Modal.Body>
        <Modal.Footer css={{ pt: 0 }}>
            <Button auto flat color="error" onClick={close}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default LoginModal;