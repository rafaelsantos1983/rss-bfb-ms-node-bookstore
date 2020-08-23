import mongoose from 'mongoose';
import { Store } from '../../models/store';
import request from 'supertest';
import { app } from '../../app';

it('Remover uma Livro', async () => {
  const store = Store.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'Livraria',
  });

  await store.save();

  const name = 'Livro 1';
  const price = 1000;

  const response = await request(app)
    .post('/api/books')
    .send({
      name,
      price,
      storeId: store.id,
    })
    .expect(201);

  await request(app)
    .delete(`/api/books/${response.body.id}`)
    .send()
    .expect(204);
});
