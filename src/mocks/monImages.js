import migData from './mon-mig.json';

// export default [
//   {
//     id: 1,
//     url:
//       'https://s3.ap-northeast-2.amazonaws.com/files.handpokemon.com/mon-images/1558370359312-esanghaessi1.png',
//     monId: 1,
//     seq: 1,
//     designer: '웅이'
//   },
//   {
//     id: 2,
//     url:
//       'https://s3.ap-northeast-2.amazonaws.com/files.handpokemon.com/mon-images/1558370401183-esanghaepul.png',
//     monId: 2,
//     seq: 1,
//     designer: '웅이'
//   },
//   {
//     id: 3,
//     url:
//       'https://s3.ap-northeast-2.amazonaws.com/files.handpokemon.com/mon-images/1558370444401-esanhaekkot.png',
//     monId: 3,
//     seq: 1,
//     designer: '웅이'
//   }
// ];

const getMigData = () => {
  const keys = Object.keys(migData);
  const result = [];
  keys.forEach((key, id) => {
    const mon = migData[key];
    mon.monImage.forEach((item, idx) => {
      result.push({
        designer: item.designer,
        url: `https://s3.ap-northeast-2.amazonaws.com/files.handpokemon.com/mon-images/${
          item.fullPath.split('/')[1]
        }`,
        monId: mon.no,
        seq: idx + 1
      });
    });
  });
  return result;
};

export default getMigData();
