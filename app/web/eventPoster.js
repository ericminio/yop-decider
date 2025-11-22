class EventPoster {
  constructor(bus) {
    this.bus = bus;
    this.bus.register(this, "proposition.created");
    this.bus.register(this, "user.voted");
  }

  update(value, key) {
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
