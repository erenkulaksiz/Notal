import { isClient } from "@utils";

export const Log = {
  activated: process.env.NEXT_PUBLIC_DEBUG_LOG == "true",
  formatDate: function (thisdate: Date) {
    const date = new Date(thisdate);
    return `${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
  },
  debug: function (...args: [] | any) {
    if (!Log.activated && isClient()) return;
    console.log(
      `%c[DEBUG] [${Log.formatDate(new Date(Date.now()))}]`,
      "background:white;color:black;",
      { time: Date.now() },
      ...args
    );
  },
  error: function (...args: [] | any) {
    //if (!Log.activated && isClient) return;
    console.log(
      `%c❌ [ERROR] [${Log.formatDate(new Date(Date.now()))}]`,
      "background:white;color:black;",
      { time: Date.now() },
      ...args
    );
  },
};
