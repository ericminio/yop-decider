import { contentOfFile } from "../files/content-of-file.js";

export const exposex = ({ symbol, files, symbols }) => {
  const content = files.reduce((acc, file) => acc + contentOfFile(file), "");
  const code = content.replaceAll(/export/g, "");
  let exposed = `return ${symbol};`;
  if (!!symbols) {
    exposed = symbols.reduce((acc, symbol) => acc + `, ${symbol}`);
    exposed = `return { ${exposed} };`;
  }
  return new Function(`${code}; ${exposed}`)();
};
