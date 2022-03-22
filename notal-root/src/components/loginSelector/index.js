import { Button } from '@components';

import {
    EmailIcon,
    GithubIcon,
    GoogleIcon
} from '@icons';

const LoginSelector = ({ onLoginWithEmail, onLoginWithGithub, onLoginWithGoogle, oauthError }) => {
    return (<div className="w-full grid gap-2">
        <Button
            onClick={onLoginWithGithub}
            size="lg"
            className="w-full text-[1.2em]"
            gradient
            icon={<GithubIcon size={24} fill="currentColor" />}
            aria-label="Sign in with GitHub button"
        >
            GitHub
        </Button>
        <Button
            onClick={onLoginWithGoogle}
            size="lg"
            className="w-full text-[1.2em]"
            gradient
            icon={<GoogleIcon width={24} height={24} fill="currentColor" />} aria-label="Sign in with Google button"
        >
            Google
        </Button>
        {/*<Button size="lg" className="w-full" gradient>
            Email
        </Button>*/}
        {oauthError && <span className="text-red-400 text-center mt-2">{oauthError}</span>}
    </div>)
}

export default LoginSelector;