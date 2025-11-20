export const fail = (status, text) => (_, response) => {
  response.writeHead(status, {
    "content-type": "text/plain",
    "content-length": text.length,
  });
  response.end(text);
};
