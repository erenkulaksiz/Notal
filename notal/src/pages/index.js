import Head from 'next/head';
import styles from '../../styles/App.module.scss';
import { useState, useEffect } from 'react';
import { server } from '../config';

import LogoutIcon from '../../public/icons/logout.svg';

import Button from '../components/button';
import Header from '../components/header';

import { withAuth } from '../hooks/route';
import useAuth from '../hooks/auth';

const Home = (props) => {
  const auth = useAuth();
  const [menuToggle, setMenuToggle] = useState(false);

  useEffect(() => {
    console.log("props: ", props);
  }, []);

  return (<div className={styles.container}>
    <Head>
      <title>Notal</title>
      <meta name="description" content="Notal" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Header
      menuToggle={menuToggle}
      onMenuToggle={val => setMenuToggle(val)}
      userData={{ fullname: props.validate?.data?.fullname, email: auth.authUser.email }}
      avatarURL={props.validate.data?.avatar}
      onLogout={() => auth.logout()}
      showCreate={false}
    />

    <div className={styles.content_home}>
      {"SELAM! notal'ı yeni yapmaya başladım."}<br />
      {props.validate.fullname}<br />

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

      console.log("data: ", data);
      if (data.success) {
        validate = { ...data };
      }
    }
  }
  return { props: { validate } }
}