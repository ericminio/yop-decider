class YopElement extends HTMLElement {
  constructor() {
    super();
    this.template = this.constructor.template;
    this.bus = eventBus;
    this.ids = [];
  }
  async connectedCallback() {
    this.innerHTML = await fetch(this.template).then((response) =>
      response.text(),
    );
    this.wire();
  }
  async disconnectedCallback() {
    this.bus.unregisterAll(this.ids);
  }
  registerListener(listener, key) {
    this.ids.push(this.bus.register(listener, key));
  }
  notify(key, value) {
    this.bus.notify(key, value);
  }
  wire() {
    throw new Error("wire() method not implemented");
  }
}
