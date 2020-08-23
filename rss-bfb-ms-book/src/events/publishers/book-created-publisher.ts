import { Publisher, Subjects, BookCreatedEvent } from '@rss/rss-bfb-ms-common';

export class BookCreatedPublisher extends Publisher<BookCreatedEvent> {
  subject: Subjects.BookCreated = Subjects.BookCreated;
}
