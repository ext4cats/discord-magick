import DiscordResponse from './discord/discordResponse.js';
import toJPG from './processing/toJPG.js';

enum CommandType {
  ChatCommand = 1, // Slash command
  UserCommand = 2, // Appears on right click on user
  MessageCommand = 3, // Appears on right click on message
}

type ImageProcessor = (imageData: ArrayBuffer) => Promise<ArrayBuffer>;

class ImageCommand {
  name: string;
  type = CommandType.MessageCommand;
  process: ImageProcessor;

  constructor(name: string, processingFunction: ImageProcessor) {
    this.name = name;
    this.process = processingFunction;
  }

  private async fetchImage(imageURL: string): Promise<ArrayBuffer> {
    const response = await fetch(imageURL, {
      headers: {
        'X-Source': 'Cloudflare-Workers',
      },
    });
    if (!response.ok) {
      return Promise.reject(`Failed to fetch image from URL ${imageURL}`);
    }
    const blob = await response.blob();
    return blob.arrayBuffer();
  }

  async execute(imageURLs: string[]): Promise<DiscordResponse> {
    try {
      for (const url of imageURLs) {
        const arrayBuffer = await this.fetchImage(url);
        const processedBuffer = await this.process(arrayBuffer);

        console.log('Processed buffer:');
        console.log(processedBuffer);
      }

      // Figure out how to embed file in DiscordResponse
      // https://github.com/discord/discord-api-docs/discussions/6204
      // Would probably be better to construct DiscordResponse in main.ts instead of here
      return new DiscordResponse({
        type: 4,
        data: { content: imageURLs.join(' ') },
      });
    } catch (error) {
      return new DiscordResponse({
        type: 4,
        data: {
          content: `Failed to process image(s): ${error instanceof Error ? error.message : 'unknown error'}`,
        },
      });
    }
  }

  toJSON(): object {
    return {
      name: this.name,
      type: this.type,
    };
  }
}

export const commands: Record<string, ImageCommand> = {
  'To JPG': new ImageCommand('To JPG', toJPG),
};
