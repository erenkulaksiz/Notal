export const formatString = (str: string) =>
  str.replace(/[^\w\s]/gi, "").replace(/\s/g, "");
