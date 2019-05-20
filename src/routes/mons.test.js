import request from 'supertest';
import express from '../services/express';
import routes from '../routes';
import { ROLE } from '../constants/codes';

const app = () => express(routes);

test('GET /mons 200', async () => {
  const { status, body } = await request(app()).get('/mons');
  expect(status).toBe(200);
  expect(Array.isArray(body)).toBe(true);
});

test('GET /mons/:id 200', async () => {
  const { status, body } = await request(app()).get('/mons/1');
  expect(status).toBe(200);
  expect(typeof body).toBe('object');
});

describe('Sign in as admin and action', async () => {
  let token;
  it('Sign up', async () => {
    const { status } = await request(app())
      .post('/users')
      .send({
        email: 'admin@handpokemon.com',
        password: '12345678',
        nickname: '운영자웅이',
        role: ROLE.ADMIN
      });
    expect(status).toBe(200);
  });
  it('Sign in', async () => {
    const { status, body } = await request(app())
      .post('/users/sign-in')
      .send({
        email: 'admin@handpokemon.com',
        password: '12345678'
      });
    expect(status).toBe(200);
    token = body.token;
  });
  it('POST /mons 200', async () => {
    const { status, body } = await request(app())
      .post('/mons')
      .send({
        id: 4,
        name: '파이리',
        cost: 3,
        mainAttrCd: '0305',
        subAttrCd: null,
        prevMonId: null,
        gradeCd: '0201',
        description:
          '양지에서 낮잠 자는 모습을 볼 수 있다. 태양의 빛을 많이 받으면 등의 씨앗이 크게 자란다.',
        generation: 1,
        height: 0.7,
        weight: 6.9,
        point: 1,
        hp: 45,
        power: 49,
        armor: 49,
        dex: 45,
        sPower: 65,
        sArmor: 65,
        total: 318
      })
      .set('authorization', token);
    expect(status).toBe(200);
    expect(typeof body).toBe('object');
  });
});
