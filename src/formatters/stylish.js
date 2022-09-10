import _ from 'lodash';

const stylish = (data, depth = 1) => {
  const spaceCount = 4;
  const tree = _.transform(data, (acc, value, signedKey) => {
    let key = signedKey;
    if (signedKey.slice(0, 2) === '+-' || signedKey.slice(0, 2) === '-+') {
      key = signedKey.slice(1);
    }
    let line = '';
    let diff = 0;
    if (key[0] === '-' || key[0] === '+') diff = 2;
    const spaces = (' ').repeat(spaceCount * depth - diff);
    const spacesBeforeBreckets = (' ').repeat(spaceCount * depth);
    if (_.isObject(value)) {
      line = `${spaces}${key}: {\n${stylish(value, depth + 1)}\n${spacesBeforeBreckets}}`;
    } else {
      line = `${spaces}${key}: ${value}`;
    }
    acc.push(line);
    return acc;
  }, []);
  return tree.join('\n');
};

export default stylish;
