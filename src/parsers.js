import { load } from 'js-yaml';

const parse = (data, type) => {
  switch (type) {
    case 'json':
      return JSON.parse(data);
    case 'yaml':
    case 'yml':
      return load(data);
    default:
      throw new Error('improper data type');
  }
};

export default parse;
