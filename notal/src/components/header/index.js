import styles from './Header.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import UserIcon from '../../../public/icons/user.svg';
import AddIcon from '../../../public/icons/add.svg';
import BackIcon from '../../../public/icons/back.svg';

import Button from '../../components/button';

const Header = ({ menuToggle, onMenuToggle, userData, onLogout, onCreate, onProfile, avatarURL, showBackButton, onBack, showCreate }) => {

    return (<div className={styles.container} >
        <div className={styles.container__left}>
            {showBackButton ? <Button
                text="Dashboard"
                onClick={() => onBack()}
                className={styles.back}
                icon={<BackIcon height={24} width={24} fill={"#19181e"} />}
                reversed
            /> : <>yes, made by eren.</>}
        </div>
        <div className={styles.container__middle}>
            <Link href="#">
                <a>
                    <img
                        src={"./icon_white.png"}
                        alt="Logo of Notal"
                        width={140}
                        height={45}
                    />
                </a>
            </Link>
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
            <div className={menuToggle ? styles.nav__toggle : styles.nav} onBlur={() => onMenuToggle(false)}>
                <div className={styles.navContainer}>
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
                </div>
                <Button
                    text="Profile"
                    //onFocus={() => onLogout()}
                    onClick={() => onProfile()}
                    style={{ height: 48 }}
                    reversed
                />
                <Button
                    text="Logout"
                    //onFocus={() => onLogout()}
                    onClick={() => onLogout()}
                    style={{ height: 48 }}
                    reversed
                />
            </div>
        </div>
    </div >)
}

export default Header;