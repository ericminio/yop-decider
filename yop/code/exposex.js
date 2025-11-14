import { contentOfFile } from "../files/content-of-file.js";

export const exposex = ({ symbol, files, symbols }) => {
  const content = files.reduce((acc, file) => acc + contentOfFile(file), "");
  let exposed = `return ${symbol};`;
  if (!!symbols) {
    exposed = symbols.reduce((acc, symbol) => acc + `, ${symbol}`);
    exposed = `return { ${exposed} };`;
  }
  return new Function(`${content}; ${exposed}`)();
};
