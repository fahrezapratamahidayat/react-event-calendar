export interface EventTypes {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  isRepeating?: boolean;
  repeatingType?: 'daily' | 'weekly' | 'monthly';
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}
