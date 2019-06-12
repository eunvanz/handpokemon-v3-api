const RANK_UNIT = 0.06;
import { GRADE } from './codes';

export const RANK_RULE = {
  SS: {
    CHANCE: 7,
    RANGE: { MIN: 1.01 + RANK_UNIT * 3, MAX: 1 + RANK_UNIT * 4 }
  },
  S: {
    CHANCE: 13,
    RANGE: { MIN: 1.01 + RANK_UNIT * 2, MAX: 1 + RANK_UNIT * 3 }
  },
  A: {
    CHANCE: 15,
    RANGE: { MIN: 1.01 + RANK_UNIT * 1, MAX: 1 + RANK_UNIT * 2 }
  },
  B: {
    CHANCE: 15,
    RANGE: { MIN: 1.01, MAX: 1 + RANK_UNIT * 1 }
  },
  C: {
    CHANCE: 20,
    RANGE: { MIN: 1.01 - RANK_UNIT, MAX: 1 }
  },
  D: {
    CHANCE: 10,
    RANGE: { MIN: 1.01 - RANK_UNIT * 2, MAX: 1 - RANK_UNIT }
  },
  E: {
    CHANCE: 10,
    RANGE: { MIN: 1.01 - RANK_UNIT * 3, MAX: 1 - RANK_UNIT * 2 }
  },
  F: {
    CHANCE: 10,
    RANGE: { MIN: 1.01 - RANK_UNIT * 4, MAX: 1 - RANK_UNIT * 3 }
  }
};

export const CREDIT_RULE = {
  PICK: {
    MAX: 12,
    INTERVAL: 1000 * 1
    // INTERVAL: 1000 * 60 * 20
  },
  BATTLE: {
    MAX: 12,
    INTERVAL: 1000 * 5
    // INTERVAL: 1000 * 60 * 20
  }
};

export const MIX_RULE = (srcMon, tgtMon) => {
  const srcGradeCd = srcMon.gradeCd;
  const tgtGradeCd = tgtMon.gradeCd;
  if (srcGradeCd === tgtGradeCd) {
    if (srcGradeCd === GRADE.RARE) {
      return {
        gradeCds: [GRADE.BASIC, GRADE.RARE, GRADE.ELITE],
        chances: [100, 40, 15]
      };
    } else if (srcGradeCd === GRADE.ELITE) {
      return {
        gradeCds: [GRADE.RARE, GRADE.ELITE, GRADE.LEGEND],
        chances: [100, 50, 10]
      };
    } else if (srcGradeCd === GRADE.LEGEND) {
      return {
        gradeCds: [GRADE.ELITE, GRADE.LEGEND],
        chances: [100, 50]
      };
    } else {
      return {
        gradeCds: [GRADE.BASIC, GRADE.RARE],
        chances: [100, 40]
      };
    }
  } else {
    return {
      gradeCds: [GRADE.BASIC, GRADE.RARE],
      chances: [100, 40]
    };
  }
};

export const SPECIAL_MIX_RULE = (srcMon, tgtMon) => {
  if (
    [srcMon.name, tgtMon.name].includes('야돈') &&
    [srcMon.name, tgtMon.name].includes('셀러')
  ) {
    return ['야도란', '야도킹'];
  } else if (
    [srcMon.name, tgtMon.name].includes('딱정곤') &&
    [srcMon.name, tgtMon.name].includes('쪼마리')
  ) {
    return ['어지리더', '슈바르고'];
  } else {
    return null;
  }
};

// 각 seq 오픈 시 가격
export const BOOK_RULE = [0, 0, 0, 500, 1000, 3000];

export const LEAGUE_RULE = {
  '0801': {
    maxCost: 11,
    cut: 100
  }
  // '0802': {
  //   maxCost: 12,
  //   cut: 100
  // },
  // '0803': {
  //   maxCost: 13,
  //   cut: 100
  // },
  // '0804': {
  //   maxCost: 14,
  //   cut: 100
  // },
};
