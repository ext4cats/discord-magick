import { commands } from './commands.js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.dev.vars' });

const token = process.env.DISCORD_TOKEN;
const appID = process.env.DISCORD_APPLICATION_ID;

if (!token) {
  throw new Error('The DISCORD_TOKEN environment variable is required.');
}
if (!appID) {
  throw new Error(
    'The DISCORD_APPLICATION_ID environment variable is required.',
  );
}

const url = `https://discord.com/api/v10/applications/${appID}/commands`;

async function registerCommands() {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${token}`,
      },
      method: 'PUT',
      body: JSON.stringify(Object.keys(commands).map((key) => commands[key])),
    });

    if (response.ok) {
      console.log('Commands registered');
      const data = await response.json();
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.error('Error registering commands');
      let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`;
      try {
        const error = await response.text();
        if (error) {
          errorText = `${errorText} \n\n ${error}`;
        }
      } catch (err) {
        console.error('Error reading body from request:', err);
      }
      console.error(errorText);
    }
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
}

registerCommands();
