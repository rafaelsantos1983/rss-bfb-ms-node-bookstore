import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { Store } from '../../../models/store';
import { StoreCreatedEvent } from '@rss/rss-bfb-ms-common';
import { StoreCreatedListener } from '../store-created-listener';

const setup = async () => {
  // create an instance of the listener
  const listener = new StoreCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: StoreCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Campo Grande Livraria',
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('Criar e Salvar uma Livraria', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  const store = await Store.findById(data.id);

  expect(store).toBeDefined();

  expect(store!.name).toEqual(data.name);
});

it('confirma a mensagem - ouvinte', async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
