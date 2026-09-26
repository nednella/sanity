import { create } from "zustand";

export type Media = {
  alt: string;
  src: string;
};

type MediaState = {
  media: Media | null;
};

type MediaActions = {
  closeMedia: () => void;
  showMedia: (media: Media) => void;
};

export const useMediaStore = create<MediaState & MediaActions>()((set) => ({
  media: null,
  closeMedia: () => set({ media: null }),
  showMedia: (media) => set({ media })
}));
