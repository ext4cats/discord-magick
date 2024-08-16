interface Attachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  content_type?: string;
}

interface Message {
  attachments: Attachment[];
}

export default interface Interaction {
  type: number;
  data: {
    target_id: string;
    name: string;
    resolved: {
      messages: Record<string, Message>;
    };
  };
}
