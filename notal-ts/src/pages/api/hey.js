const { SendTelegramMessage } = require("@utils");

export default function handler(req, res) {
  SendTelegramMessage({ message: "hey" })
  res.status(200).json({ name: 'John Doe' })
}