import { eventFormSchema } from '@/lib/validations';
import { Locale } from 'date-fns';
import { memo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { DateSelector } from './ui/date-selector';
import { TimeSelector } from './ui/time-selector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { CATEGORY_OPTIONS, EVENT_COLORS } from '@/constants/calendar-constant';
import { ColorOptionItem } from './ui/color-option-item';
import { z } from 'zod';
import { getColorClasses } from '@/lib/event';

type EventFormValues = z.infer<typeof eventFormSchema>;

type EventDetailsFormProps = {
  form: UseFormReturn<EventFormValues>;
  onSubmit: (values: EventFormValues) => void;
  locale: Locale;
};

export const EventDetailsForm = memo(
  ({ form, onSubmit, locale }: EventDetailsFormProps) => {
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
                  <Input placeholder="Enter event title" {...field} />
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
                  label="Start Time"
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
                  label="End Time"
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
                    <Input placeholder="Location event" {...field} />
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
                      {EVENT_COLORS.map((option) => {
                        const validColor = getColorClasses(option.value);
                        return (
                          <ColorOptionItem
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            className={validColor.bg}
                          />
                        );
                      })}
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
