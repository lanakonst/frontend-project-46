import _ from 'lodash';

const interval = 4;

const makeSpaces = (depth) => (' ').repeat(interval * depth - 2);

const stringify = (obj, depth) => {
  const line = _.reduce(obj, (acc, value, key) => {
    const spaces = (' ').repeat(interval * depth);
    if (_.isObject(value)) {
      return _.concat(acc, `${spaces}${key}: {\n${stringify(value, depth + 1)}\n${spaces}}`);
    }
    return _.concat(acc, `${spaces}${key}: ${value}`);
  }, []);
  return line.join('\n');
};

const stylish = (data, depth = 1) => {
  const tree = data.flatMap((obj) => {
    const { key, status } = obj;
    const spacesBeforeBreckets = (' ').repeat(interval * depth);
    const spaces = makeSpaces(depth);
    if (status === 'nested') {
      const { children } = obj;
      return `${spaces}  ${key}: {\n${stylish(children, depth + 1)}\n${spacesBeforeBreckets}}`;
    }

    if (status === 'updated') {
      const [initValue, newValue] = obj.value.map((val) => {
        if (_.isObject(val)) return `{\n${stringify(val, depth + 1)}\n${spacesBeforeBreckets}}`;
        return val;
      });
      return `${spaces}- ${key}: ${initValue}\n${spaces}+ ${key}: ${newValue}`;
    }
    const value = _.isObject(obj.value) ? `{\n${stringify(obj.value, depth + 1)}\n${spacesBeforeBreckets}}` : obj.value;
    if (status === 'removed') return `${spaces}- ${key}: ${value}`;
    if (status === 'added') return `${spaces}+ ${key}: ${value}`;
    // unchanged:

    return `${spaces}  ${key}: ${value}`;
  });
  return tree.join('\n');
};

export default stylish;
