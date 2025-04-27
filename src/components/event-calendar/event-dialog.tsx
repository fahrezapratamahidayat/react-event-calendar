'use client';
import { useEffect, useState, memo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventTrigger } from '@/components/event-trigger';
import { DateSelector } from '@/components/date-selector';
import { TimeSelector } from '@/components/time-selector';
import { ColorOptionItem } from '@/components/color-option-item';
import { DeleteAlert } from '@/components/delete-alert';
import { FormFooter } from '@/components/form-footer';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { id } from 'date-fns/locale';
import type { FormatOptions, Locale } from 'date-fns';
import { EventTypes } from '@/types/event';
import { generateTimeOptions } from '@/lib/date-fns';
import { CATEGORY_OPTIONS, EVENT_COLORS } from '@/constants/event-options';

const DEFAULT_START_TIME = '09:00';
const DEFAULT_END_TIME = '10:00';
const DEFAULT_COLOR = '#2196F3';
const DEFAULT_CATEGORY = 'workshop';

const validateTimeDifference = (data: {
  startTime: string;
  endTime: string;
}): boolean => {
  const startHour = parseInt(data.startTime.split(':')[0]);
  const endHour = parseInt(data.endTime.split(':')[0]);
  return endHour > startHour;
};

const validateDateDifference = (data: {
  startDate: Date;
  endDate: Date;
}): boolean => {
  return data.startDate.getTime() !== data.endDate.getTime();
};

const eventFormSchema = z
  .object({
    title: z.string().min(1, { message: 'Judul acara wajib diisi' }),
    description: z.string().optional(),
    startDate: z.date({ required_error: 'Tanggal wajib diisi' }),
    endDate: z.date({ required_error: 'Tanggal wajib diisi' }),
    category: z.string({ required_error: 'Kategori wajib diisi' }),
    startTime: z.string({ required_error: 'Waktu mulai wajib diisi' }),
    endTime: z.string({ required_error: 'Waktu selesai wajib diisi' }),
    location: z.string().min(1, { message: 'Lokasi wajib diisi' }),
    color: z.string(),
    eventType: z.enum(['day', 'week']),
  })
  .refine(validateTimeDifference, {
    message: 'Waktu selesai harus lebih besar dari waktu mulai',
    path: ['endTime'],
  })
  .refine(validateDateDifference, {
    message: 'Tanggal selesai harus berbeda dengan tanggal mulai',
    path: ['endDate'],
  });

type EventFormValues = z.infer<typeof eventFormSchema>;

const DEFAULT_FORM_VALUES: EventFormValues = {
  title: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  category: DEFAULT_CATEGORY,
  startTime: DEFAULT_START_TIME,
  endTime: DEFAULT_END_TIME,
  location: '',
  color: DEFAULT_COLOR,
  eventType: 'day',
};

interface EventDialogProps {
  event: EventTypes;
  selectedEvent: EventTypes | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEventUpdate: (event: EventTypes) => void;
  onEventDelete: (eventId: string) => void;
  onEventClick: (event: EventTypes) => void;
  position?: {
    top: number;
    height: number;
    column: number;
    totalColumns: number;
    dayIndex?: number;
  };
  leftOffset?: number;
  rightOffset?: number;
  locale?: Locale;
  formatTimeString: (timeString: string, timeFormat: '12' | '24') => string;
  formatDateString: (
    date: Date,
    format: string,
    options?: FormatOptions,
  ) => string;
  timeFormat: '12' | '24';
  getEventDurationText?: (event: EventTypes) => string;
}

type EventDetailsFormProps = {
  form: UseFormReturn<EventFormValues>;
  onSubmit: (values: EventFormValues) => void;
  locale: Locale;
  timeOptions: { value: string; label: string }[];
};

function useIsMounted() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return isMounted;
}

/**
 * Convert any date representation to Date object
 * @param dateValue - Date value which could be string or Date
 * @returns {Date} - Date object
 */
function ensureDate(dateValue: Date | string | undefined): Date {
  if (!dateValue) return new Date();

  if (typeof dateValue === 'string') {
    try {
      return new Date(dateValue);
    } catch (e) {
      console.error('Error parsing date string:', e);
      return new Date();
    }
  }

  return dateValue;
}

/**
 * EventDetailsForm - Separated form component
 */
const EventDetailsForm = memo(
  ({ form, onSubmit, locale, timeOptions }: EventDetailsFormProps) => {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-5 px-2 py-3"
          data-testid="event-form"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Event Title <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan judul acara" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Short description of the event"
                    rows={3}
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <DateSelector
                  value={field.value}
                  onChange={field.onChange}
                  label="Start Date"
                  locale={locale}
                  required
                />
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <TimeSelector
                  value={field.value}
                  onChange={field.onChange}
                  options={timeOptions}
                  label="Start Time"
                  placeholder="Select start time"
                  required
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <DateSelector
                  value={field.value}
                  onChange={field.onChange}
                  label="End Date"
                  locale={locale}
                  required
                />
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <TimeSelector
                  value={field.value}
                  onChange={field.onChange}
                  options={timeOptions}
                  label="End Time"
                  placeholder="Select end time"
                  required
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Location <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="location event" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EVENT_COLORS.map((option) => (
                        <ColorOptionItem
                          key={option.value}
                          value={option.value}
                          label={option.label}
                        />
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    );
  },
);

/**
 * Custom hook to handle event dialog logic
 */
function useEventDialog({
  selectedEvent,
  onEventUpdate,
  onEventDelete,
  onOpenChange,
}: {
  selectedEvent: EventTypes | null;
  onEventUpdate: (event: EventTypes) => void;
  onEventDelete: (id: string) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<boolean>(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  // Update form when selected event changes
  useEffect(() => {
    if (selectedEvent) {
      try {
        // Convert dates safely
        const startDate = ensureDate(selectedEvent.startDate);
        const endDate = ensureDate(selectedEvent.endDate);

        form.reset({
          title: selectedEvent.title || '',
          description: selectedEvent.description || '',
          startDate,
          endDate,
          category: selectedEvent.category || DEFAULT_CATEGORY,
          startTime: selectedEvent.startTime || DEFAULT_START_TIME,
          endTime: selectedEvent.endTime || DEFAULT_END_TIME,
          location: selectedEvent.location || '',
          color: selectedEvent.color || DEFAULT_COLOR,
        });
      } catch (error) {
        console.error('Error resetting form with event data:', error);
        toast.error('Terjadi kesalahan saat memuat data acara');
      }
    }
  }, [selectedEvent, form]);

  // Form submission handler
  const handleSubmit = async (values: EventFormValues) => {
    if (!selectedEvent) return;

    try {
      setIsSubmitting(true);

      const updatedEvent: EventTypes = {
        ...selectedEvent,
        title: values.title,
        description: values.description || '',
        startDate: values.startDate,
        endDate: values.endDate,
        startTime: values.startTime,
        endTime: values.endTime,
        location: values.location,
        category: values.category,
        color: values.color,
      };

      await onEventUpdate(updatedEvent);
      onOpenChange(false);
      toast.success('Acara berhasil diubah');
    } catch (error) {
      console.error('Error updating event:', error);

      // Specific error messages based on error type
      if (error instanceof Error) {
        toast.error(`Gagal mengubah acara: ${error.message}`);
      } else {
        toast.error('Gagal mengubah acara');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete event handler
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      await onEventDelete(selectedEvent.id);
      onOpenChange(false);
      setIsDeleteAlertOpen(false);
      toast.success('Acara berhasil dihapus');
    } catch (error) {
      console.error('Error deleting event:', error);

      // Specific error messages based on error type
      if (error instanceof Error) {
        toast.error(`Gagal menghapus acara: ${error.message}`);
      } else {
        toast.error('Gagal menghapus acara');
      }
    }
  };

  return {
    form,
    isSubmitting,
    isDeleteAlertOpen,
    setIsDeleteAlertOpen,
    handleSubmit,
    handleDeleteEvent,
  };
}

EventDetailsForm.displayName = 'EventDetailsForm';

export default function EventDialog({
  event,
  isOpen,
  onOpenChange,
  selectedEvent,
  onEventUpdate,
  onEventDelete,
  position,
  locale = id,
  leftOffset,
  rightOffset,
  onEventClick,
  formatTimeString,
  timeFormat,
  getEventDurationText,
}: EventDialogProps) {
  const isMounted = useIsMounted();

  const {
    form,
    isSubmitting,
    isDeleteAlertOpen,
    setIsDeleteAlertOpen,
    handleSubmit,
    handleDeleteEvent,
  } = useEventDialog({
    selectedEvent,
    onEventUpdate,
    onEventDelete,
    onOpenChange,
  });

  const timeOptions = generateTimeOptions();

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog
      key={event.id}
      open={isOpen && selectedEvent?.id === event.id}
      onOpenChange={onOpenChange}
      data-testid="event-dialog"
    >
      <EventTrigger
        event={event}
        onEventClick={onEventClick}
        formatTimeString={formatTimeString}
        timeFormat={timeFormat}
        getEventDurationText={getEventDurationText}
        position={position}
        leftOffset={leftOffset}
        rightOffset={rightOffset}
      />
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
          <DialogDescription>Event details {event.title}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[350px] w-full pr-4 sm:h-[500px] sm:pr-0">
          <EventDetailsForm
            form={form}
            onSubmit={handleSubmit}
            locale={locale}
            timeOptions={timeOptions}
          />
        </ScrollArea>
        <DialogFooter className="mt-2 flex flex-row">
          <DeleteAlert
            isOpen={isDeleteAlertOpen}
            onOpenChange={setIsDeleteAlertOpen}
            onConfirm={handleDeleteEvent}
          />
          <FormFooter
            onCancel={() => onOpenChange(false)}
            onSave={form.handleSubmit(handleSubmit)}
            isSubmitting={isSubmitting}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
