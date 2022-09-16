import _ from 'lodash';

const createComparisionTree = (data1, data2) => {
  const keys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)));
  const tree = keys.map((key) => {
    const value1 = data1[key];
    const value2 = data2[key];
    if (!Object.hasOwn(data1, key)) {
      return { key, status: 'added', value: value2 };
    } if (!Object.hasOwn(data2, key)) {
      return { key, status: 'removed', value: value1 };
    } if (_.isEqual(value1, value2)) {
      return { key, status: 'unchanged', value: value1 };
    } if (_.isObject(value1) && _.isObject(value2)) {
      return { key, status: 'nested', children: createComparisionTree(value1, value2) };
    }
    return { key, status: 'updated', value: [value1, value2] };
  });

  return tree;
};

export default createComparisionTree;
