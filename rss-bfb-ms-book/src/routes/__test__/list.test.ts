import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Store } from '../../models/store';

it('Lista os livros criadas', async () => {
  const store = Store.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'Nome da Livraria',
  });

  await store.save();

  await request(app).post('/api/books').send({
    name: 'Livro 1',
    price: 1000,
    storeId: store.id,
  });

  await request(app).post('/api/books').send({
    name: 'Livro 2',
    price: 2000,
    storeId: store.id,
  });

  await request(app).post('/api/books').send({
    name: 'Livro 3',
    price: 3000,
    storeId: store.id,
  });

  const response = await request(app).get('/api/books').send().expect(200);

  expect(response.body.length).toEqual(3);
});
