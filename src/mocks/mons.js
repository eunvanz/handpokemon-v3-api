import migData from './mon-mig.json';

// export default [
//   {
//     id: 1,
//     name: '이상해씨',
//     cost: 3,
//     mainAttrCd: '0305',
//     subAttrCd: null,
//     prevMonId: null,
//     gradeCd: '0201',
//     description:
//       '양지에서 낮잠 자는 모습을 볼 수 있다. 태양의 빛을 많이 받으면 등의 씨앗이 크게 자란다.',
//     generation: 1,
//     height: 0.7,
//     weight: 6.9,
//     point: 1,
//     hp: 45,
//     power: 49,
//     armor: 49,
//     dex: 45,
//     sPower: 65,
//     sArmor: 65,
//     total: 318
//   },
//   {
//     id: 2,
//     name: '이상해풀',
//     cost: 5,
//     mainAttrCd: '0305',
//     subAttrCd: null,
//     prevMonId: 1,
//     gradeCd: '0203',
//     description:
//       '꽃봉오리를 지탱하기 위해 하반신이 강해진다. 양지에서 가만히 있는 시간이 길어지면 드디어 커다란 꽃이 필 때다.',
//     generation: 1,
//     height: 1,
//     weight: 13,
//     point: 4,
//     hp: 60,
//     power: 62,
//     armor: 63,
//     dex: 60,
//     sPower: 80,
//     sArmor: 80,
//     total: 405,
//     requiredLv: 4
//   },
//   {
//     id: 3,
//     name: '이상해꽃',
//     cost: 8,
//     mainAttrCd: '0305',
//     subAttrCd: null,
//     prevMonId: 2,
//     gradeCd: '0203',
//     description:
//       '충분한 영양분과 태양의 빛이 꽃의 색을 선명하게 만든다고 한다. 꽃의 향기는 사람의 마음을 치유한다.',
//     generation: 1,
//     height: 2.4,
//     weight: 155,
//     point: 20,
//     hp: 80,
//     power: 82,
//     armor: 83,
//     dex: 80,
//     sPower: 100,
//     sArmor: 100,
//     total: 525,
//     requiredLv: 5
//   }
// ];

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

const gradeMap = {
  b: '0201',
  r: '0202',
  s: '0203',
  sr: '0204',
  e: '0205',
  l: '0206'
};

const getMigData = () => {
  const keys = Object.keys(migData);
  const result = [];
  keys.forEach(key => {
    const item = migData[key];
    const mon = {
      id: item.no,
      name: item.name.ko,
      cost: item.cost,
      mainAttrCd: attrMap[item.mainAttr],
      subAttrCd: attrMap[item.subAttr],
      gradeCd: gradeMap[item.grade],
      description: item.description.ko,
      generation: Number(item.generation),
      height: item.height,
      weight: item.weight,
      point: item.point,
      hp: item.hp,
      power: item.power,
      armor: item.armor,
      dex: item.dex,
      sPower: item.sPower,
      sArmor: item.sArmor,
      total: item.total,
      requiredLv: item.requiredLv,
      prevMonId: item.prev ? migData[item.prev].no : null
    };
    result.push(mon);
  });
  return result;
};

export default getMigData();
