import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Book } from '../../models/book';
import { natsWrapper } from '../../nats-wrapper';
import { Store } from '../../models/store';

it('Existe uma rota para /api/books para requisição post', async () => {
  const response = await request(app).post('/api/books').send({});

  expect(response.status).not.toEqual(404);
});

it('Retorna erro se Nome inválido', async () => {
  const store = Store.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'Livraria',
  });

  await store.save();

  await request(app)
    .post('/api/books')
    .send({
      name: '',
      price: 1000,
      storeId: store.id,
    })
    .expect(400);

  await request(app)
    .post('/api/books')
    .send({
      price: 1000,
      storeId: store.id,
    })
    .expect(400);
});

it('Retorna erro se Preço inválido', async () => {
  const store = Store.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'Livraria',
  });

  await store.save();

  await request(app)
    .post('/api/books')
    .send({
      name: 'Livro 1',
      price: null,
      storeId: store.id,
    })
    .expect(400);

  await request(app)
    .post('/api/books')
    .send({
      name: 'Livro 2',
      storeId: store.id,
    })
    .expect(400);
});

it('Retorna erro se Livraria inválida', async () => {
  const store = Store.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'Livraria',
  });

  await store.save();

  await request(app)
    .post('/api/books')
    .send({
      name: 'Livro 1',
      price: 1000,
      storeId: null,
    })
    .expect(400);

  await request(app)
    .post('/api/books')
    .send({
      name: 'Livro 2',
      price: 2000,
    })
    .expect(400);
});

it('Criar um Livro com valores válidos', async () => {
  const store = Store.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'Livraria',
  });

  await store.save();

  await request(app)
    .post('/api/books')
    .send({
      name: 'Livro',
      price: 1000,
      storeId: store.id,
    })
    .expect(201);

  let books = await Book.find({});
  expect(books.length).toEqual(1);
  expect(books[0].name).toEqual('Livro');
  expect(books[0].price).toEqual(1000);
});

it('Publicar um Livro', async () => {
  const store = Store.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'Livraria',
  });

  await store.save();

  await request(app)
    .post('/api/books')
    .send({
      name: 'Livro',
      price: 1000,
      storeId: store.id,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
