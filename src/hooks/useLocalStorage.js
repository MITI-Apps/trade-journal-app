import { useState, useEffect } from "react";

const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        const saved = localStorage.getItem(key);//key rep. where item is saved
        return saved ? JSON.parse(saved) : initialValue;
    });

    useEffect(() =>  {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}
export default useLocalStorage;