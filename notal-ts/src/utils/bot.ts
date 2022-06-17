import { Log } from "@utils";

export async function SendTelegramMessage({ message }: { message: string }) {
  const text = encodeURIComponent(message);
  const res = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_ID}/sendMessage?chat_id=${process.env.TELEGRAM_BOT_TARGET_ID}&text=${text}`
  );
  Log.debug("Sent telegram bot message: ", message);
}
