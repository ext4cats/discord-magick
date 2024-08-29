import { ImageCommand } from './image-command.js';
import { toJPG } from './processing/to-jpg.js';

export enum CommandType {
  ChatCommand = 1, // Slash command
  UserCommand = 2, // Appears on right click on user
  MessageCommand = 3, // Appears on right click on message
}

export type ImageProcessor = (imageData: ArrayBuffer) => Promise<ArrayBuffer>;

export const commands: Record<string, ImageCommand> = {
  'To JPG': new ImageCommand('To JPG', toJPG),
};
