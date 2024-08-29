import { Blob } from 'node:buffer';
import { DiscordResponse } from './discord/discord-response.js';
import { CommandType, ImageProcessor } from './commands.js';

export class ImageCommand {
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
    const blob: Blob = await response.blob();
    return blob.arrayBuffer();
  }

  async execute(imageURLs: string[]): Promise<DiscordResponse> {
    try {
      for (const url of imageURLs) {
        const arrayBuffer = await this.fetchImage(url);
        const processedBuffer = await this.process(arrayBuffer);
        console.log(`Processed buffer: ${processedBuffer}`);
      }

      // Figure out how to embed file in DiscordResponse
      // https://github.com/discord/discord-api-docs/discussions/6204
      // https://discord.com/developers/docs/reference#uploading-files
      return new DiscordResponse({
        type: 4,
        data: { content: imageURLs.join(' ') },
      });
    } catch (error) {
      console.error(error);
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
