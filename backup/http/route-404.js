export const notFound = (incoming, response) => {
  response.writeHead(404, { "content-type": "text/plain" });
  response.end("NOT FOUND");
};
