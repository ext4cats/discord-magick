import verifyDiscordRequest from './discord/verifyDiscordRequest.js';
import Interaction from './discord/interaction.js';
import DiscordResponse from './discord/discordResponse.js';
import getAttachmentURLs from './discord/getAttachmentURLs.js';
import { commands } from './commands.js';

export interface Env {
  DISCORD_PUBLIC_KEY: string;
}

async function executeCommand(
  name: string,
  imageURLs: string[],
): Promise<DiscordResponse> {
  const command = commands[name];
  if (!command) {
    return new Response('Unknown command name', { status: 400 });
  }
  return command.execute(imageURLs);
}

async function handleRequest(request: Request): Promise<Response> {
  let body: Interaction;
  try {
    body = (await request.json()) as Interaction;
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  if (body.type === 1) {
    return new DiscordResponse({ type: 1 });
  }

  if (body.type === 2 && body.data) {
    const attachmentURLs = getAttachmentURLs(body);
    if (!attachmentURLs) {
      return new DiscordResponse({
        type: 4,
        data: {
          content: 'Found no images to process',
        },
      });
    }
    return await executeCommand(body.data.name, attachmentURLs);
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
