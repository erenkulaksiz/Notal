import { useEffect } from 'react';

const useClickAnyWhere = (handler) => {
    useEffect(() => {
        const callback = (event) => handler(event);

        document.addEventListener('click', callback);
        return () => document.removeEventListener('click', callback);
    }, [handler]);
};

export default useClickAnyWhere;