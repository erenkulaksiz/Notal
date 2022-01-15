import { useRouter } from 'next/router';
import Button from '../../components/button';

import styles from '../../../styles/App.module.scss';

import BackIcon from '../../../public/icons/back.svg';
import HomeFilledIcon from '../../../public/icons/home_filled.svg';
import useTheme from '../../hooks/theme';

const Page404 = () => {
    const router = useRouter();
    const theme = useTheme();

    return <div className={styles.container} data-theme={theme.UITheme}>
        <div className={styles.notFound}>
            <h1 className={styles.title}>[404]</h1>
            <div className={styles.desc}>
                We couldnt find the page you were looking for.
            </div>
            <Button
                text="Home"
                onClick={() => router.replace("/")}
                style={{ height: 54, borderRadius: 8, width: 380, marginTop: 24 }}
                icon={<HomeFilledIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
            />
            <Button
                text="Back"
                onClick={() => router.back()}
                style={{ height: 54, borderRadius: 8, width: 380, marginTop: 12 }}
                icon={<BackIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
            />
        </div>
    </div>
}

export default Page404;