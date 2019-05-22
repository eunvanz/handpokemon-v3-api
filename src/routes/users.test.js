import request from 'supertest';
import express from '../services/express';
import routes from '../routes';

const app = () => express(routes);

test('GET /users 200', async () => {
  const { status, body } = await request(app()).get('/users');
  expect(status).toBe(200);
  expect(Array.isArray(body)).toBe(true);
});

test('POST /users 200', async () => {
  const { status, body } = await request(app())
    .post('/users')
    .send({
      id: 99,
      email: 'eunvanz@naver.com',
      password: '11111111',
      nickname: '웅이2'
    });
  expect(status).toBe(200);
  expect(typeof body.user).toBe('object');
  expect(typeof body.token).toBe('string');
});

test('GET /users/:id 200', async () => {
  const { status, body } = await request(app()).get('/users/1');
  expect(status).toBe(200);
  expect(typeof body).toBe('object');
});

test('GET /users/:id 404', async () => {
  const { status, body } = await request(app()).get('/users/111');
  expect(status).toBe(404);
  expect(body.message).toBe('해당하는 사용자가 없습니다.');
});

test('POST /users 409 (동일 이메일)', async () => {
  const { status, body } = await request(app())
    .post('/users')
    .send({
      email: 'eunvanz@naver.com',
      password: '1111111',
      nickname: '웅이3'
    });
  expect(status).toBe(409);
  expect(body.message).toBe('존재하는 이메일입니다.');
});

test('POST /users 409 (동일 닉네임)', async () => {
  const { status, body } = await request(app())
    .post('/users')
    .send({
      email: 'eunvanz@hanmail.net',
      password: '1111111',
      nickname: '웅이2'
    });
  expect(status).toBe(409);
  expect(body.message).toBe('존재하는 닉네임입니다.');
});

test('GET /is-dup-nickname/:nickname 200(true)', async () => {
  const { status, body } = await request(app()).get(
    encodeURI('/users/is-dup-nickname/웅이2')
  );
  expect(status).toBe(200);
  expect(body).toBe(true);
});

test('GET /users/is-dup-nickname/:nickname 200(false)', async () => {
  const { status, body } = await request(app()).get(
    encodeURI('/users/is-dup-nickname/웅이100')
  );
  expect(status).toBe(200);
  expect(body).toBe(false);
});

test('POST /users/sign-in 200', async () => {
  const { status, body } = await request(app())
    .post('/users/sign-in')
    .send({
      email: 'eunvanz@naver.com',
      password: '11111111'
    });
  expect(status).toBe(200);
  expect(typeof body.user).toBe('object');
  expect(typeof body.token).toBe('string');
});

test('POST /users/sign-in 500', async () => {
  const { status, body } = await request(app())
    .post('/users/sign-in')
    .send({
      email: 'eunvanz@naver.com',
      password: '11111112'
    });
  expect(status).toBe(500);
  expect(body.message).toBe('잘못된 이메일주소 혹은 비밀번호입니다.');
});

describe('requests required login', async () => {
  let token = '';
  it('login', async () => {
    const { status, body } = await request(app())
      .post('/users/sign-in')
      .send({
        email: 'eunvanz@gmail.com',
        password: '11111111'
      });
    token = body.token;
    expect(status).toBe(200);
    expect(typeof body.user).toBe('object');
    expect(typeof body.token).toBe('string');
  });
  it('PUT /users/:id 200', async () => {
    const { status, body } = await request(app())
      .put('/users/1')
      .send({
        introduce: 'hello'
      })
      .set('authorization', token);
    expect(status).toBe(200);
    expect(body.introduce).toBe('hello');
  });
  it('PUT /users/:id 404', async () => {
    const { status } = await request(app())
      .put('/users/12498512')
      .send({
        introduce: 'hello'
      })
      .set('authorization', token);
    expect(status).toBe(404);
  });
  it('DELETE /users/:id 200', async () => {
    const { status } = await request(app())
      .delete('/users/99')
      .set('authorization', token);
    expect(status).toBe(200);
  });
  it('POST /users/token', async () => {
    const { status } = await request(app())
      .post('/users/token')
      .set('authorization', token);
    expect(status).toBe(200);
  });
});
