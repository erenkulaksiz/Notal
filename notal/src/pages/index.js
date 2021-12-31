import Head from 'next/head';
import styles from '../../styles/App.module.scss';

const Home = (props) => {
  return (<div className={styles.container}>
    <Head>
      <title>Notal</title>
      <meta name="description" content="Notal" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className={styles.selam}>
      SELAM! notal'ı yeni yapmaya başladım. fghhfghfhghfhghgfhgh
    </div>
  </div>)
}

export default Home;