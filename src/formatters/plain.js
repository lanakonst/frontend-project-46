import _ from 'lodash';
import { getChildren, getGenDiffStatus, getKey } from '../index.js';

const renameChildren = (parentKey, arrOfchildren) => arrOfchildren.map((child) => {
  const renamed = child;
  const key = getKey(renamed);
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
    const key = getKey(obj);
    const genDiffStatus = getGenDiffStatus(obj);
    const children = getChildren(obj);

    if (genDiffStatus === '') {
      acc.push(`${plain(renameChildren(key, children))}`);
    } else if (genDiffStatus === 'updated') {
      const initValue = valueToLine(children[0]);
      const newValue = valueToLine(children[1]);
      acc.push(`Property '${key}' was updated. From ${initValue} to ${newValue}`);
    } else if (genDiffStatus === 'removed') {
      acc.push(`Property '${key}' was removed`);
    } else if (genDiffStatus === 'added') {
      acc.push(`Property '${key}' was added with value: ${valueToLine(children)}`);
    }
    return acc;
  }, []);
  return tree.join('\n');
};

export default plain;
