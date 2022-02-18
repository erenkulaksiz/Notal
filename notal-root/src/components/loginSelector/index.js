import { motion } from 'framer-motion';
import { Button } from '@components';

import {
    EmailIcon,
    GithubIcon,
    GoogleIcon
} from '@icons';

const buttonVariants = {
    hidden: {
        y: -15,
        transition: {
            type: "spring", stiffness: 800, damping: 35, duration: 25
        }
    },
    show: {
        y: 0,
        transition: {
            type: "spring", stiffness: 800, damping: 35, duration: 25
        }
    }
}

const LoginSelector = ({ onLoginWithEmail, onLoginWithGithub, onLoginWithGoogle, oauthError }) => {
    return (<motion.div initial="hidden" animate="show" variants={{
        hidden: {
            transition: {
                staggerChildren: 0.1
            }
        },
        show: {
            transition: {
                staggerChildren: 0.1
            }
        }
    }}
        className="w-full grid gap-2">
        <motion.div variants={buttonVariants}>
            <Button onClick={onLoginWithGithub} size="lg" className="w-full text-xl" gradient icon={<GithubIcon size={24} fill="currentColor" />}>
                Github
            </Button>
        </motion.div>
        <motion.div variants={buttonVariants}>
            <Button onClick={onLoginWithGoogle} size="lg" className="w-full text-xl" gradient icon={<GoogleIcon width={24} height={24} fill="currentColor" />}>
                Google
            </Button>
        </motion.div>
        {/*<Button size="lg" className="w-full" gradient>
            Email
        </Button>*/}
        {oauthError && <span>{oauthError}</span>}
    </motion.div>)
}

export default LoginSelector;