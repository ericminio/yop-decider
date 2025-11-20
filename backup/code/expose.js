import { contentOfFile } from "../files/content-of-file.js";

export const expose = ({ symbol, file }) => {
  const content = contentOfFile(file);
  const code = content.replaceAll(/export/g, "");
  return new Function(`${code}; return ${symbol}`)();
};
