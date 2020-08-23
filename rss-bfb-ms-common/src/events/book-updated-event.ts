import { Subjects } from './subjects';

export interface BookUpdatedEvent {
  subject: Subjects.BookUpdated;
  data: {
    price: number;
    store: {
      storeId: string;
    };
  };
}
