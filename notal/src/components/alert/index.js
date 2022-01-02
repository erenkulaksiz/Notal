import styles from './Alert.module.scss';

import CrossIcon from '../../../public/icons/cross.svg';

const Alert = ({ visible, buttons, title, icon, text, textColor = "white", closeVisible, onCloseClick }) => {
    if (!visible) return null

    return (<div className={styles.alertContainer}>
        <div className={styles.content}>
            <div className={styles.alert}>
                {closeVisible && <div className={styles.closeButtonWrapper}>
                    <button className={styles.closeButton} onClick={onCloseClick}>
                        <CrossIcon height={24} width={24} fill={"#fff"} />
                    </button>
                </div>}
                <div className={styles.title}>
                    {icon}
                    <span style={{ color: textColor }}>{title}</span>
                </div>
                <div className={styles.body}>
                    {text}
                </div>
                <div className={styles.buttons}>
                    {buttons.map((el, index) => <div key={index} style={{ display: "flex", width: "45%" }}>{el}</div>)}
                </div>
            </div>
        </div>
        <span className={styles.overlay} />
    </div>)
}

export default Alert;

