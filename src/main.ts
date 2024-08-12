import verifyDiscordRequest from './verifyDiscordRequest.js';

export interface Env {
  DISCORD_PUBLIC_KEY: string;
}

interface Interaction {
  type: number;
  data?: InteractionData;
}

interface InteractionData {
  name: string;
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const isValidRequest = await verifyDiscordRequest(
    request,
    env.DISCORD_PUBLIC_KEY,
  );
  if (!isValidRequest) {
    return new Response('Invalid request signature', { status: 401 });
  }

  let body: Interaction;
  try {
    body = (await request.json()) as Interaction;
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  // DEBUG
  console.log(body);

  if (body.type === 1) {
    return new Response(JSON.stringify({ type: 1 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (body.type === 2 && body.data) {
    const { name } = body.data;
    switch (name) {
      case 'ping': {
        return new Response(
          JSON.stringify({ type: 4, data: { content: 'Pong!' } }),
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }
    }
  }
  return new Response('Unknown request type', { status: 400 });
}

export default {
  async fetch(request: Request, env: Env) {
    return handleRequest(request, env);
  },
} satisfies ExportedHandler<Env>;
