import _ from 'lodash';

const renameChildren = (parentKey, arrOfchildren) => arrOfchildren.map((child) => {
  const renamed = child;
  const { key } = renamed;
  renamed.key = `${parentKey}.${key}`;
  return renamed;
});

const valueToLine = (value) => {
  if (_.isObject(value)) return '[complex value]';
  if (_.isString(value)) return `'${value}'`;
  return value;
};

const plain = (data) => {
  const tree = data.reduce((acc, obj) => {
    const { key } = obj;
    const { genDiffStatus } = obj;
    const { children } = obj;

    if (genDiffStatus === '') {
      return _.concat(acc, `${plain(renameChildren(key, children))}`);
    }
    if (genDiffStatus === 'updated') {
      const initValue = valueToLine(children[0]);
      const newValue = valueToLine(children[1]);
      return _.concat(acc, `Property '${key}' was updated. From ${initValue} to ${newValue}`);
    }
    if (genDiffStatus === 'removed') {
      return _.concat(acc, `Property '${key}' was removed`);
    }
    if (genDiffStatus === 'added') {
      return _.concat(acc, `Property '${key}' was added with value: ${valueToLine(children)}`);
    }
    return acc;
  }, []);
  return tree.join('\n');
};

export default plain;
