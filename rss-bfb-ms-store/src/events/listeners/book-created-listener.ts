import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  NotFoundError,
  BookCreatedEvent,
} from '@rss/rss-bfb-ms-common';

import { Store } from '../../models/store';
import { queueGroupName } from './queue-group-name';

export class BookCreatedListener extends Listener<BookCreatedEvent> {
  subject: Subjects.BookCreated = Subjects.BookCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: BookCreatedEvent['data'], msg: Message) {
    const {
      price,
      store: { storeId },
    } = data;

    const store = await Store.findById(storeId);

    const totalValue = store!.collection_price + price;

    store!.set({
      totalValue: totalValue,
    });
    await store!.save();

    msg.ack();
  }
}
