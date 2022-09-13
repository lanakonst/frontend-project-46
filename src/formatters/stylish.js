import _ from 'lodash';

const interval = 4;

const makeSpaces = (sign, depth) => (sign === '+ ' || sign === '- ' ? (' ').repeat(interval * depth - 2) : (' ').repeat(interval * depth));
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
  const line = _.reduce(obj, (acc, value, key) => {
    const spaces = (' ').repeat(interval * depth);
    if (_.isObject(value)) {
      return _.concat(acc, `${spaces}${key}: {\n${typeObject(value, depth + 1)}\n${spaces}}`);
    }
    return _.concat(acc, `${spaces}${key}: ${value}`);
  }, []);
  return line.join('\n');
};

const makeLine = (sign, key, value, depth) => {
  const spacesBeforeBreckets = (' ').repeat(interval * depth);
  const spaces = makeSpaces(sign, depth);
  if (_.isObject(value)) {
    return `${spaces}${sign}${key}: {\n${typeObject(value, depth + 1)}\n${spacesBeforeBreckets}}`;
  }
  return `${spaces}${sign}${key}: ${value}`;
};

const stylish = (data, depth = 1) => {
  const tree = data.reduce((acc, obj) => {
    const { key, genDiffStatus, children } = obj;
    const sign = statusToSign(genDiffStatus);
    const spacesBeforeBreckets = (' ').repeat(interval * depth);
    const spaces = makeSpaces(sign, depth);

    if (genDiffStatus === '') {
      return _.concat(acc, `${spaces}${sign}${key}: {\n${stylish(children, depth + 1)}\n${spacesBeforeBreckets}}`);
    }
    if (genDiffStatus === 'updated') {
      const initValue = children[0];
      const newValue = children[1];
      return _.concat(acc, `${makeLine('- ', key, initValue, depth)}\n${makeLine('+ ', key, newValue, depth)}`);
    }
    return _.concat(acc, makeLine(sign, key, children, depth));
  }, []);
  return tree.join('\n');
};

export default stylish;
