import { Interaction } from './interaction.js';

export function getAttachmentURLs(interaction: Interaction): string[] {
  const messageId = interaction.data.target_id;
  const message = interaction.data.resolved.messages[messageId];
  const attachmentUrls = message.attachments.map(
    (attachment) => attachment.url,
  );
  return attachmentUrls || [];
}
