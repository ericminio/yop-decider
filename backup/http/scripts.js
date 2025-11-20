import { contentOfFile } from "../files/content-of-file.js";

export const scripts = (files, base) => {
  const code = files.reduce(
    (acc, current) =>
      acc + contentOfFile(new URL(current, base)).replace(/export /g, ""),
    "",
  );
  return () => ({
    content: code,
    contentType: "application/javascript",
  });
};
