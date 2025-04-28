// src/hooks/use-event-dialog-store.ts
import { create } from 'zustand';
import { EventTypes } from '@/types/event';
import { Locale, format } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatTime } from '@/lib/date-fns';
import { toast } from 'sonner';

interface EventPosition {
  top: number;
  height: number;
  column: number;
  totalColumns: number;
  dayIndex?: number;
}

interface EventDialogState {
  selectedEvent: EventTypes | null;
  isDialogOpen: boolean;
  position: EventPosition | null;
  leftOffset?: number;
  rightOffset?: number;
  locale: Locale;
  timeFormat: '12' | '24';
  onEventUpdate: ((event: EventTypes) => Promise<void>) | null;
  onEventDelete: ((eventId: string) => Promise<void>) | null;
  isSubmitting: boolean;

  // Actions
  openEventDialog: (
    event: EventTypes,
    position?: EventPosition,
    leftOffset?: number,
    rightOffset?: number,
    onEventUpdate?: (event: EventTypes) => Promise<void>,
    onEventDelete?: (eventId: string) => Promise<void>,
  ) => void;
  closeEventDialog: () => void;
  updateEvent: (event: EventTypes) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  setLocale: (locale: Locale) => void;
  setTimeFormat: (format: '12' | '24') => void;

  // Format helpers
  formatTimeString: (timeString: string, timeFormat: '12' | '24') => string;
  formatDateString: (date: Date, formatStr: string) => string;
  getEventDurationText: (event: EventTypes) => string;
}

// Calculate duration between start and end time
const calculateEventDuration = (startTime: string, endTime: string): number => {
  const start = parseInt(startTime.split(':')[0]);
  const end = parseInt(endTime.split(':')[0]);
  return end - start;
};

export const useEventDialogStore = create<EventDialogState>((set, get) => ({
  selectedEvent: null,
  isDialogOpen: false,
  position: null,
  leftOffset: undefined,
  rightOffset: undefined,
  locale: id,
  timeFormat: '24',
  onEventUpdate: null,
  onEventDelete: null,
  isSubmitting: false,

  openEventDialog: (
    event,
    position,
    leftOffset = undefined,
    rightOffset = undefined,
    onEventUpdate = undefined,
    onEventDelete = undefined,
  ) =>
    set({
      selectedEvent: event,
      position,
      leftOffset,
      rightOffset,
      isDialogOpen: true,
      onEventUpdate: onEventUpdate || null,
      onEventDelete: onEventDelete || null,
    }),

  closeEventDialog: () => set({ isDialogOpen: false, selectedEvent: null }),

  updateEvent: async (event) => {
    const { onEventUpdate } = get();
    if (!onEventUpdate) return;

    set({ isSubmitting: true });
    try {
      await onEventUpdate(event);
      set({ isDialogOpen: false });
      toast.success('Acara berhasil diubah');
    } catch (error) {
      console.error('Error updating event:', error);
      if (error instanceof Error) {
        toast.error(`Gagal mengubah acara: ${error.message}`);
      } else {
        toast.error('Gagal mengubah acara');
      }
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteEvent: async (eventId) => {
    const { onEventDelete } = get();
    if (!onEventDelete) return;

    set({ isSubmitting: true });
    try {
      await onEventDelete(eventId);
      set({ isDialogOpen: false });
      toast.success('Acara berhasil dihapus');
    } catch (error) {
      console.error('Error deleting event:', error);
      if (error instanceof Error) {
        toast.error(`Gagal menghapus acara: ${error.message}`);
      } else {
        toast.error('Gagal menghapus acara');
      }
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  setLocale: (locale) => set({ locale }),
  setTimeFormat: (timeFormat) => set({ timeFormat }),

  // Utility functions
  formatTimeString: (timeString, timeFormat) =>
    formatTime(timeString, timeFormat),
  formatDateString: (date, formatStr) => format(date, formatStr),
  getEventDurationText: (event) => {
    const duration = calculateEventDuration(event.startTime, event.endTime);
    return `${duration} jam`;
  },
}));
