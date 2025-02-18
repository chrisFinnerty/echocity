import {useState, useEffect} from 'react';

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try{
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch(err){
            console.error("Error reading local storage", err);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try{
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch(err){
            console.error("Error setting localStorage", err)
        }
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const item = window.localStorage.getItem(key);
            setStoredValue(item ? JSON.parse(item) : initialValue)
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [key, initialValue])

    return [storedValue, setValue];
}

export default useLocalStorage;