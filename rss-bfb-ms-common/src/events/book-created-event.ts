import { Subjects } from './subjects';

export interface BookCreatedEvent {
  subject: Subjects.BookCreated;
  data: {
    id: string;
    price: number;
    store: {
      storeId: string;
    };
  };
}
