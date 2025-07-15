import React from 'react';
import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';
import { DocsHeader } from '@/components/docs/docs-header';
import { docsConfig } from '@/configs/docs';

export default function EventManagementDocPage() {
  return (
    <div className="space-y-16">
      <DocsHeader
        title="Event Management"
        description="Create, edit, delete, and manage calendar events with React Event Calendar."
        currentPath="/docs/features/event-management"
        config={docsConfig}
      />
      <div className="space-y-12">
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="event-creation"
          >
            Creating Events
          </h2>
          <p className="mb-4 leading-7">
            React Event Calendar provides multiple ways to create new events,
            making it intuitive for users to schedule activities. Clicking a
            time slot or the "Add Event" button opens the{' '}
            <strong>EventCreateDialog</strong>.
          </p>
          <p className="mb-4 leading-7">
            The full event form allows users to specify all event properties,
            including title, dates, location, recurring options, and more.
          </p>
          <CodeBlock
            language="tsx"
            filename="components/event-calendar/event-create-dialog.tsx"
            code={`'use client';

import { Button } from '@/components/ui/button';
import { useEventCalendarStore } from '@/hooks/use-event';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { EventDetailsForm } from './event-detail-form';
import { createEventSchema } from '@/lib/validations';
import { EVENT_DEFAULTS } from '@/constants/calendar-constant';
import { useShallow } from 'zustand/shallow';
import { toast } from 'sonner';
import { createEvent } from '@/app/actions';
import { getLocaleFromCode } from '@/lib/event';

type EventFormValues = z.infer<typeof createEventSchema>;

const DEFAULT_FORM_VALUES: EventFormValues = {
  title: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  category: EVENT_DEFAULTS.CATEGORY,
  startTime: EVENT_DEFAULTS.START_TIME,
  endTime: EVENT_DEFAULTS.END_TIME,
  location: '',
  color: EVENT_DEFAULTS.COLOR,
  isRepeating: false,
};

export default function EventCreateDialog() {
  const {
    isQuickAddDialogOpen,
    closeQuickAddDialog,
    timeFormat,
    locale,
    quickAddData,
  } = useEventCalendarStore(
    useShallow((state) => ({
      isQuickAddDialogOpen: state.isQuickAddDialogOpen,
      closeQuickAddDialog: state.closeQuickAddDialog,
      timeFormat: state.timeFormat,
      locale: state.locale,
      quickAddData: state.quickAddData,
    })),
  );
  const form = useForm<EventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const localeObj = getLocaleFromCode(locale);

  const handleSubmit = async (formValues: EventFormValues) => {
    setIsSubmitting(true);
    toast.promise(createEvent(formValues), {
      loading: 'Creating Event...',
      success: (result) => {
        if (!result.success) {
          throw new Error(result.error || 'Error Creating Event');
        }
        form.reset(DEFAULT_FORM_VALUES);
        setIsSubmitting(false);
        closeQuickAddDialog();
        return 'Event Succesfully created';
      },
      error: (error) => {
        console.error('Error:', error);
        return 'Oops! Something went wrong.';
      },
    });
  };

  useEffect(() => {
    if (isQuickAddDialogOpen && quickAddData.date) {
      form.reset({
        ...DEFAULT_FORM_VALUES,
        startDate: quickAddData.date,
        endDate: quickAddData.date,
        startTime: quickAddData.startTime,
        endTime: quickAddData.endTime,
      });
    }
  }, [isQuickAddDialogOpen, quickAddData, form]);

  return (
    <Dialog open={isQuickAddDialogOpen} onOpenChange={closeQuickAddDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="p-4">
            <EventDetailsForm form={form} timeFormat={timeFormat} locale={localeObj} />
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={closeQuickAddDialog}>Cancel</Button>
          <Button onClick={form.handleSubmit(handleSubmit)} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            Save Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`}
          />
        </section>

        <hr />

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="event-editing"
          >
            Editing Events
          </h2>
          <p className="mb-4 leading-7">
            To edit an event, users can click on it to open the{' '}
            <strong>EventDialog</strong>. This dialog comes pre-filled with the
            event's data, ready for modification.
          </p>
          <CodeBlock
            language="tsx"
            filename="components/event-calendar/event-dialog.tsx"
            code={`'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { DeleteAlert } from '@/components/event-calendar/ui/delete-alert';
import { FormFooter } from '@/components/event-calendar/ui/form-footer';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ensureDate } from '@/lib/date';
import { useEventCalendarStore } from '@/hooks/use-event';
import { eventFormSchema } from '@/lib/validations';
import { EventDetailsForm } from './event-detail-form';
import { toast } from 'sonner';
import { deleteEvent, updateEvent } from '@/app/actions';
import { useShallow } from 'zustand/shallow';
import { getLocaleFromCode } from '@/lib/event';

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function EventDialog() {
  const {
    locale,
    selectedEvent,
    isDialogOpen,
    closeEventDialog,
    isSubmitting,
  } = useEventCalendarStore(
    useShallow((state) => ({
      locale: state.locale,
      selectedEvent: state.selectedEvent,
      isDialogOpen: state.isDialogOpen,
      closeEventDialog: state.closeEventDialog,
      isSubmitting: state.isSubmitting,
    })),
  );
  const localeObj = getLocaleFromCode(locale);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<boolean>(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (selectedEvent) {
      const startDate = ensureDate(selectedEvent.startDate);
      const endDate = ensureDate(selectedEvent.endDate);
      form.reset({
        ...selectedEvent,
        startDate,
        endDate,
      });
    }
  }, [selectedEvent, form]);

  const handleUpdate = async (values: EventFormValues) => {
    if (!selectedEvent?.id) return;

    toast.promise(updateEvent(selectedEvent.id, values), {
      loading: 'Updating event...',
      success: (result) => {
        if (!result.success) throw new Error(result.error);
        closeEventDialog();
        return 'Event updated successfully!';
      },
      error: (err) => err.message || 'Oops! Something went wrong.',
    });
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent?.id) return;
    setIsDeleteAlertOpen(false);

    toast.promise(deleteEvent(selectedEvent.id), {
      loading: 'Deleting event...',
      success: (result) => {
        if (!result.success) throw new Error(result.error);
        closeEventDialog();
        return 'Event deleted successfully!';
      },
      error: (err) => err.message || 'Oops! Something went wrong.',
    });
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={closeEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="p-4">
              <EventDetailsForm form={form} locale={localeObj} />
            </div>
          </ScrollArea>
          <FormFooter
            onCancel={closeEventDialog}
            onDelete={() => setIsDeleteAlertOpen(true)}
            onSubmit={form.handleSubmit(handleUpdate)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      <DeleteAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirm={handleDeleteEvent}
      />
    </>
  );
}`}
          />
        </section>

        <hr />

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="event-deletion"
          >
            Deleting Events
          </h2>
          <p className="mb-4 leading-7">
            The same <strong>EventDialog</strong> provides the functionality to
            delete an event. A confirmation dialog is used to prevent accidental
            deletions.
          </p>
          <CodeBlock
            language="tsx"
            filename="components/event-calendar/event-dialog.tsx"
            code={`'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { DeleteAlert } from '@/components/event-calendar/ui/delete-alert';
import { FormFooter } from '@/components/event-calendar/ui/form-footer';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ensureDate } from '@/lib/date';
import { useEventCalendarStore } from '@/hooks/use-event';
import { eventFormSchema } from '@/lib/validations';
import { EventDetailsForm } from './event-detail-form';
import { toast } from 'sonner';
import { deleteEvent, updateEvent } from '@/app/actions';
import { useShallow } from 'zustand/shallow';
import { getLocaleFromCode } from '@/lib/event';

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function EventDialog() {
  const {
    locale,
    selectedEvent,
    isDialogOpen,
    closeEventDialog,
    isSubmitting,
  } = useEventCalendarStore(
    useShallow((state) => ({
      locale: state.locale,
      selectedEvent: state.selectedEvent,
      isDialogOpen: state.isDialogOpen,
      closeEventDialog: state.closeEventDialog,
      isSubmitting: state.isSubmitting,
    })),
  );
  const localeObj = getLocaleFromCode(locale);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<boolean>(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (selectedEvent) {
      const startDate = ensureDate(selectedEvent.startDate);
      const endDate = ensureDate(selectedEvent.endDate);
      form.reset({
        ...selectedEvent,
        startDate,
        endDate,
      });
    }
  }, [selectedEvent, form]);

  const handleUpdate = async (values: EventFormValues) => {
    if (!selectedEvent?.id) return;
    // ... update logic
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent?.id) return;
    setIsDeleteAlertOpen(false);

    toast.promise(deleteEvent(selectedEvent.id), {
      loading: 'Deleting event...',
      success: (result) => {
        if (!result.success) throw new Error(result.error);
        closeEventDialog();
        return 'Event deleted successfully!';
      },
      error: (err) => err.message || 'Oops! Something went wrong.',
    });
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={closeEventDialog}>
        <DialogContent>
          {/* ... Dialog Content for Editing */}
          <FormFooter
            onCancel={closeEventDialog}
            onDelete={() => setIsDeleteAlertOpen(true)}
            onSubmit={form.handleSubmit(handleUpdate)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      <DeleteAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirm={handleDeleteEvent}
      />
    </>
  );
}`}
          />
          <Callout variant="warning" className="my-6">
            <p>
              Deleting recurring events requires special handling. Users should
              be asked whether they want to delete just the selected occurrence
              or the entire series.
            </p>
          </Callout>
        </section>

        <hr />

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="server-actions"
          >
            Server Actions
          </h2>
          <p className="mb-4 leading-7">
            React Event Calendar uses Next.js Server Actions to handle event
            CRUD operations with the database.
          </p>
          <h3 className="mb-3 text-xl font-semibold">Create Event</h3>
          <CodeBlock
            language="typescript"
            filename="app/actions.ts"
            code={`'use server';

import { db } from '@/db';
import { events } from '@/db/schema';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createEventSchema } from '@/lib/validations';

export async function createEvent(values: z.infer<typeof createEventSchema>) {
  try {
    const validatedFields = createEventSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        error: 'Invalid fields',
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    await db.insert(events).values({
      ...validatedFields.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error creating event:', error);
    return {
      success: false,
      error: 'Failed to create event',
    };
  }
}`}
          />
          <h3 className="mt-6 mb-3 text-xl font-semibold">Update Event</h3>
          <CodeBlock
            language="typescript"
            filename="app/actions.ts"
            code={`export async function updateEvent(
  id: string,
  values: Partial<z.infer<typeof createEventSchema>>,
) {
  try {
    const validatedFields = createEventSchema.partial().safeParse(values);

    if (!validatedFields.success) {
      return { error: 'Invalid fields' };
    }

    await db
      .update(events)
      .set({
        ...validatedFields.data,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id));

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating event:', error);
    return { success: false, error: 'Failed to update event' };
  }
}`}
          />
          <h3 className="mt-6 mb-3 text-xl font-semibold">Delete Event</h3>
          <CodeBlock
            language="typescript"
            filename="app/actions.ts"
            code={`export async function deleteEvent(id: string) {
  try {
    await db.delete(events).where(eq(events.id, id));
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, error: 'Failed to delete event' };
  }
}`}
          />
        </section>

        <hr />

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="event-validation"
          >
            Event Validation
          </h2>
          <p className="mb-4 leading-7">
            React Event Calendar uses Zod for robust event validation, ensuring
            data integrity.
          </p>
          <CodeBlock
            language="typescript"
            filename="lib/validations.ts"
            code={`import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  location: z.string().optional(),
  category: z.string().optional(),
  color: z.string().optional(),
  isRepeating: z.boolean().optional(),
  repeatingType: z.enum(['daily', 'weekly', 'monthly']).optional(),
}).refine(
  (data) => {
    const start = new Date(\`\${data.startDate.toDateString()} \${data.startTime}\`);
    const end = new Date(\`\${data.endDate.toDateString()} \${data.endTime}\`);
    return end > start;
  },
  {
    message: 'End date/time must be after start date/time',
    path: ['endDate'],
  }
);`}
          />
        </section>
      </div>
    </div>
  );
}
