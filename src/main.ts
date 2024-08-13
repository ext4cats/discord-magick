import verifyDiscordRequest from './discord/verifyDiscordRequest.js';
import Interaction from './discord/interaction.js';
import DiscordResponse from './discord/discordResponse.js';

export interface Env {
  DISCORD_PUBLIC_KEY: string;
}

async function handleRequest(request: Request): Promise<Response> {
  let body: Interaction;
  try {
    body = (await request.json()) as Interaction;
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  // DEBUG
  console.log(body);

  if (body.type === 1) {
    return new DiscordResponse({ type: 1 });
  }

  if (body.type === 2 && body.data) {
    switch (body.data.name) {
      case 'ping': {
        return new DiscordResponse({ type: 4, data: { content: 'Pong!' } });
      }
    }
  }

  return new Response('Unknown request type', { status: 400 });
}

export default {
  async fetch(request: Request, env: Env) {
    return (await verifyDiscordRequest(request, env.DISCORD_PUBLIC_KEY))
      ? handleRequest(request)
      : new Response('Invalid request signature', { status: 401 });
  },
} satisfies ExportedHandler<Env>;
