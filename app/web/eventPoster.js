class EventPoster {
  constructor(bus) {
    this.bus = bus;
  }

  async update(value, key) {
    fetch("/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        value,
      }),
    }).then(() => {
      this.bus.notify("proposition.submitted");
    });
  }
}
