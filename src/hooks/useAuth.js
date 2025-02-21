import { useEffect, useState } from "react";

// custom hook to manage auth status (boolean)
export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedAuth = localStorage.getItem("isLoggedIn");
        return storedAuth ? JSON.parse(storedAuth) : false;
    });

    useEffect(() => {
        localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

    const setIsLogged = (value) => {
        setIsLoggedIn(value);
    };

    const getIsLogged = () => {
        return isLoggedIn;
    };

    const setLogOut = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
    };

    return { getIsLogged, setIsLogged, setLogOut };
}