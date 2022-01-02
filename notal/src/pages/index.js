import Head from 'next/head';
import styles from '../../styles/App.module.scss';
import { useContext, useState, useEffect } from 'react';
import useAuth from '../hooks/auth';

import LogoutIcon from '../../public/icons/logout.svg';

import Button from '../components/button';
import { withAuth } from '../hooks/route';

const Home = (props) => {
  const auth = useAuth();

  return (<div className={styles.container}>
    <Head>
      <title>Notal</title>
      <meta name="description" content="Notal" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className={styles.selam}>
      {"SELAM! notal'ı yeni yapmaya başladım."}<br />
      {auth.authUser?.displayName}<br />

      {auth.authUser?.email}

      <Button
        text="logout"
        type="button"
        icon={<LogoutIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
        style={{ marginTop: 24, border: "none" }}
        onClick={auth.logout}
      />
    </div>
  </div>)
}

export default withAuth(Home);