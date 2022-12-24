import Pusher from "pusher-js";
import { isClient } from "@utils/isClient";

Pusher.logToConsole = true;

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
