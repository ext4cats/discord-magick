interface Command {
  name: string;
  description: string;
}

const PING_COMMAND: Command = {
  name: 'ping',
  description: 'Respond with "pong".',
};

export const commands: Record<string, Command> = {
  ping: PING_COMMAND,
};
