import _ from 'lodash';

const interval = 4;

const makeSpaces = (depth) => (' ').repeat(interval * depth);

const stringify = (value, depth) => {
  if (!_.isObject(value)) return String(value);
  const line = _.reduce(value, (acc, val, key) => {
    const innerSpaces = makeSpaces(depth + 1);
    if (_.isObject(val)) {
      return _.concat(acc, `${innerSpaces}${key}: ${stringify(val, depth + 1)}`);
    }
    return _.concat(acc, `${innerSpaces}${key}: ${val}`);
  }, []);
  const spaces = makeSpaces(depth);
  return `{\n${line.join('\n')}\n${spaces}}`;
};

const stylish = (data, depth = 1) => {
  const tree = data.flatMap((obj) => {
    const { key, status } = obj;
    const spacesBeforeBreckets = makeSpaces(depth);
    const spaces = (' ').repeat(interval * depth - 2);
    if (status === 'nested') {
      const { children } = obj;
      return `${spaces}  ${key}: {\n${stylish(children, depth + 1)}\n${spacesBeforeBreckets}}`;
    }

    if (status === 'updated') {
      const [initValue, newValue] = obj.value.map((val) => stringify(val, depth));
      return `${spaces}- ${key}: ${initValue}\n${spaces}+ ${key}: ${newValue}`;
    }
    const value = stringify(obj.value, depth);
    if (status === 'removed') return `${spaces}- ${key}: ${value}`;
    if (status === 'added') return `${spaces}+ ${key}: ${value}`;
    // unchanged:

    return `${spaces}  ${key}: ${value}`;
  });
  return tree.join('\n');
};

export default stylish;
