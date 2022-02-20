import { Button } from '@components';

import {
    EmailIcon,
    GithubIcon,
    GoogleIcon
} from '@icons';

const LoginSelector = ({ onLoginWithEmail, onLoginWithGithub, onLoginWithGoogle, oauthError }) => {
    return (<div className="w-full grid gap-2">
        <Button onClick={onLoginWithGithub} size="lg" className="w-full text-xl" gradient icon={<GithubIcon size={24} fill="currentColor" />}>
            Github
        </Button>
        <Button onClick={onLoginWithGoogle} size="lg" className="w-full text-xl" gradient icon={<GoogleIcon width={24} height={24} fill="currentColor" />}>
            Google
        </Button>
        {/*<Button size="lg" className="w-full" gradient>
            Email
        </Button>*/}
        {oauthError && <span>{oauthError}</span>}
    </div>)
}

export default LoginSelector;