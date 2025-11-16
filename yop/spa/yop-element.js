class YopElement extends HTMLElement {
  constructor() {
    super();
    this.bus = eventBus;
    this.ids = [];
  }
  async disconnectedCallback() {
    this.bus.unregisterAll(this.ids);
  }
  registerListener(listener, key) {
    this.ids.push(this.bus.register(listener, key));
  }
  notify(key) {
    this.bus.notify(key);
  }
}
