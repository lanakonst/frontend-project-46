import plain from './plain.js';
import stylish from './stylish.js';

const formatter = (data, style = 'stylish') => {
  switch (style) {
    case 'plain':
      return plain(data);
    case 'json':
      return JSON.stringify(data);
    default:
      return `{\n${stylish(data)}\n}`;
  }
};

export default formatter;
