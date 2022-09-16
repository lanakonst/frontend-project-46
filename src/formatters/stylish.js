import _ from 'lodash';

const interval = 4;

const makeSpaces = (sign, depth) => (sign === '+ ' || sign === '- ' ? (' ').repeat(interval * depth - 2) : (' ').repeat(interval * depth));

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
    const { key, status } = obj;
    const spacesBeforeBreckets = (' ').repeat(interval * depth);
    if (status === 'nested') {
      const sign = '';
      const spaces = makeSpaces(sign, depth);
      const { children } = obj;
      return _.concat(acc, `${spaces}${sign}${key}: {\n${stylish(children, depth + 1)}\n${spacesBeforeBreckets}}`);
    }
    const { value } = obj;
    if (status === 'updated') {
      const initValue = value[0];
      const newValue = value[1];
      return _.concat(acc, `${makeLine('- ', key, initValue, depth)}\n${makeLine('+ ', key, newValue, depth)}`);
    }
    if (status === 'removed') return _.concat(acc, makeLine('- ', key, value, depth));
    if (status === 'added') return _.concat(acc, makeLine('+ ', key, value, depth));
    return _.concat(acc, makeLine('', key, value, depth));
  }, []);
  return tree.join('\n');
};

export default stylish;
