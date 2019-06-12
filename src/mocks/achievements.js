import migData from './achievement-mig.json';

const typeMap = {
  [1]: '0601',
  [2]: '0602'
};

const attrMap = {
  노말: '0301',
  불꽃: '0302',
  물: '0303',
  전기: '0304',
  풀: '0305',
  얼음: '0306',
  격투: '0307',
  독: '0308',
  땅: '0309',
  비행: '0310',
  염력: '0311',
  벌레: '0312',
  바위: '0313',
  유령: '0314',
  용: '0315',
  악: '0316',
  강철: '0317',
  요정: '0318'
};

const getMigData = () => {
  const keys = Object.keys(migData);
  const result = [];
  keys.forEach((key, idx) => {
    const item = migData[key];
    const achievement = {
      id: idx + 1,
      attrCd: attrMap[item.attr],
      achievementTypeCd: typeMap[item.type],
      conditionValue: item.condition,
      name: item.name,
      reward: item.reward,
      buff: item.buff.join(',')
    };
    result.push(achievement);
  });
  return result;
};

export default getMigData();
