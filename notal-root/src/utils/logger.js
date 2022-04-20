import { isClient } from "@utils";

// #TODO: log api call time

const Log = {
    activated: process.env.NEXT_PUBLIC_DEBUG_LOG == "true",
    formatDate: (thisdate) => {
        const date = new Date(thisdate);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
    },
    debug: (...args) => {
        if (!Log.activated && isClient) return;
        console.log(`%c[DEBUG] [${Log.formatDate(Date.now())}]`, 'background:white;color:black;', { time: Date.now() }, ...args);
    },
    error: (...args) => {
        //if (!Log.activated && isClient) return;
        console.log(`%c❌ [ERROR] [${Log.formatDate(Date.now())}]`, 'background:white;color:black;', { time: Date.now() }, ...args);
    }
}

export default Log;