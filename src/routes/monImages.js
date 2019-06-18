import express from 'express';
import db from '../models';
import { token } from '../services/passport';
import { ROLE } from '../constants/codes';
import { resolve } from 'dns';

const router = express.Router();
const { MonImage, Mon, Workshop } = db;

router.post(
  '/',
  token({ required: true, roles: [ROLE.ADMIN] }),
  async (req, res, next) => {
    try {
      const { url, monId, designer } = req.body;
      let seq = null;
      if (monId) {
        const monImages = await MonImage.findAll({
          where: {
            monId
          },
          order: [['seq', 'DESC']]
        });
        seq = (monImages[0] ? monImages[0].seq : 0) + 1;
      }
      const newMonImage = await MonImage.create({
        url,
        monId,
        designer,
        seq
      });
      res.json(newMonImage);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.get(
  '/',
  token({ required: true, roles: [ROLE.ADMIN] }),
  async (req, res, next) => {
    try {
      const monImages = await MonImage.findAll();
      res.json(monImages);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/empty-mon',
  token({ required: true, roles: [ROLE.ADMIN] }),
  async (req, res, next) => {
    try {
      const monImages = await MonImage.findAll({
        where: {
          monId: null
        }
      });
      res.json(monImages);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  token({ required: true, roles: [ROLE.ADMIN] }),
  async (req, res, next) => {
    try {
      const monImages = await MonImage.findByPk(req.params.id);
      res.json(monImages);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  token({ required: true, roles: [ROLE.ADMIN] }),
  async (req, res, next) => {
    try {
      const { monId } = req.body;
      let seq = req.body.seq;
      if (monId && !seq) {
        const monImages = await MonImage.findAll({
          where: {
            monId
          },
          order: [['seq', 'DESC']]
        });
        seq = (monImages[0] ? monImages[0].seq : 0) + 1;
      }
      const result = await MonImage.update(
        Object.assign({}, req.body, { seq }),
        {
          where: {
            id: req.params.id
          }
        }
      );
      if (result[0] === 1) {
        const newMonImage = await MonImage.findByPk(req.params.id);
        res.json(newMonImage);
      } else {
        return res.status(404).json({ message: '해당하는 이미지가 없습니다.' });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.delete(
  '/:id',
  token({ required: true, roles: [ROLE.ADMIN] }),
  async (req, res, next) => {
    try {
      const result = await MonImage.destroy({
        where: {
          id: req.params.id
        }
      });
      if (result) {
        res.status(200).end();
      } else {
        return res.status(404).json({ messge: '해당하는 이미지가 없습니다.' });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/workshop-to-mon-image',
  token({ required: true, roles: [ROLE.ADMIN] }),
  async (req, res, next) => {
    try {
      const result = await db.sequelize.transaction(async transaction => {
        try {
          const workshop = req.body;
          console.log('workshop', workshop);
          const { monName, designer } = workshop;
          const mon = await Mon.findOne({
            where: {
              name: monName
            },
            transaction
          });
          const monId = mon.id;
          const monImages = await MonImage.findAll({
            where: {
              id: monId
            },
            order: [['seq', 'DESC']],
            transaction
          });
          const seq = (monImages[0] ? monImages[0].seq : 0) + 1;
          const newMonImage = await MonImage.create(
            {
              url: workshop.image,
              monId,
              designer,
              seq
            },
            {
              transaction
            }
          );
          await Workshop.update(
            { registered: 1 },
            {
              fields: ['registered'],
              where: {
                id: workshop.id
              },
              transaction
            }
          );
          return Promise.resolve(newMonImage);
        } catch (error) {
          throw new Error(error);
        }
      });
      res.json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export default router;
