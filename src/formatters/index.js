import plain from './plain.js';
import stylish from './stylish.js';
import json from './json.js';

const formatter = (data, style = 'stylish') => {
  switch (style) {
    case 'plain':
      return plain(data);
    case 'json':
      return json(data);
    default:
      return `{\n${stylish(data)}\n}`;
  }
};

export default formatter;
