import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Store } from '../../models/store';

it('Retorna 404 se não encontrar o Livro', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/books/${id}`)
    .send({
      name: 'Livro 1',
      price: 1000,
    })
    .expect(404);
});

it('Retorna 400 Se as informações dos campos do livro estão inválidas', async () => {
  const response = await request(app).post('/api/books').send({
    name: 'Livro 1',
    price: 1000,
  });

  await request(app)
    .put(`/api/books/${response.body.id}`)
    .send({
      name: '',
      price: 1000,
    })
    .expect(400);

  await request(app)
    .put(`/api/books/${response.body.id}`)
    .send({
      name: 'Livro Alterado',
      price: null,
    })
    .expect(400);
});

it('Atualiza as informações válidas do Livro', async () => {
  const store = Store.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'Livraria',
  });

  await store.save();

  const response = await request(app)
    .post('/api/books')
    .send({
      name: 'Livro',
      price: 1000,
      storeId: store.id,
    })
    .expect(201);

  await request(app)
    .put(`/api/books/${response.body.id}`)
    .send({
      name: 'Livro Alterado',
      price: 1001,
    })
    .expect(200);

  const bookResponse = await request(app)
    .get(`/api/books/${response.body.id}`)
    .send();

  expect(bookResponse.body.name).toEqual('Livro Alterado');
  expect(bookResponse.body.price).toEqual(1001);
});

it('Publicar um evento', async () => {
  const store = Store.build({
    id: mongoose.Types.ObjectId().toHexString(),
    name: 'Livraria',
  });

  await store.save();

  const response = await request(app).post('/api/books').send({
    name: 'Livro',
    price: 1001,
    storeId: store.id,
  });

  await request(app).put(`/api/books/${response.body.id}`).send({
    name: 'Livro Alterado',
    price: 1001,
  });

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
