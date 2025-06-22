'use client';

import React from 'react';
import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';

export default function EventManagementDocPage() {
  return (
    <div className="space-y-16">
      <div className="space-y-6">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Event Management
        </h1>
        <p className="text-muted-foreground mb-6 text-xl leading-7">
          Create, edit, delete, and manage calendar events with React Event
          Calendar.
        </p>
      </div>

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
            making it intuitive for users to schedule activities.
          </p>

          <h3 className="mb-3 text-xl font-semibold">Click to Create</h3>
          <p className="mb-4 leading-7">
            Users can click on any time slot in Day, Week, or Days views to
            create a new event at that specific time.
          </p>

          <h3 className="mt-6 mb-3 text-xl font-semibold">Quick Add Dialog</h3>
          <p className="mb-4 leading-7">
            The Quick Add dialog allows users to create events with minimal
            information:
          </p>

          <CodeBlock
            language="tsx"
            filename="components/event-calendar/event-form.tsx"
            code={`import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { QuickAddDialog } from '@/components/event-calendar/quick-add-dialog';

// Open the Quick Add dialog
useEventCalendarStore.getState().openQuickAddDialog({
  date: new Date(),
  startTime: '09:00',
  endTime: '10:00',
});

// Render the dialog component
<QuickAddDialog />`}
          />

          <h3 className="mt-6 mb-3 text-xl font-semibold">Full Event Form</h3>
          <p className="mb-4 leading-7">
            For more detailed event creation, the full event form allows users
            to specify all event properties:
          </p>

          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">Title and description</li>
            <li className="leading-7">Start and end dates/times</li>
            <li className="leading-7">Location</li>
            <li className="leading-7">Category</li>
            <li className="leading-7">Color</li>
            <li className="leading-7">Recurring options</li>
          </ul>

          <CodeBlock
            language="tsx"
            filename="components/event-calendar/event-form.tsx"
            code={`import { EventForm } from '@/components/event-calendar/event-form';
import { createEvent } from '@/app/actions';

// Example of rendering the event form
<EventForm
  mode="create"
  onSubmit={async (data) => {
    const result = await createEvent(data);
    if (result.success) {
      // Handle success
    }
  }}
  defaultValues={{
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    category: 'Meeting',
    color: '#3b82f6',
    isRepeating: false,
  }}
/>`}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="event-editing"
          >
            Editing Events
          </h2>
          <p className="mb-4 leading-7">
            Events can be edited in several ways to provide flexibility and
            convenience.
          </p>

          <h3 className="mb-3 text-xl font-semibold">Click to Edit</h3>
          <p className="mb-4 leading-7">
            Users can click on any existing event to open the event dialog,
            which displays event details and provides edit options.
          </p>

          <h3 className="mt-6 mb-3 text-xl font-semibold">Drag and Resize</h3>
          <p className="mb-4 leading-7">
            In Day, Week, and Days views, events can be:
          </p>

          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">Dragged to a different time or day</li>
            <li className="leading-7">Resized to change the duration</li>
          </ul>

          <CodeBlock
            language="tsx"
            filename="components/event-calendar/event-item.tsx"
            code={`import { EventItem } from '@/components/event-calendar/event-item';
import { updateEvent } from '@/app/actions';
import { EventTypes } from '@/db/schema';

// Example of rendering a draggable event item
<EventItem
  event={event}
  isDraggable={true}
  isResizable={true}
  onDragEnd={async (updatedEvent: EventTypes) => {
    const result = await updateEvent(updatedEvent.id, {
      startDate: updatedEvent.startDate,
      endDate: updatedEvent.endDate,
      startTime: updatedEvent.startTime,
      endTime: updatedEvent.endTime,
    });
  }}
  onResizeEnd={async (updatedEvent: EventTypes) => {
    const result = await updateEvent(updatedEvent.id, {
      endDate: updatedEvent.endDate,
      endTime: updatedEvent.endTime,
    });
  }}
/>`}
          />

          <h3 className="mt-6 mb-3 text-xl font-semibold">Edit Form</h3>
          <p className="mb-4 leading-7">
            The same form used for creating events can be used for editing, with
            pre-filled values:
          </p>

          <CodeBlock
            language="tsx"
            filename="components/event-calendar/event-form.tsx"
            code={`import { EventForm } from '@/components/event-calendar/event-form';
import { updateEvent } from '@/app/actions';
import { EventTypes } from '@/db/schema';

// Example of rendering the event form in edit mode
<EventForm
  mode="edit"
  onSubmit={async (data) => {
    const result = await updateEvent(event.id, data);
    if (result.success) {
      // Handle success
    }
  }}
  defaultValues={{
    title: event.title,
    description: event.description,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    category: event.category,
    color: event.color,
    isRepeating: event.isRepeating,
    repeatingType: event.repeatingType,
  }}
/>`}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="event-deletion"
          >
            Deleting Events
          </h2>
          <p className="mb-4 leading-7">
            Events can be deleted individually or in bulk, with confirmation to
            prevent accidental deletion.
          </p>

          <h3 className="mb-3 text-xl font-semibold">Single Event Deletion</h3>
          <p className="mb-4 leading-7">To delete a single event, users can:</p>

          <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
            <li className="leading-7">
              Click on the event to open the event dialog
            </li>
            <li className="leading-7">Click the delete button</li>
            <li className="leading-7">Confirm the deletion</li>
          </ol>

          <CodeBlock
            language="tsx"
            filename="components/event-calendar/event-dialog.tsx"
            code={`import { deleteEvent } from '@/app/actions';

// Example of handling event deletion
const handleDeleteEvent = async (eventId: string) => {
  if (confirm('Are you sure you want to delete this event?')) {
    const result = await deleteEvent(eventId);
    if (result.success) {
      // Handle successful deletion
      toast.success('Event deleted successfully');
    } else {
      // Handle error
      toast.error('Failed to delete event');
    }
  }
};`}
          />

          <Callout variant="warning" className="my-6">
            <p>
              Deleting recurring events requires special handling. Users should
              be asked whether they want to delete just the selected occurrence
              or the entire series.
            </p>
          </Callout>
        </section>

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
            language="tsx"
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

    const {
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      category,
      color,
      isRepeating,
      repeatingType,
    } = validatedFields.data;

    const startDateTime = combineDateAndTime(startDate, startTime);
    const endDateTime = combineDateAndTime(endDate, endTime);

    await db.insert(events).values({
      title,
      description,
      startDate: startDateTime,
      endDate: endDateTime,
      startTime,
      endTime,
      location,
      category,
      color,
      isRepeating: isRepeating ?? false,
      repeatingType: repeatingType ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error creating event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create event',
    };
  }
}`}
          />

          <h3 className="mt-6 mb-3 text-xl font-semibold">Update Event</h3>
          <CodeBlock
            language="tsx"
            filename="app/actions.ts"
            code={`export async function updateEvent(
  id: string,
  values: Partial<z.infer<typeof createEventSchema>>,
) {
  try {
    const validatedFields = createEventSchema.partial().safeParse(values);

    if (!validatedFields.success) {
      return {
        error: 'Invalid fields',
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const existingEvent = await db
      .select()
      .from(events)
      .where(and(eq(events.id, id)))
      .limit(1);

    if (!existingEvent.length) {
      throw new Error('Event not found or unauthorized');
    }

    await db
      .update(events)
      .set({
        ...validatedFields.data,
        updatedAt: new Date(),
      })
      .where(and(eq(events.id, id)));

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update event',
    };
  }
}`}
          />

          <h3 className="mt-6 mb-3 text-xl font-semibold">Delete Event</h3>
          <CodeBlock
            language="tsx"
            filename="app/actions.ts"
            code={`export async function deleteEvent(id: string) {
  try {
    const existingEvent = await db
      .select()
      .from(events)
      .where(and(eq(events.id, id)))
      .limit(1);

    if (!existingEvent.length) {
      throw new Error('Event not found or unauthorized');
    }

    await db.delete(events).where(and(eq(events.id, id)));

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete event',
    };
  }
}`}
          />
        </section>

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
            language="tsx"
            filename="lib/validations.ts"
            code={`import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:MM format',
  }),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:MM format',
  }),
  location: z.string().optional(),
  category: z.string().optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Color must be a valid hex color code',
  }).optional(),
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

          <p className="mt-6 leading-7">This validation schema ensures that:</p>

          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">
              Events have required fields (title, dates, times)
            </li>
            <li className="leading-7">Time formats are valid (HH:MM)</li>
            <li className="leading-7">Colors are valid hex codes</li>
            <li className="leading-7">
              End date/time is after start date/time
            </li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="event-display"
          >
            Event Display
          </h2>
          <p className="mb-4 leading-7">
            Events are displayed differently depending on the calendar view:
          </p>

          <h3 className="mb-3 text-xl font-semibold">Day/Week View</h3>
          <p className="mb-4 leading-7">
            In time-based views, events are positioned according to their start
            and end times, with proper handling for:
          </p>

          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">Overlapping events</li>
            <li className="leading-7">All-day events</li>
            <li className="leading-7">Multi-day events</li>
          </ul>

          <h3 className="mt-6 mb-3 text-xl font-semibold">Month View</h3>
          <p className="mb-4 leading-7">
            In month view, events are displayed as compact bars with:
          </p>

          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">
              Color coding based on event category or custom color
            </li>
            <li className="leading-7">Truncated titles for space efficiency</li>
            <li className="leading-7">
              &quot;More events&quot; indicator when there are too many to
              display
            </li>
            <li className="leading-7">Proper spanning for multi-day events</li>
          </ul>

          <CodeBlock
            language="tsx"
            filename="components/event-calendar/event-item.tsx"
            code={`import { cn } from '@/lib/utils';
import { EventTypes } from '@/db/schema';

interface EventItemProps {
  event: EventTypes;
  view: CalendarViewType;
  // Other props
}

export function EventItem({ event, view }: EventItemProps) {
  // Different rendering based on view type
  if (view === CalendarViewType.MONTH) {
    return (
      <div
        className={cn(
          'rounded-sm px-2 py-1 text-xs font-medium',
          'truncate overflow-hidden',
        )}
        style={{ backgroundColor: event.color + '40', borderLeft: \`3px solid \${event.color}\` }}
      >
        {event.title}
      </div>
    );
  }

  // Day/Week view rendering with proper positioning
  return (
    <div
      className={cn(
        'absolute rounded-md px-2 py-1',
        'flex flex-col overflow-hidden',
      )}
      style={{
        backgroundColor: event.color + '40',
        borderLeft: \`3px solid \${event.color}\`,
        top: \`\${topPosition}px\`,
        height: \`\${eventHeight}px\`,
        left: \`\${leftPosition}%\`,
        width: \`\${widthPercentage}%\`,
      }}
    >
      <div className="font-medium">{event.title}</div>
      {showTime && (
        <div className="text-xs opacity-80">
          {formatTime(event.startTime)} - {formatTime(event.endTime)}
        </div>
      )}
    </div>
  );
}`}
          />
        </section>
      </div>

      <div className="mt-10 space-y-6 border-t pt-10">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
          Next Steps
        </h2>
        <p className="text-muted-foreground leading-7">
          Now that you understand event management, learn about:
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-3">
          <li>
            <a
              href="/docs/features/recurring-events"
              className="text-primary font-medium hover:underline"
            >
              Recurring Events
            </a>{' '}
            - Setting up daily, weekly, and monthly recurring events
          </li>
          <li>
            <a
              href="/docs/features/filtering"
              className="text-primary font-medium hover:underline"
            >
              Event Filtering
            </a>{' '}
            - Filtering events by category, color, or custom criteria
          </li>
          <li>
            <a
              href="/docs/features/drag-and-drop"
              className="text-primary font-medium hover:underline"
            >
              Drag and Drop
            </a>{' '}
            - Advanced event interaction capabilities
          </li>
        </ul>
      </div>
    </div>
  );
}
