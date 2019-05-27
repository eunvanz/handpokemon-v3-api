import { round, random } from 'lodash';
import moment from 'moment';
import { getRandomInt, repeat } from './commonUtils';
import { RANK_RULE, CREDIT_RULE } from '../constants/rules';
import { RANK } from '../constants/codes';

export const getRandomCollectionsByNumberFromMonsWithUserCollections = ({
  repeatCnt = 1,
  mons,
  userCollections,
  userId
}) => {
  console.log('getRandomCollectionByNumberFromMonsWithUserCollections');
  // mons에서 랜덤하게 repeat 만큼 id를 추출
  const monIds = [];
  repeat(() => {
    monIds.push(mons[random(0, mons.length - 1)].id);
  }, repeatCnt);

  // userCollections에 존재하는 id인 경우에는 update, else insert 삽입
  const result = { insert: [], update: [] };
  const monIdExistsInCollections = monId => {
    return userCollections.filter(col => col.monId === monId).length > 0;
  };
  monIds.forEach(monId => {
    if (monIdExistsInCollections(monId)) {
      const userCollection = userCollections.filter(
        col => col.monId === monId
      )[0];
      console.log('user collection', userCollection);
      // 이미 업데이트한 포켓몬이 있는 경우 체크
      const dupCollection = result.update.filter(
        item => item.monId === monId
      )[0];
      let increasedLevelCollcection;
      if (dupCollection) {
        // 이 경우에는 기존의 포켓몬을 레벨업해서 넣고, 기존것은 삭제
        result.update = result.update.filter(item => item.monId !== monId);
        increasedLevelCollcection = levelUpCollection(dupCollection);
      } else {
        increasedLevelCollcection = levelUpCollection(userCollection);
      }
      result.update.push(increasedLevelCollcection);
    } else {
      // 이미 생성된 포켓몬이 있는 경우 체크
      let collection;
      const dupCollection = result.insert.filter(
        item => item.monId === monId
      )[0];
      if (dupCollection) {
        // 이 경우에는 기존의 포켓몬 레벨업해서 넣고, 기존것은 삭제
        result.insert = result.insert.filter(item => item.monId !== monId);
        collection = levelUpCollection(dupCollection);
      } else {
        collection = getCollectionFromMon(
          mons.filter(mon => mon.id === monId)[0]
        );
        collection.userId = userId;
      }
      result.insert.push(collection);
    }
  });
  return result;
};

export const levelUpCollection = col => {
  console.log('before level up', col);
  const result = Object.assign({}, col.dataValues || col);
  const fields = [
    'addedHp',
    'addedPower',
    'addedArmor',
    'addedSPower',
    'addedSArmor',
    'addedDex'
  ];
  for (let i = 0; i < col.mon.point; i++) {
    result[fields[random(0, fields.length - 1)]]++;
  }
  result.level++;
  result.addedTotal += col.mon.point;
  console.log('levelUpCollection', result);
  return result;
};

export const levelDownCollection = (col, levelToDown = 1) => {
  const result = Object.assign({}, col.dataValues || col);
  const fields = [
    'addedHp',
    'addedPower',
    'addedArmor',
    'addedSPower',
    'addedSArmor',
    'addedDex'
  ];
  for (let i = 0; i < col.mon.point * levelToDown; i++) {
    const fieldIdx = random(0, fields.length - 1);
    if (result[fields[fieldIdx]] > 0) {
      result[fields[fieldIdx]]--;
    } else {
      i--;
    }
  }
  result.level -= levelToDown;
  result.addedTotal -= col.mon.point * levelToDown;
  console.log('level down result', result);
  return result;
};

export const getRandomCollectionsByNumberFromMons = ({
  repeat,
  mons,
  isExclusive
}) => {
  const result = [];
  let i = 0;
  while (i < repeat) {
    const collection = getRandomCollectionFromMons(mons);
    if (
      isExclusive &&
      result.filter(item => item.monId === collection.monId).length > 0
    ) {
      continue;
    } else {
      result.push(collection);
      i++;
    }
  }
  return result;
};

export const getRandomCollectionFromMons = mons => {
  const mon = mons[getRandomInt(0, mons.length)];
  return getCollectionFromMon(mon);
};

export const getCollectionFromMon = mon => {
  const collection = {
    monId: mon.id,
    mainAttrCd: mon.mainAttrCd,
    subAttrCd: mon.subAttrCd,
    height: round(mon.height * random(0.5, 1.5), 1),
    weight: round(mon.weight * random(0.5, 1.5), 1),
    baseHp: getRandomStat(mon.hp),
    basePower: getRandomStat(mon.power),
    baseArmor: getRandomStat(mon.armor),
    baseSPower: getRandomStat(mon.sPower),
    baseSArmor: getRandomStat(mon.sArmor),
    baseDex: getRandomStat(mon.dex),
    addedHp: 0,
    addedPower: 0,
    addedArmor: 0,
    addedSPower: 0,
    addedSArmor: 0,
    addedDex: 0,
    addedTotal: 0,
    level: 1,
    imageSeq:
      mon.monImages.length > 0
        ? mon.monImages[getRandomInt(0, mon.monImages.length)].seq
        : null,
    mon
  };
  collection.baseTotal =
    collection.baseHp +
    collection.basePower +
    collection.baseArmor +
    collection.baseSPower +
    collection.baseSArmor +
    collection.baseDex;
  collection.rankCd = getRankCd(collection.baseTotal, mon.total);
  collection.monImages = mon.monImages;
  collection.mon = mon;
  collection.nextMons = mon.nextMons;
  return collection;
};

export const getRankCd = (total, monTotal) => {
  const ratio = total / monTotal;
  if (ratio >= RANK_RULE.SS.RANGE.MIN) return RANK.SS;
  else if (ratio >= RANK_RULE.S.RANGE.MIN) return RANK.S;
  else if (ratio >= RANK_RULE.A.RANGE.MIN) return RANK.A;
  else if (ratio >= RANK_RULE.B.RANGE.MIN) return RANK.B;
  else if (ratio >= RANK_RULE.C.RANGE.MIN) return RANK.C;
  else if (ratio >= RANK_RULE.D.RANGE.MIN) return RANK.D;
  else if (ratio >= RANK_RULE.E.RANGE.MIN) return RANK.E;
  else if (ratio >= RANK_RULE.F.RANGE.MIN) return RANK.F;
};

export const getRandomStat = stat => {
  const idx = random(0, 100);
  if (idx > 100 - RANK_RULE.SS.CHANCE) {
    return round(stat * random(RANK_RULE.SS.RANGE.MIN, RANK_RULE.SS.RANGE.MAX));
  } else if (idx > 100 - RANK_RULE.SS.CHANCE - RANK_RULE.S.CHANCE) {
    return round(stat * random(RANK_RULE.S.RANGE.MIN, RANK_RULE.S.RANGE.MAX));
  } else if (
    idx >
    100 - RANK_RULE.SS.CHANCE - RANK_RULE.S.CHANCE - RANK_RULE.A.CHANCE
  ) {
    return round(stat * random(RANK_RULE.A.RANGE.MIN, RANK_RULE.A.RANGE.MAX));
  } else if (
    idx >
    100 -
      RANK_RULE.SS.CHANCE -
      RANK_RULE.S.CHANCE -
      RANK_RULE.A.CHANCE -
      RANK_RULE.B.CHANCE
  ) {
    return round(stat * random(RANK_RULE.B.RANGE.MIN, RANK_RULE.B.RANGE.MAX));
  } else if (
    idx >
    100 -
      RANK_RULE.SS.CHANCE -
      RANK_RULE.S.CHANCE -
      RANK_RULE.A.CHANCE -
      RANK_RULE.B.CHANCE -
      RANK_RULE.C.CHANCE
  ) {
    return round(stat * random(RANK_RULE.C.RANGE.MIN, RANK_RULE.C.RANGE.MAX));
  } else if (
    idx >
    100 -
      RANK_RULE.SS.CHANCE -
      RANK_RULE.S.CHANCE -
      RANK_RULE.A.CHANCE -
      RANK_RULE.B.CHANCE -
      RANK_RULE.C.CHANCE -
      RANK_RULE.D.CHANCE
  ) {
    return round(stat * random(RANK_RULE.D.RANGE.MIN, RANK_RULE.D.RANGE.MAX));
  } else if (
    idx >
    100 -
      RANK_RULE.SS.CHANCE -
      RANK_RULE.S.CHANCE -
      RANK_RULE.A.CHANCE -
      RANK_RULE.B.CHANCE -
      RANK_RULE.C.CHANCE -
      RANK_RULE.D.CHANCE -
      RANK_RULE.E.CHANCE
  ) {
    return round(stat * random(RANK_RULE.E.RANGE.MIN, RANK_RULE.E.RANGE.MAX));
  } else {
    return round(stat * random(RANK_RULE.F.RANGE.MIN, RANK_RULE.F.RANGE.MAX));
  }
};

export const getRefreshedUser = user => {
  // now - lastTime 를 interval로 나눈 몫 = 추가되어야 할 크레딧
  const now = moment();
  const pickDiff = now.diff(Number(user.lastPick));
  const battleDiff = now.diff(Number(user.lastBattle));
  const pickCreditToAdd = Math.floor(pickDiff / CREDIT_RULE.PICK.INTERVAL);
  const battleCreditToAdd = Math.floor(battleDiff / CREDIT_RULE.PICK.INTERVAL);
  user.pickCredit = Math.min(
    user.pickCredit + pickCreditToAdd,
    CREDIT_RULE.PICK.MAX
  );
  user.battleCredit = Math.min(
    user.battleCredit + battleCreditToAdd,
    CREDIT_RULE.BATTLE.MAX
  );
  return user;
};
