import { isClient, formatDateToHuman } from "@utils";

export const Log = {
  activated: process.env.NEXT_PUBLIC_DEBUG_LOG == "true",
  debug: function (...args: [] | any) {
    if (!Log.activated && isClient()) return;
    console.log(
      `%c[DEBUG] [${formatDateToHuman({
        date: Date.now(),
        output: "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
      })}]`,
      "background:white;color:black;",
      { time: Date.now() },
      ...args
    );
  },
  error: function (...args: [] | any) {
    //if (!Log.activated && isClient) return;
    console.log(
      `%c❌ [ERROR] [${formatDateToHuman({
        date: Date.now(),
        output: "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
      })}]`,
      "background:white;color:black;",
      { time: Date.now() },
      ...args
    );
  },
};
