import Pusher from "pusher-js";
import { isClient } from "@utils/isClient";
import { Log } from "@utils/logger";

Pusher.logToConsole = true;
Pusher.log = (message) => Log.debug(message);

const pusherConfig = {
  key: process.env.NEXT_PUBLIC_PUSHER_KEY ?? "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "",
};

let pusher: Pusher | undefined;

if (!pusher && isClient()) {
  pusher = new Pusher(pusherConfig.key, {
    cluster: pusherConfig.cluster,
  });
}

export default pusher;
