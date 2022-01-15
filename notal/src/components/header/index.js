import styles from './Header.module.scss';

import { server } from '../../config';

import UserIcon from '../../../public/icons/user.svg';
import LogoutIcon from '../../../public/icons/logout.svg';
import LoginIcon from '../../../public/icons/login.svg';
import DarkIcon from '../../../public/icons/dark.svg';
import LightIcon from '../../../public/icons/light.svg';

import Button from '../../components/button';
import useTheme from '../../hooks/theme';

const Header = ({ menuToggle, onMenuToggle, leftContainer, userData, onLogout, onProfile, avatarURL, showBackButton, loggedIn = false, onLogin, onHeaderHome, onThemeChange, currTheme }) => {

    return (<div className={styles.container} >
        <div className={styles.container__left}>
            {leftContainer}
        </div>
        <div className={styles.container__middle}>
            <a onClick={() => onHeaderHome()}>
                <img
                    src={`${server}/icon_white.png`}
                    alt="Logo of Notal"
                    width={140}
                    height={45}
                />
            </a>
        </div>
        <div className={styles.container__right}>
            <button onClick={() => onMenuToggle(!menuToggle)} className={styles.navButton}>
                <UserIcon height={24} width={24} />
            </button>
            {<div className={menuToggle ? styles.nav : styles.nav__hidden}>
                {loggedIn ? <div className={styles.navContainer}>
                    <div className={styles.user}>
                        <img
                            src={avatarURL}
                            alt="Avatar"
                            width={44}
                            height={44}
                        />
                    </div>
                    <div>
                        <div className={styles.navUser} style={{ fontSize: "1.2em", fontWeight: 600 }}>
                            {userData.fullname || ""}
                        </div>
                        <div className={styles.navUser}>
                            {userData.email || ""}
                        </div>
                    </div>
                    <div className={styles.themeChanger}>
                        <button onClick={() => onThemeChange()}>
                            {currTheme == "theme-dark" ? <LightIcon height={16} width={16} className={styles.themeIcon} /> : <DarkIcon height={16} width={16} className={styles.themeIcon} />}
                        </button>
                    </div>
                </div> : <div className={styles.navContainer}>
                    <div className={styles.themeChanger}>
                        <button onClick={() => onThemeChange()}>
                            {currTheme == "theme-dark" ? <LightIcon height={16} width={16} className={styles.themeIcon} /> : <DarkIcon height={16} width={16} className={styles.themeIcon} />}
                        </button>
                    </div>
                </div>}
                {loggedIn ? <>
                    <Button
                        text="Profile"
                        //onFocus={() => onLogout()}
                        onClick={() => onProfile()}
                        icon={<UserIcon height={24} width={24} style={{ marginRight: 8 }} />}
                        style={{ height: 48, borderStyle: "none" }}
                        reversed
                    />
                    <Button
                        text="Sign Out"
                        //onFocus={() => onLogout()}
                        onClick={() => onLogout()}
                        icon={<LogoutIcon height={24} width={24} fill={"#19181e"} style={{ marginRight: 8 }} />}
                        style={{ height: 48, borderStyle: "none", marginTop: 8 }}
                        reversed
                    />
                </> : <> <Button
                    text="Sign in"
                    //onFocus={() => onLogout()}
                    onClick={() => onLogin()}
                    style={{ height: 48, borderStyle: "none" }}
                    icon={<LoginIcon height={24} width={24} fill={"#19181e"} style={{ marginRight: 8 }} />}
                    reversed
                />
                </>}
            </div>}
        </div>
    </div>)
}

export default Header;