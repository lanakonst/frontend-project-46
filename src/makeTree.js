import _ from 'lodash';

const createComparisionTree = (data1, data2) => {
  const keys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)));
  const res = keys.reduce((acc, key) => {
    const value1 = data1[key];
    const value2 = data2[key];
    if (Object.hasOwn(data1, key)) {
      if (Object.hasOwn(data2, key)) {
        if (_.isEqual(value1, value2)) {
          acc.push({ key, genDiffStatus: 'unchanged', children: value1 });
        } else if (_.isObject(value1) && _.isObject(value2)) {
          acc.push({ key, genDiffStatus: '', children: createComparisionTree(value1, value2) });
        } else {
          acc.push({ key, genDiffStatus: 'updated', children: [value1, value2] });
        }
      } else {
        acc.push({ key, genDiffStatus: 'removed', children: value1 });
      }
    } else {
      acc.push({ key, genDiffStatus: 'added', children: value2 });
    }
    return acc;
  }, []);

  return res;
};

export default createComparisionTree;
