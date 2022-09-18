import _ from 'lodash';

const interval = 4;

const makeSpaces = (depth) => (' ').repeat(interval * depth - 2);

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
  const spaces = makeSpaces(depth);
  if (_.isObject(value)) {
    return `${spaces}${sign}${key}: {\n${typeObject(value, depth + 1)}\n${spacesBeforeBreckets}}`;
  }
  return `${spaces}${sign}${key}: ${value}`;
};

const stylish = (data, depth = 1) => {
  const tree = data.flatMap((obj) => {
    const { key, status } = obj;
    const spacesBeforeBreckets = (' ').repeat(interval * depth);
    if (status === 'nested') {
      const spaces = makeSpaces(depth);
      const { children } = obj;
      return `${spaces}  ${key}: {\n${stylish(children, depth + 1)}\n${spacesBeforeBreckets}}`;
    }
    const { value } = obj;
    if (status === 'updated') {
      const initValue = value[0];
      const newValue = value[1];
      return `${makeLine('- ', key, initValue, depth)}\n${makeLine('+ ', key, newValue, depth)}`;
    }
    if (status === 'unchanged') return makeLine('  ', key, value, depth);
    const sign = status === 'removed' ? '- ' : '+ ';
    return makeLine(sign, key, value, depth);
  });
  return tree.join('\n');
};

export default stylish;
