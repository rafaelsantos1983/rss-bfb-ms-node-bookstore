import { Subjects } from './subjects';

export interface StoreCreatedEvent {
  subject: Subjects.StoreCreated;
  data: {
    id: string;
    version: number;
    name: string;
  };
}
