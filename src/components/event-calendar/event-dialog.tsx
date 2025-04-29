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
import { DateSelector } from '@/components/event-calendar/ui/date-selector';
import { TimeSelector } from '@/components/event-calendar/ui/time-selector';
import { ColorOptionItem } from '@/components/event-calendar/ui/color-option-item';
import { DeleteAlert } from '@/components/event-calendar/ui/delete-alert';
import { FormFooter } from '@/components/event-calendar/ui/form-footer';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Locale } from 'date-fns';
import { EventTypes } from '@/types/event';
import { generateTimeOptions } from '@/lib/date';
import { CATEGORY_OPTIONS, EVENT_COLORS } from '@/constants/event-options';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';

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

EventDetailsForm.displayName = 'EventDetailsForm';

export default function EventDialog() {
  const {
    selectedEvent,
    isDialogOpen,
    closeEventDialog,
    updateEvent,
    deleteEvent,
    locale,
    isSubmitting,
  } = useEventCalendarStore();

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<boolean>(false);
  const isMounted = useIsMounted();
  const timeOptions = generateTimeOptions();

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
          eventType: 'day',
        });
      } catch (error) {
        console.error('Error resetting form with event data:', error);
      }
    }
  }, [selectedEvent, form]);

  const handleSubmit = async (values: EventFormValues) => {
    if (!selectedEvent) return;

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

    await updateEvent(updatedEvent);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    await deleteEvent(selectedEvent.id);
    setIsDeleteAlertOpen(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={closeEventDialog}
      data-testid="event-dialog"
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
          <DialogDescription>
            Event details {selectedEvent?.title}
          </DialogDescription>
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
            onCancel={closeEventDialog}
            onSave={form.handleSubmit(handleSubmit)}
            isSubmitting={isSubmitting}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
