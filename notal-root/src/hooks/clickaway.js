import { useEffect } from "react";

const useClickAway = (
    ref,
    handler
) => {
    useEffect(() => {
        const callback = (event) => {
            const el = ref.current;
            if (!event || !el || el.contains((event).target)) return;
            handler(event);
        };

        document.addEventListener('click', callback);
        return () => document.removeEventListener('click', callback);
    }, [ref, handler]);
};

export default useClickAway;