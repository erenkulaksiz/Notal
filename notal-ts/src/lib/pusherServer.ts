import Pusher from "pusher";

const pusherConfig = {
  appId: process.env.PUSHER_APP_ID ?? "",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY ?? "",
  secret: process.env.PUSHER_SECRET ?? "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "",
};

const pusher = new Pusher({
  appId: pusherConfig.appId,
  key: pusherConfig.key,
  secret: pusherConfig.secret,
  cluster: pusherConfig.cluster,
});

export default pusher;
