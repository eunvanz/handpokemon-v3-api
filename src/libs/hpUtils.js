import { round, random } from 'lodash';
import { getRandomInt, repeat } from './commonUtils';
import { RANK_RULE } from '../constants/rules';
import { RANK } from '../constants/codes';

export const getRandomCollectionsByNumberFromMonsWithUserCollections = ({
  repeatCnt,
  mons,
  userCollections,
  userId
}) => {
  // mons에서 랜덤하게 repeat 만큼 id를 추출
  const monIds = [];
  repeat(() => {
    monIds.push(mons[random(0, mons.length)].id);
  }, repeatCnt);

  // userCollections에 존재하는 id인 경우에는 update, else insert 삽입
  const result = { insert: [], update: [] };
  const monIdExistsInCollections = monId =>
    userCollections.filter(col => col.monId === monId).length > 0;
  monIds.forEach(monId => {
    if (monIdExistsInCollections(monId)) {
      const collection = userCollections.filter(col => col.monId === monId)[0];
      result.update.push(levelUpCollection(collection));
    } else {
      const collection = getCollectionFromMon(
        mons.filter(mon => mon.id === monId)[0]
      );
      collection.userId = userId;
      result.insert.push(collection);
    }
  });
  return result;
};

export const levelUpCollection = col => {
  const fields = [
    'addedHp',
    'addedPower',
    'addedArmor',
    'addedSPower',
    'addedSArmor',
    'addedDex'
  ];
  for (let i = 0; i < col.mon.point; i++) {
    col[fields[random(0, fields.length - 1)]]++;
  }
  col.level++;
  col.addedTotal += col.mon.point;
  return col;
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
    imageSeq: mon.monImages[getRandomInt(0, mon.monImages.length)].seq,
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
  return collection;
};

export const getRankCd = (total, monTotal) => {
  const ratio = total / monTotal;
  if (ratio >= RANK_RULE.SS.range.min) return RANK.SS;
  else if (ratio >= RANK_RULE.S.range.min) return RANK.S;
  else if (ratio >= RANK_RULE.A.range.min) return RANK.A;
  else if (ratio >= RANK_RULE.B.range.min) return RANK.B;
  else if (ratio >= RANK_RULE.C.range.min) return RANK.C;
  else if (ratio >= RANK_RULE.D.range.min) return RANK.D;
  else if (ratio >= RANK_RULE.E.range.min) return RANK.E;
  else if (ratio >= RANK_RULE.F.range.min) return RANK.F;
};

export const getRandomStat = stat => {
  const idx = random(0, 100);
  if (idx > 100 - RANK_RULE.SS.chance) {
    return round(stat * random(RANK_RULE.SS.range.min, RANK_RULE.SS.range.max));
  } else if (idx > 100 - RANK_RULE.SS.chance - RANK_RULE.S.chance) {
    return round(stat * random(RANK_RULE.S.range.min, RANK_RULE.S.range.max));
  } else if (
    idx >
    100 - RANK_RULE.SS.chance - RANK_RULE.S.chance - RANK_RULE.A.chance
  ) {
    return round(stat * random(RANK_RULE.A.range.min, RANK_RULE.A.range.max));
  } else if (
    idx >
    100 -
      RANK_RULE.SS.chance -
      RANK_RULE.S.chance -
      RANK_RULE.A.chance -
      RANK_RULE.B.chance
  ) {
    return round(stat * random(RANK_RULE.B.range.min, RANK_RULE.B.range.max));
  } else if (
    idx >
    100 -
      RANK_RULE.SS.chance -
      RANK_RULE.S.chance -
      RANK_RULE.A.chance -
      RANK_RULE.B.chance -
      RANK_RULE.C.chance
  ) {
    return round(stat * random(RANK_RULE.C.range.min, RANK_RULE.C.range.max));
  } else if (
    idx >
    100 -
      RANK_RULE.SS.chance -
      RANK_RULE.S.chance -
      RANK_RULE.A.chance -
      RANK_RULE.B.chance -
      RANK_RULE.C.chance -
      RANK_RULE.D.chance
  ) {
    return round(stat * random(RANK_RULE.D.range.min, RANK_RULE.D.range.max));
  } else if (
    idx >
    100 -
      RANK_RULE.SS.chance -
      RANK_RULE.S.chance -
      RANK_RULE.A.chance -
      RANK_RULE.B.chance -
      RANK_RULE.C.chance -
      RANK_RULE.D.chance -
      RANK_RULE.E.chance
  ) {
    return round(stat * random(RANK_RULE.E.range.min, RANK_RULE.E.range.max));
  } else {
    return round(stat * random(RANK_RULE.F.range.min, RANK_RULE.F.range.max));
  }
};
