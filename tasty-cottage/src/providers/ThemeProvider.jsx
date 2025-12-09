import { createContext, useEffect } from "react";

export const ThemeContext = createContext(null);

const ThemeProvider = ({ children }) => {
    // Force "light" theme always
    const theme = "light";

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    }, []);

    const toggleTheme = () => {
        // No-op or log that theme is locked
        console.log("Dark mode is disabled.");
    };

    const themeInfo = {
        theme,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={themeInfo}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
