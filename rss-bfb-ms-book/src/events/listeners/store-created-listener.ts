import { Message } from 'node-nats-streaming';
import { Subjects, Listener, StoreCreatedEvent } from '@rss/rss-bfb-ms-common';

import { Store } from '../../models/store';
import { queueGroupName } from './queue-group-name';

export class StoreCreatedListener extends Listener<StoreCreatedEvent> {
  subject: Subjects.StoreCreated = Subjects.StoreCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: StoreCreatedEvent['data'], msg: Message) {
    const { id, name } = data;

    const store = Store.build({
      id,
      name,
    });

    await store.save();

    msg.ack();
  }
}
