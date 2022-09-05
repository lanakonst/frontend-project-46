import { load } from 'js-yaml';

const parse = (file, extension) => {
  switch (extension) {
    case '.json':
      return JSON.parse(file);
    case '.yaml':
    case '.yml':
      return load(file);
    default:
      throw new Error('improper file extension');
  }
};

export default parse;
