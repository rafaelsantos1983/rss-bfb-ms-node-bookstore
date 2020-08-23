import { Publisher, Subjects, BookUpdatedEvent } from '@rss/rss-bfb-ms-common';

export class BookUpdatedPublisher extends Publisher<BookUpdatedEvent> {
  subject: Subjects.BookUpdated = Subjects.BookUpdated;
}
