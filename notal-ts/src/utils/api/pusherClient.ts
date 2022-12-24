import Pusher from "pusher-js";

const pusherConfig = {
  key: process.env.NEXT_PUBLIC_PUSHER_KEY ?? "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "",
};

const pusher = new Pusher(pusherConfig.key, {
  cluster: pusherConfig.cluster,
});

export default pusher;
