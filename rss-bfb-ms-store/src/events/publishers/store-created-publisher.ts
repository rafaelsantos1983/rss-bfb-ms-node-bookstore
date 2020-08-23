import { Publisher, Subjects, StoreCreatedEvent } from '@rss/rss-bfb-ms-common';

export class StoreCreatedPublisher extends Publisher<StoreCreatedEvent> {
  subject: Subjects.StoreCreated = Subjects.StoreCreated;
}
