import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Store } from '../../models/store';

it('Retorna 404 se não encontrar a Livro', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/books/${id}`).send().expect(404);
});

it('Retorna o Livro Se encontrada', async () => {
  const name = 'Livro';
  const price = 1000;

  const store = Store.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'Livraria',
  });

  await store.save();

  const response = await request(app)
    .post('/api/books')
    .send({
      name: name,
      price: price,
      storeId: store.id,
    })
    .expect(201);

  const bookResponse = await request(app)
    .get(`/api/books/${response.body.id}`)
    .send()
    .expect(200);

  expect(bookResponse.body.name).toEqual(name);
  expect(bookResponse.body.price).toEqual(price);
});
