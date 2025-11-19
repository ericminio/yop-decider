class EventPoster {
  constructor() {}

  async update(value, key) {
    await fetch("/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        value,
      }),
    });
  }
}
