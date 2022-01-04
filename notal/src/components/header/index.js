import styles from './Header.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { server } from '../../config';

import UserIcon from '../../../public/icons/user.svg';
import AddIcon from '../../../public/icons/add.svg';
import BackIcon from '../../../public/icons/back.svg';

import Button from '../../components/button';
import { route } from 'next/dist/server/router';

const Header = ({ menuToggle, onMenuToggle, userData, onLogout, onCreate, onProfile, avatarURL, showBackButton, onBack, showCreate, loggedIn = true, onLogin, onHeaderHome, profileVisible = true }) => {

    return (<div className={styles.container} >
        <div className={styles.container__left}>
            {showBackButton ? <Button
                text="Back"
                onClick={() => onBack()}
                className={styles.back}
                icon={<BackIcon height={24} width={24} fill={"#19181e"} />}
                reversed
            /> : <></>}
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
        <div className={styles.container__right} >
            <button onClick={() => onMenuToggle(!menuToggle)} className={styles.navButton}>
                <UserIcon height={24} width={24} fill={"#19181e"} />
            </button>
            {
                showCreate && <Button
                    text="Create"
                    onClick={() => onCreate()}
                    style={{ width: 120, height: "60%", marginRight: 16 }}
                    icon={<AddIcon height={24} width={24} fill={"#19181e"} />}
                    reversed
                />
            }
            <div className={menuToggle ? styles.nav__toggle : styles.nav} style={{ height: loggedIn ? 160 : 60, bottom: loggedIn ? -180 : -80 }} onBlur={() => onMenuToggle(false)}>
                {loggedIn && <div className={styles.navContainer}>
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
                </div>}
                {loggedIn ? <>
                    {profileVisible && <Button
                        text="Profile"
                        //onFocus={() => onLogout()}
                        onClick={() => onProfile()}
                        style={{ height: 48 }}
                        reversed
                    />}
                    <Button
                        text="Logout"
                        //onFocus={() => onLogout()}
                        onClick={() => onLogout()}
                        style={{ height: 48 }}
                        reversed
                    />
                </> : <> <Button
                    text="Sign in"
                    //onFocus={() => onLogout()}
                    onClick={() => onLogin()}
                    style={{ height: 48 }}
                    reversed
                />
                </>}
            </div>
        </div>
    </div >)
}

export default Header;