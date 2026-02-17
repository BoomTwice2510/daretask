// src/lib/flash-template-store.ts
"use client";

import { create } from "zustand";
import type { FlashTaskTemplate, FlashTaskCategory } from "./flash-templates";

export interface FlashTemplatePayload {
  template: FlashTaskTemplate;
  category: FlashTaskCategory;
}

interface FlashTemplateState {
  pending: FlashTemplatePayload | null;
  setPending: (payload: FlashTemplatePayload) => void;
  consumePending: () => FlashTemplatePayload | null;
}

export const useFlashTemplateStore = create<FlashTemplateState>((set, get) => ({
  pending: null,
  setPending: (payload) => set({ pending: payload }),
  consumePending: () => {
    const current = get().pending;
    if (current) {
      set({ pending: null });
    }
    return current;
  },
}));
