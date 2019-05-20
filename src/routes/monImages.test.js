import request from 'supertest';
import express from '../services/express';
import routes from '../routes';

const app = () => express(routes);

describe('Sign in as admin and action', async () => {
  let token;
  it('Sign in', async () => {
    const { status, body } = await request(app())
      .post('/users/sign-in')
      .send({
        email: 'eunvanz@gmail.com',
        password: '11111111'
      });
    expect(status).toBe(200);
    token = body.token;
  });
  let prevSeq;
  let id;
  it('POST /mon-images 200', async () => {
    const { status, body } = await request(app())
      .post('/mon-images')
      .send({
        url:
          'https://s3.ap-northeast-2.amazonaws.com/files.handpokemon.com/1557991403892',
        monId: 1,
        designer: '웅이'
      })
      .set('authorization', token);
    expect(status).toBe(200);
    prevSeq = body.seq;
  });
  it('Set seq correctly', async () => {
    const { status, body } = await request(app())
      .post('/mon-images')
      .send({
        url:
          'https://s3.ap-northeast-2.amazonaws.com/files.handpokemon.com/1557991403892',
        monId: 1,
        designer: '웅이'
      })
      .set('authorization', token);
    expect(status).toBe(200);
    expect(body.seq).toBe(prevSeq + 1);
  });
  it('POST /mon-images 200 (without monId)', async () => {
    const { status, body } = await request(app())
      .post('/mon-images')
      .send({
        url:
          'https://s3.ap-northeast-2.amazonaws.com/files.handpokemon.com/1557991403892',
        designer: '웅이'
      })
      .set('authorization', token);
    expect(status).toBe(200);
    id = body.id;
  });
  it('Set seq correctly when put', async () => {
    const { status, body } = await request(app())
      .put(`/mon-images/${id}`)
      .send({
        id,
        url:
          'https://s3.ap-northeast-2.amazonaws.com/files.handpokemon.com/1557991403892',
        monId: 1,
        designer: '웅이2'
      })
      .set('authorization', token);
    expect(status).toBe(200);
    expect(body.seq).toBe(prevSeq + 2);
  });
});
