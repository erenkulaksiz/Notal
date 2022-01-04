import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import styles from '../../styles/App.module.scss';
import { server } from '../config';
import LogoutIcon from '../../public/icons/logout.svg';
import UserIcon from '../../public/icons/user.svg';

import Input from '../components/input';
import Button from '../components/button';
import Header from '../components/header';

import CheckIcon from '../../public/icons/check.svg';

import { withAuth } from '../hooks/route';
import useAuth from '../hooks/auth';

const Home = (props) => {
  const auth = useAuth();
  const router = useRouter();

  const [menuToggle, setMenuToggle] = useState(false);

  const [validate, setValidate] = useState(props.validate);

  // Register States
  const [register, setRegister] = useState({ fullname: "", username: "" });
  const [regErr, setRegErr] = useState({ fullname: false, username: false, register: false });
  const [registerAlertVisible, setRegisterAlertVisible] = useState(false);
  //

  useEffect(() => {
    console.log("props: ", props);

    if (!props.validate.data?.username?.length) { // if theres no username is present
      setRegisterAlertVisible(true);
    }
  }, []);

  const registerUser = async (e) => {
    e.preventDefault();

    if (register.username.length < 3 || register.username == '') {
      setRegErr({ ...regErr, username: "Please enter a valid username." });
      return;
    } else {
      setRegErr({ ...regErr, username: false });
    }

    if (register.fullname.length < 3 || register.fullname == '') {
      setRegErr({ ...regErr, fullname: "Please enter a valid fullname." });
      return;
    } else {
      setRegErr({ ...regErr, fullname: false });
    }

    const result = await auth.updateUser({ uid: props.auth.authUser.uid, fullname: register.fullname, username: register.username.toLowerCase() });
    console.log("res: ", result.error?.error ?? "");
    if (result.success) {
      setRegisterAlertVisible(false);
      setRegErr({ fullname: false, username: false, register: false });
      setValidate({ ...validate, data: { ...validate.data, fullname: register.fullname, username: register.username } })
    } else if (result.error?.success == false && result?.error?.error == "auth/username-already-in-use") {
      setRegErr({ fullname: false, username: "This username is already in use.", register: false });
      return;
    }
  }

  if (registerAlertVisible) return <div className={styles.registerAlertContainer}>
    <div className={styles.content}>
      <div className={styles.alert}>
        <div className={styles.title}>
          <CheckIcon height={24} width={24} fill={"#fff"} />
          <span style={{ color: "white", marginLeft: 8 }}>One more step...</span>
        </div>
        <div className={styles.body}>
          <form id="register" onSubmit={e => registerUser(e)}>
            <div style={{ width: "100%" }}>
              Username
              <Input
                type="text"
                placeholder="Username (e.g. erentr)"
                onChange={e => setRegister({ ...register, username: e.target.value.replace(/[^\w\s]/gi, "").replace(/\s/g, '') })}
                value={register.username}
                icon={<UserIcon height={24} width={24} fill={"#19181e"} />}
                error={regErr.username != false}
                required
                style={{ marginTop: 18 }}
                maxLength={24}
              />
              {regErr.username != false && <p className={styles.errorMsg}>{regErr.username}</p>}
            </div>
            <div style={{ width: "100%", marginTop: 24 }}>
              Fullname
              <Input
                type="text"
                placeholder="Fullname (e.g. John Doe)"
                onChange={e => setRegister({ ...register, fullname: e.target.value })}
                value={register.fullname}
                icon={<UserIcon height={24} width={24} fill={"#19181e"} />}
                error={regErr.fullname != false}
                required
                style={{ marginTop: 18 }}
              />
            </div>
          </form>
        </div>
        <div className={styles.buttons}>
          <Button
            text="Logout"
            style={{ border: "none", margin: 24, marginBottom: 0, }}
            onClick={() => auth.logout()}
          />
          <Button
            text="Complete"
            type="submit"
            form="register"
            icon={<CheckIcon height={24} width={24} fill={"#000"} style={{ marginRight: 8 }} />}
            style={{ border: "none", margin: 24, marginBottom: 0, }}
            reversed
          />
        </div>
      </div>
    </div>
    <span className={styles.overlay} />
  </div>

  return (<div className={styles.container}>
    <Head>
      <title>Notal</title>
      <meta name="description" content="Notal" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Header
      menuToggle={menuToggle}
      onMenuToggle={val => setMenuToggle(val)}
      userData={{ fullname: validate?.data?.fullname, email: auth.authUser.email }}
      avatarURL={validate.data?.avatar}
      onLogout={() => auth.logout()}
      onProfile={() => router.push(`/profile/${validate?.data?.username}`)}
      onHeaderHome={() => router.replace('/')}
      showCreate={false}
    />

    <div className={styles.content_home}>
      {"Notal."}<br />
      {validate?.data?.fullname}<br />

      {auth.authUser?.email}

    </div>
  </div>)
}

export default withAuth(Home);

export async function getServerSideProps(ctx) {
  const { req, res, query } = ctx;
  let validate = {};

  if (req) {
    const authCookie = req.cookies.auth;
    //const emailCookie = req.cookies.email;

    if (authCookie) {
      const data = await fetch(`${server}/api/validate`, {
        'Content-Type': 'application/json',
        method: "POST",
        body: JSON.stringify({ token: authCookie }),
      }).then(response => response.json());

      console.log("data (index.js): ", data);
      if (data.success) {
        validate = { ...data };
      }
    }
  }
  return { props: { validate } }
}