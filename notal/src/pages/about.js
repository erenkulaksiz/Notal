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

import Button from '../components/button';
import Input from '../components/input';
import Header from '../components/header';

import useAuth from '../hooks/auth';
import { CheckToken } from '../utils';

const About = (props) => {
    const router = useRouter();
    const auth = useAuth();

    const [menuToggle, setMenuToggle] = useState(false);

    const [viewing, setViewing] = useState("about");

    useEffect(() => {
        (async () => {
            const res = await CheckToken({ auth, props });
            if (res) router.replace(router.asPath);
        })();
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>About · Notal</title>
                <meta name="description" content="About Notal, the greatest note app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header
                menuToggle={menuToggle}
                onMenuToggle={val => setMenuToggle(val)}
                userData={{ fullname: props.validate?.data?.fullname, email: auth?.authUser?.email }}
                avatarURL={props.validate.data?.avatar}
                loggedIn={auth?.authUser != null}
                onLogin={() => router.push("/login")}
                onLogout={() => auth.users.logout()}
                onProfile={() => router.push(`/profile/${props.validate?.data?.username}`)}
                onHeaderHome={() => router.push("/")}
                showCreate={false}
                showBackButton
                onBack={() => router.back()}
            />

            <div className={styles.content_about}>
                <div className={styles.nav}>
                    <Button
                        text="About"
                        onClick={() => setViewing("about")}
                        style={{ justifyContent: "flex-start", borderRadius: 8, width: "100%", marginTop: 24, height: 54 }}
                        icon={<QuestionIcon height={24} width={24} fill={viewing == "about" ? "#fff" : "#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />}
                        reversed={viewing != "about"}
                    />
                    <Button
                        text="Features"
                        onClick={() => setViewing("features")}
                        style={{ justifyContent: "flex-start", borderRadius: 8, width: "100%", marginTop: 12, height: 54 }}
                        icon={<SlidershIcon height={24} width={24} style={{ marginLeft: 8, marginRight: 8, color: viewing == "features" ? "#fff" : "#19181e" }} />}
                        reversed={viewing != "features"}
                    />
                    <Button
                        text="Vision & Mission"
                        onClick={() => setViewing("vision")}
                        style={{ justifyContent: "flex-start", borderRadius: 8, width: "100%", marginTop: 12, height: 54, textAlign: "left" }}
                        icon={<RoadIcon height={24} width={24} style={{ marginLeft: 8, marginRight: 8, color: viewing == "vision" ? "#fff" : "#19181e" }} />}
                        reversed={viewing != "vision"}
                    />
                    <Button
                        text="Credits"
                        onClick={() => setViewing("credits")}
                        style={{ justifyContent: "flex-start", borderRadius: 8, width: "100%", marginTop: 12, height: 54 }}
                        icon={<ScrollIcon height={24} width={24} style={{ marginLeft: 8, marginRight: 8, color: viewing == "credits" ? "#fff" : "#19181e" }} />}
                        reversed={viewing != "credits"}
                    />
                </div>
                {viewing == "about" && <div className={styles.aboutContainer}>
                    <div className={styles.aboutTitle}>
                        <h1>🎉 Welcome to Notal.</h1>
                    </div>
                    <div className={styles.aboutDesc}>
                        <p>Notal is a basic todo tracking and taking notes platform.
                            <br />It is currently being built by me in Istanbul, Turkey which my name is <a href="https://github.com/erenkulaksiz">Eren Kulaksiz</a>.
                            <br />You can directly contact with me with my email <a href="mailto:erenkulaksz@gmail.com">erenkulaksz@gmail.com</a>.
                        </p>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.title}>
                            <div className={styles.icon}>
                                <AddIcon height={24} width={24} fill={"#fff"} />
                            </div>
                            <h1>Create Workspaces</h1>
                        </div>
                        <div className={styles.desc}>
                            <p>Creating a workspaces will make you be able to create todos and notes inside them. Also you can share your workspaces, or you can just set them to private only you, or you can set who can see your workspace with username of users.
                                <br /> Currently, teams and permission system is being built along with development of workspaces.
                            </p>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.title}>
                            <div className={styles.icon}>
                                <EditIcon height={24} width={24} fill={"#fff"} />
                            </div>
                            <h1>Take Notes</h1>
                        </div>
                        <div className={styles.desc}>
                            <p>Want to take notes about your project? simply open a workspace then add notes.</p>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.title}>
                            <div className={styles.icon}>
                                <AddIcon height={24} width={24} fill={"#fff"} />
                            </div>
                            <h1>Add Todos</h1>
                        </div>
                        <div className={styles.desc}>
                            <p>Want to add todos for your project? you can create from a workspace. You can even categorize them or add notes into todos.</p>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.title}>
                            <div className={styles.icon}>
                                <EditIcon height={24} width={24} fill={"#fff"} />
                            </div>
                            <h1>Customize Your Profile</h1>
                        </div>
                        <div className={styles.desc}>
                            <p>You can change your fullname, bio and username on your profile section. Also your username is the link. {auth.authUser != null && <>For example, your profile link is <a href={`${server}/profile/${props.validate?.data?.username}`}>{`${server}/profile/${props.validate?.data?.username}`}</a></>}</p>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.title}>
                            <div className={styles.icon}>
                                <LockOutlineIcon height={24} width={24} fill={"#fff"} />
                            </div>
                            <h1>Privacy & Security</h1>
                        </div>
                        <div className={styles.desc}>
                            <p>
                                Im building Notal with privacy and security in-mind.
                                <br />You can register with Google, GitHub and Email at this point.
                                <br />All stored data is stored with using <b>SHA256 and other types of encryption</b> in our servers.
                                <br />Backend written with NodeJS & Firebase Admin and all API requests are Auth protected.
                                <br />Notal will never sell your data, even workspace data is kept in our secure servers.
                                <br />Even though i wrote Frontend & Backend just by myself, my pentest tools are limited. But
                                if you are interested in pentesting, im open to offers at <a href="mailto:erenkulaksz@gmail.com">erenkulaksz@gmail.com</a>.
                            </p>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.title}>
                            <div className={styles.icon}>
                                <SpeedIcon height={24} width={24} fill={"#fff"} />
                            </div>
                            <h1>Peformance & Speed</h1>
                        </div>
                        <div className={styles.desc}>
                            <p>
                                Performance and speed is always important since it affects your waiting time, also efficiency.
                                <br />Im aware of performance and speed issues (technically its not issues).
                                <br />At this stage, starring your workspaces, deleting workspaces, retrieving workspaces and editing workspaces might seem your internet speed is low. As soon as you click to buttons, we recieve the API call but its not showed on Frontend.
                                <br />This is a intended behaviour and will be fixed at production build on near end of Q1 in 2022.
                                <br />Note that you are using a Beta version of a new platform built from scratch.
                            </p>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.title}>
                            <div className={styles.icon}>
                                <QuestionIcon height={24} width={24} fill={"#fff"} />
                            </div>
                            <h1>More</h1>
                        </div>
                        <div className={styles.desc}>
                            <p>The project is currently still in beta. Even this page is built new. Ill update this page whenever i add new stuff to Notal. See you :)</p>
                        </div>
                    </div>
                </div>}

            </div>
        </div>
    )
}

export default About;

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