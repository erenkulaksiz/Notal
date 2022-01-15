import React, { useEffect, createContext, useContext, useState } from 'react';
import cookie from 'js-cookie';

const themeContext = createContext();

export default function useTheme() {
    return useContext(themeContext);
}

export function ThemeProvider(props) {
    const [theme, setTheme] = useState(null);

    const changeTheme = (changedTheme) => {
        setTheme(changedTheme);
        cookie.set("theme", changedTheme, { expires: 7 });
    }

    const toggleTheme = () => {
        if (theme == "theme-light") {
            changeTheme("theme-dark");
        } else if (theme == "theme-dark") {
            changeTheme("theme-light");
        } else {
            changeTheme("theme-light");
        }
    }

    useEffect(() => {
        const cookies = cookie.get();
        if (!cookies.theme) {
            changeTheme("theme-light");
        } else {
            if (cookies.theme == "theme-light" || cookies.theme == "theme-dark") {
                setTheme(cookies.theme);
            } else {
                changeTheme("theme-light");
            }
        }
    }, [])

    const value = { UITheme: theme, UISetTheme: setTheme, changeTheme, toggleTheme };

    return <themeContext.Provider value={value} {...props} />
}