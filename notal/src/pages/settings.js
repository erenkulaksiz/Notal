import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from '../../styles/App.module.scss';
import { useRouter } from 'next/router';

import { server } from '../config';

import QuestionIcon from '../../public/icons/question.svg';
import AddIcon from '../../public/icons/add.svg';
import EditIcon from '../../public/icons/edit.svg';
import LockOutlineIcon from '../../public/icons/lock_outline.svg';
import SpeedIcon from '../../public/icons/speed.svg';
import RoadIcon from '../../public/icons/road.svg';
import ScrollIcon from '../../public/icons/scroll.svg';
import SlidershIcon from '../../public/icons/sliders-h.svg';
import TimeIcon from '../../public/icons/time.svg';
import HomeFilledIcon from '../../public/icons/home_filled.svg';
import BackIcon from '../../public/icons/back.svg';

import { withAuth } from '../hooks/route';

import useAuth from '../hooks/auth';
import { CheckToken } from '../utils';

import Header from '../components/header';
import Button from '../components/button';

const Settings = (props) => {
    const router = useRouter();
    const auth = useAuth();

    const [menuToggle, setMenuToggle] = useState(false);

    const [viewing, setViewing] = useState("about");

    useEffect(() => {
        (async () => {
            const token = await auth.users.getIdToken();
            const res = await CheckToken({ token, props });
            if (props.validate?.error == "no-token" || res || props.validate?.error == "validation-error" || props.validate?.error == "auth/id-token-expired") {
                router.replace(router.asPath);
            }
        })();
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>Settings · Notal</title>
                <meta name="description" content="Settings on Notal" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header
                menuToggle={menuToggle}
                onMenuToggle={val => setMenuToggle(val)}
                userData={{ fullname: props.validate?.data?.fullname, email: props.validate?.data?.email }}
                avatarURL={props.validate.data?.avatar}
                loggedIn={props.validate?.success == true}
                onLogin={() => router.push("/login")}
                onLogout={() => auth.users.logout()}
                onProfile={() => router.push(`/profile/${props.validate?.data?.username}`)}
                onHeaderHome={() => router.push("/")}
                leftContainer={<div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                    <Button
                        text="Back"
                        onClick={() => router.back()}
                        style={{ height: 44, borderRadius: 8, width: "45%" }}
                        icon={<BackIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
                    />
                    <Button
                        text="Home"
                        onClick={() => router.replace("/")}
                        style={{ height: 44, borderRadius: 8, width: "45%" }}
                        icon={<HomeFilledIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
                    />
                </div>}
            />

            <div className={styles.content_settings}>

            </div>
        </div>
    )
}

export default withAuth(Settings);

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};

    if (req) {
        const authCookie = req.cookies.auth;

        if (authCookie) {
            const data = await fetch(`${server}/api/validate`, {
                'Content-Type': 'application/json',
                method: "POST",
                body: JSON.stringify({ token: authCookie }),
            }).then(response => response.json());

            console.log("data (about.js): ", data);
            if (data.success) {
                validate = { ...data };
            }
        }
    }
    return { props: { validate } }
}