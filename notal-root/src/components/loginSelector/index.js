import { Button } from '@components';

import {
    EmailIcon,
    GithubIcon,
    GoogleIcon
} from '@icons';

const LoginSelector = ({ onLoginWithEmail, onLoginWithGithub, onLoginWithGoogle, oauthError }) => {
    return (<div className="w-full grid gap-2">
        <Button onClick={onLoginWithGithub} size="lg" className="w-full text-xl" gradient icon={<GithubIcon size={24} fill="currentColor" />} aria-label="Sign in with GitHub button">
            Github
        </Button>
        <Button onClick={onLoginWithGoogle} size="lg" className="w-full text-xl" gradient icon={<GoogleIcon width={24} height={24} fill="currentColor" />} aria-label="Sign in with Google button">
            Google
        </Button>
        {/*<Button size="lg" className="w-full" gradient>
            Email
        </Button>*/}
        {oauthError && <span>{oauthError}</span>}
    </div>)
}

export default LoginSelector;