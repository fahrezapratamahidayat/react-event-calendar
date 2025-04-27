// src/store/use-event-dialog-store.ts
import { create } from 'zustand';
import { EventTypes } from '@/types/event';
import { Locale } from 'date-fns';
import { id } from 'date-fns/locale';

interface EventPosition {
  top: number;
  height: number;
  column: number;
  totalColumns: number;
  dayIndex?: number;
  leftOffset?: number;
  rightOffset?: number;
}

interface EventDialogState {
  selectedEvent: EventTypes | null;
  isDialogOpen: boolean;
  eventPosition: EventPosition | null;
  locale: Locale;
  timeFormat: '12' | '24';

  // Actions
  openEventDialog: (event: EventTypes, position?: EventPosition) => void;
  closeEventDialog: () => void;
  updateEvent: (
    event: EventTypes,
    onUpdate: (event: EventTypes) => Promise<void>,
  ) => Promise<EventTypes>;
  deleteEvent: (
    eventId: string,
    onDelete: (eventId: string) => Promise<void>,
  ) => Promise<string>;
  setLocale: (locale: Locale) => void;
  setTimeFormat: (format: '12' | '24') => void;
}

export const useEventDialogStore = create<EventDialogState>((set) => ({
  selectedEvent: null,
  isDialogOpen: false,
  eventPosition: null,
  locale: id,
  timeFormat: '24',

  openEventDialog: (event, position = undefined) =>
    set({
      selectedEvent: event,
      eventPosition: position,
      isDialogOpen: true,
    }),

  closeEventDialog: () => set({ isDialogOpen: false }),

  updateEvent: async (event, onUpdate) => {
    try {
      await onUpdate(event);
      return event;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  deleteEvent: async (eventId, onDelete) => {
    try {
      await onDelete(eventId);
      set({ isDialogOpen: false });
      return eventId;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  setLocale: (locale) => set({ locale }),
  setTimeFormat: (timeFormat) => set({ timeFormat }),
}));
