import express from 'express';
import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';
import db from '../models';
import { token } from '../services/passport';
import { ACHIEVEMENT_TYPE } from '../constants/codes';

const router = express.Router();
const { UserAchievement, Achievement, Collection, User, Mon } = db;

router.get('/token', token({ required: true }), async (req, res, next) => {
  try {
    const userAchievements = await UserAchievement.findAll({
      where: {
        userId: req.user.id
      },
      include: [
        {
          model: Achievement,
          as: 'achievement'
        }
      ]
    });
    res.json(userAchievements);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/refresh', token({ required: true }), async (req, res, next) => {
  try {
    const { user, query } = req;
    const { attrCd } = query; // attrCd에 해당하는 칭호를 활성화

    const result = await db.sequelize.transaction(async transaction => {
      try {
        const innerResult = {
          inserted: [],
          activated: [],
          deactivated: []
        };

        let userAchievements = await UserAchievement.findAll({
          where: {
            userId: user.id
          },
          include: [
            {
              model: Achievement,
              as: 'achievement'
            }
          ],
          transaction,
          lock: {
            level: transaction.LOCK.UPDATE
          }
        });

        const achievements = await Achievement.findAll();

        const activatedAttrAchievement = userAchievements.filter(
          item =>
            item.activated &&
            item.achievement.achievementTypeCd === ACHIEVEMENT_TYPE.ATTR
        )[0];

        const attrCdToActivate =
          attrCd ||
          (activatedAttrAchievement
            ? activatedAttrAchievement.achievement.attrCd
            : null);

        const userCollections = await Collection.findAll({
          where: {
            userId: user.id
          },
          include: [
            {
              model: Mon,
              as: 'mon'
            }
          ],
          transaction,
          lock: {
            level: transaction.LOCK.UPDATE
          }
        });

        // insert
        for (const item of achievements) {
          const { achievementTypeCd, conditionValue } = item;
          if (achievementTypeCd === ACHIEVEMENT_TYPE.COL) {
            if (
              conditionValue <= user.colPoint &&
              userAchievements.filter(ua => ua.achievementId === item.id)
                .length === 0
            ) {
              const userAchievement = await UserAchievement.create(
                {
                  userId: user.id,
                  achievementId: item.id,
                  activated: 0,
                  disabled: 0
                },
                {
                  transaction
                }
              );
              await User.update(
                {
                  pokemoney: user.pokemoney + item.reward
                },
                {
                  where: {
                    id: user.id
                  },
                  fields: ['pokemoney'],
                  transaction
                }
              );
              userAchievement.dataValues.achievement = item.dataValues;
              innerResult.inserted.push(userAchievement);
            }
          } else if (achievementTypeCd === ACHIEVEMENT_TYPE.ATTR) {
            if (
              conditionValue <=
                userCollections.filter(
                  uc =>
                    uc.mainAttrCd === item.attrCd ||
                    uc.subAttrCd === item.attrCd
                ).length &&
              userAchievements.filter(ua => ua.achievementId === item.id)
                .length === 0
            ) {
              const userAchievement = await UserAchievement.create(
                {
                  userId: user.id,
                  achievementId: item.id,
                  activated: 0,
                  disabled: 0
                },
                {
                  transaction
                }
              );
              await User.update(
                {
                  pokemoney: user.pokemoney + item.reward
                },
                {
                  where: {
                    id: user.id
                  },
                  fields: ['pokemoney'],
                  transaction
                }
              );
              userAchievement.dataValues.achievement = item.dataValues;
              innerResult.inserted.push(userAchievement);
            }
          }
        }

        userAchievements = await UserAchievement.findAll({
          where: {
            userId: user.id
          },
          include: [
            {
              model: Achievement,
              as: 'achievement'
            }
          ],
          transaction,
          lock: {
            level: transaction.LOCK.UPDATE
          }
        });

        // update
        const colAchievements = userAchievements.filter(
          item => item.achievement.achievementTypeCd === ACHIEVEMENT_TYPE.COL
        );
        const orderedColAchievements = orderBy(
          colAchievements,
          item => item.achievement.conditionValue,
          ['desc']
        );

        let hasToActivate = true;

        for (const item of orderedColAchievements) {
          if (
            item.achievement.conditionValue > user.colPoint &&
            item.activated
          ) {
            await UserAchievement.update(
              { activated: 0 },
              {
                where: {
                  id: item.id
                },
                fields: ['activated'],
                transaction
              }
            );
            innerResult.deactivated.push(item);
          } else if (item.achievement.conditionValue <= user.colPoint) {
            await UserAchievement.update(
              { activated: hasToActivate ? 1 : 0 },
              {
                where: {
                  id: item.id
                },
                fields: ['activated'],
                transaction
              }
            );
            innerResult.activated.push(item);
            hasToActivate = false;
          }
        }

        const attrAchievements = userAchievements.filter(
          item => item.achievement.achievementTypeCd === ACHIEVEMENT_TYPE.ATTR
        );
        const groupedColAchievements = groupBy(
          attrAchievements,
          item => item.achievement.attrCd
        );
        const keys = Object.keys(groupedColAchievements);

        hasToActivate = true;
        for (const key of keys) {
          const attrGroupAchievements = orderBy(
            groupedColAchievements[key],
            item => item.achievement.conditionValue,
            ['desc']
          );
          if (attrCdToActivate === key) {
            for (const item of attrGroupAchievements) {
              if (
                item.achievement.conditionValue >
                  userCollections.filter(
                    col =>
                      col.mon.mainAttrCd === item.achievement.attrCd ||
                      col.mon.subAttrCd === item.achievement.attrCd
                  ).length &&
                item.activated
              ) {
                await UserAchievement.update(
                  { activated: 0 },
                  {
                    where: {
                      id: item.id
                    },
                    fields: ['activated'],
                    transaction
                  }
                );
                innerResult.deactivated.push(item);
              } else if (
                item.achievement.conditionValue <=
                userCollections.filter(
                  col =>
                    col.mon.mainAttrCd === item.achievement.attrCd ||
                    col.mon.subAttrCd === item.achievement.attrCd
                ).length
              ) {
                await UserAchievement.update(
                  { activated: hasToActivate ? 1 : 0 },
                  {
                    where: {
                      id: item.id
                    },
                    fields: ['activated'],
                    transaction
                  }
                );
                hasToActivate = false;
                innerResult.activated.push(item);
              }
            }
          } else {
            const activatedAchivements = attrGroupAchievements.filter(
              item => item.activated
            );
            if (activatedAchivements.length > 0) {
              for (const item of activatedAchivements) {
                await UserAchievement.update(
                  { activated: 0 },
                  {
                    where: {
                      id: item.id
                    },
                    fields: ['activated'],
                    transaction
                  }
                );
                innerResult.deactivated.push(item);
              }
            }
          }
        }

        return Promise.resolve(innerResult);
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
