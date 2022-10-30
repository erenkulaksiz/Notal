export function formatDate(date: Date | number | string) {
  return `${new Date(date).getDate()} ${
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][new Date(date).getMonth()]
  }, ${new Date(date).getFullYear()} ${new Date(date)
    .getHours()
    .toString()
    .padStart(2, "0")}:${new Date(date)
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${new Date(date)
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
}
