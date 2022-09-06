import _ from 'lodash';

const stylishFormat = (data, depth = 1) => {
  const spaceCount = 4;
  const tree = _.transform(data, (acc, value, key) => {
    let line = '';
    let diff = 0;
    if (key[0] === '-' || key[0] === '+') diff = 2;
    const spaces = (' ').repeat(spaceCount * depth - diff);
    const spacesBeforeBreckets = (' ').repeat(spaceCount * depth);
    if (_.isObject(value)) {
      line = `${spaces}${key}: {\n${stylishFormat(value, depth + 1)}\n${spacesBeforeBreckets}}`;
    } else {
      line = `${spaces}${key}: ${value}`;
    }
    acc.push(line);
    return acc;
  }, []);
  return tree.join('\n');
};

const formatter = (data, style = 'stylish') => {
  switch (style) {
    case 'stylish':
      return `{\n${stylishFormat(data)}\n}`;
    default:
      return JSON.stringify(data, null, ' ');
  }
};

export default formatter;
