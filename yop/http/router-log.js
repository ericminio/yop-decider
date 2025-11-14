export class RouterLog {
  matches(incoming) {
    console.log(incoming.method, incoming.url);
    return false;
  }
}
