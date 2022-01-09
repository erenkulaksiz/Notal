import styles from './Input.module.scss';
import VisibleIcon from '../../../public/icons/visible.svg';
import InvisibleIcon from '../../../public/icons/invisible.svg';

const Input = ({ onChange, value, type = "text", id, placeholder = "Placeholder", required = false, icon, error = false, onKeyDown, onVisibilityPress, visible, visibleButton = false, autoFocus = false, style, inputKey, multiline = false, maxLength = 128, multilineStyle = {}, defaultValue }) => {

    return (
        <div className={styles.input} style={{ borderWidth: error && 2, borderColor: error && "#db0707", borderStyle: error && "solid", ...style }}>
            {icon && <div className={styles.iconContainer}>
                {icon}
            </div>}
            {multiline ? <textarea
                id={id}
                maxLength={maxLength}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                required={required}
                autoFocus={autoFocus}
                key={inputKey}
                defaultValue={defaultValue}
                style={{ ...multilineStyle }}
                onKeyDown={onKeyDown}
            /> : <input
                type={visible ? "text" : type}
                maxLength={maxLength}
                id={id}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                required={required}
                autoFocus={autoFocus}
                key={inputKey}
                defaultValue={defaultValue}
                onKeyDown={onKeyDown}
            />}
            {
                visibleButton && <button type="button" onClick={onVisibilityPress} className={styles.visible}>
                    {visible ? <InvisibleIcon height={24} width={24} fill={"#19181e"} /> : <VisibleIcon height={24} width={24} fill={"#19181e"} />}
                </button>
            }
        </div>
    )
}

export default Input;