import { format, FormatOptions } from 'date-fns';

export const formatTime = (timeString: string, timeFormat: '12' | '24') => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);

  if (timeFormat === '12') {
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  } else {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
};

export const formatDate = (
  date: Date,
  formatStr: string,
  options?: FormatOptions,
) => {
  return format(date, formatStr, options);
};

export const generateTimeOptions = () => {
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      timeOptions.push({
        value: formattedTime,
        label: formattedTime,
      });
    }
  }
  return timeOptions;
};

export const formatTimeDisplay = (
  hours: number,
  minute: number,
  timeFormat: '12' | '24',
) => {
  if (timeFormat === '12') {
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
  } else {
    return `${hours.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}`;
  }
};
