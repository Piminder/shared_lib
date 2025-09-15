import axios from "axios";

interface Embed {
  title: string;
  description: string;
}

class Discord {
  private bot_token: string;
  private url: string;
  private version: string;
  private _url: string;

  constructor(params: { bot_token: string; url: string; version: string }) {
    this.bot_token = params.bot_token;
    this.url = params.url;
    this.version = params.version;
    this._url = `${this.url}/v${this.version}`;
  }

  async send_message(
    msg: string,
    options: { channel_id: string; embed?: Embed },
  ): Promise<any> {
    const { channel_id, embed } = options;

    const message_data = {
      content: msg,
      tts: false,
      embeds: embed
        ? [
            {
              title: embed.title,
              description: embed.description,
            },
          ]
        : [],
    };

    const channel_url = `${this._url}/channels/${channel_id}/messages`;

    const response = await axios.post(channel_url, message_data, {
      headers: {
        Authorization: `Bot ${this.bot_token}`,
        "User-Agent": `DiscordBot (${this.url}, 9)`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  }

  get base_url(): string {
    return this._url;
  }
}

export { Discord };
export type { Embed };
