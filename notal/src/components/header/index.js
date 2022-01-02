import styles from './Header.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import UserIcon from '../../../public/icons/user.svg';
import AddIcon from '../../../public/icons/add.svg';
import BackIcon from '../../../public/icons/back.svg';

import Logo from '../../../public/icon_white.png';

import Button from '../../components/button';

const Header = ({ menuToggle, onMenuToggle, userData, onLogout, onCreate, showBackButton, onBack, showCreate }) => {

    return (<div className={styles.container} >
        <div className={styles.container__left}>
            {showBackButton ? <Button
                text="Dashboard"
                onClick={() => onBack()}
                className={styles.back}
                icon={<BackIcon height={24} width={24} fill={"#19181e"} />}
                reversed
            /> : <>made by eren.</>}
        </div>
        <div className={styles.container__middle}>
            <Link href="#">
                <a>
                    <Image
                        src={Logo}
                        alt="Logo of Snipetti"
                        priority={true}
                        width={140}
                        height={45}
                        layout="intrinsic"
                        quality={100}
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
                <div className={styles.navUser} style={{ fontSize: "1.5em", fontWeight: 600 }}>
                    {userData && (userData.name || "")}
                </div>
                <div className={styles.navUser} style={{ marginBottom: 12 }}>
                    {userData && (userData.email || "")}
                </div>
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