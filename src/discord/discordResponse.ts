export default class DiscordResponse extends Response {
  constructor(body: object) {
    super(JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });
  }
}
