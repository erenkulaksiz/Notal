interface FormatDateToHuman {
  date: Date | number | string;
  output: string;
}

export function formatDateToHuman({ date, output }: FormatDateToHuman) {
  const unFormatted = new Date(date);

  const day = unFormatted.getDate();
  const month = unFormatted.getMonth();
  const year = unFormatted.getFullYear();
  const hours = unFormatted.getHours();
  const minutes = unFormatted.getMinutes();
  const seconds = unFormatted.getSeconds();

  const months = [
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
  ];

  let _output = output;
  _output = _output.replace("{DAY}", day.toString().padStart(2, "0"));
  _output = _output.replace("{MONTH}", months[month]);
  _output = _output.replace(
    "{MONTHDATE}",
    (month + 1).toString().padStart(2, "0")
  );
  _output = _output.replace("{YEAR}", year.toString());
  _output = _output.replace("{HOURS}", hours.toString().padStart(2, "0"));
  _output = _output.replace("{MINUTES}", minutes.toString().padStart(2, "0"));
  _output = _output.replace("{SECONDS}", seconds.toString().padStart(2, "0"));

  return `${_output}`;
}
