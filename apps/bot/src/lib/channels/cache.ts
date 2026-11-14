import { api } from "@/lib/api";

import type { ChannelIntent } from "./channels";

class ChannelCache {
  #channelIds = new Map<string, string>();
  #isLoaded = false;

  async load() {
    const channels = await api.get("/v1/discord/channels");
    this.#channelIds = new Map(channels.map(({ channelId, purpose }) => [purpose, channelId]));
    this.#isLoaded = true;
  }

  async channels(): Promise<ReadonlyMap<string, string>> {
    // Populate the cache on first read if not already done for whatever reason
    if (!this.#isLoaded) await this.load();
    return this.#channelIds;
  }

  async channelId(intent: ChannelIntent) {
    const channels = await this.channels();
    return channels.get(intent);
  }

  clearChannel(intent: ChannelIntent) {
    this.#channelIds.delete(intent);
  }

  setChannel(intent: ChannelIntent, channelId: string) {
    this.#channelIds.set(intent, channelId);
  }
}

export const channelCache = new ChannelCache();
