export default {
  async fetch() {
    return Response.json({ msg: 'Hello, world!' });
  },
} satisfies ExportedHandler;
