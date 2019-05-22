const RANK_UNIT = 0.06;

export const RANK_RULE = {
  SS: {
    chance: 7,
    range: { min: 1.01 + RANK_UNIT * 3, max: 1 + RANK_UNIT * 4 }
  },
  S: {
    chance: 13,
    range: { min: 1.01 + RANK_UNIT * 2, max: 1 + RANK_UNIT * 3 }
  },
  A: {
    chance: 15,
    range: { min: 1.01 + RANK_UNIT * 1, max: 1 + RANK_UNIT * 2 }
  },
  B: {
    chance: 15,
    range: { min: 1.01, max: 1 + RANK_UNIT * 1 }
  },
  C: {
    chance: 20,
    range: { min: 1.01 - RANK_UNIT, max: 1 }
  },
  D: {
    chance: 10,
    range: { min: 1.01 - RANK_UNIT * 2, max: 1 - RANK_UNIT }
  },
  E: {
    chance: 10,
    range: { min: 1.01 - RANK_UNIT * 3, max: 1 - RANK_UNIT * 2 }
  },
  F: {
    chance: 10,
    range: { min: 1.01 - RANK_UNIT * 4, max: 1 - RANK_UNIT * 3 }
  }
};
