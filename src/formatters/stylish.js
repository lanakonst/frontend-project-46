import _ from 'lodash';
// import { getChildren, getGenDiffStatus, getKey } from '../index.js';

const interval = 4;

const statusToSign = (status) => {
  switch (status) {
    case 'added':
      return '+ ';
    case 'removed':
      return '- ';
    case 'updated':
      return '- ';
    default:
      return '';
  }
};

const typeObject = (obj, depth) => {
  const line = _.transform(obj, (acc, value, key) => {
    const spaces = (' ').repeat(interval * depth);
    if (_.isObject(value)) {
      acc.push(`${spaces}${key}: {\n${typeObject(value, depth + 1)}\n${spaces}}`);
    } else {
      acc.push(`${spaces}${key}: ${value}`);
    }
  }, []);
  return line.join('\n');
};

const makeLine = (sign, key, value, depth) => {
  const spacesBeforeBreckets = (' ').repeat(interval * depth);
  const spaces = sign === '+ ' || sign === '- ' ? (' ').repeat(interval * depth - 2) : (' ').repeat(interval * depth);
  if (_.isObject(value)) {
    return `${spaces}${sign}${key}: {\n${typeObject(value, depth + 1)}\n${spacesBeforeBreckets}}`;
  }
  return `${spaces}${sign}${key}: ${value}`;
};

const stylish = (data, depth = 1) => {
  const tree = data.reduce((acc, obj) => {
    const { key } = obj;
    const { genDiffStatus } = obj;
    const { children } = obj;
    const sign = statusToSign(genDiffStatus);
    let line = '';
    const spacesBeforeBreckets = (' ').repeat(interval * depth);
    const spaces = sign === '+ ' || sign === '- ' ? (' ').repeat(interval * depth - 2) : (' ').repeat(interval * depth);

    if (genDiffStatus === '') {
      line = `${spaces}${sign}${key}: {\n${stylish(children, depth + 1)}\n${spacesBeforeBreckets}}`;
    } else if (genDiffStatus === 'updated') {
      const initValue = children[0];
      const newValue = children[1];
      line = `${makeLine('- ', key, initValue, depth)}\n${makeLine('+ ', key, newValue, depth)}`;
    } else {
      line = makeLine(sign, key, children, depth);
    }

    acc.push(line);
    return acc;
  }, []);
  return tree.join('\n');
};

export default stylish;
