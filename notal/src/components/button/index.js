import styles from './Button.module.scss';

const Button = ({ onClick, icon, text, style = {}, form = null, type = "button", reversed = false, onFocus }) => {
    return (
        <button type={type} form={form} className={reversed ? styles.button__reversed : styles.button} style={{ ...style }} onClick={onClick} onFocus={onFocus}>
            {icon}
            <span style={{ color: reversed ? "#19181e" : "white" }}>{text}</span>
        </button>
    )
}

export default Button;