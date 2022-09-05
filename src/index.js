import fs from 'fs';
import path from 'path';
import process from 'process';
import _ from 'lodash';
import parse from './parsers.js';

const getAbsolutePath = (filepath) => {
  const current = process.cwd();
  return path.resolve(current, filepath);
};

const readFile = (filepath) => {
  const absPath = getAbsolutePath(filepath);
  const content = fs.readFileSync(absPath, 'utf-8');
  const extension = path.extname(filepath);
  return parse(content, extension);
};

const compareFiles = (data1, data2) => {
  const keys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)));
  const res = keys.map((key) => {
    const value1 = data1[key];
    const value2 = data2[key];
    if (Object.hasOwn(data1, key)) {
      if (Object.hasOwn(data2, key)) {
        if (_.isEqual(value1, value2)) return `    ${key}: ${value1}`;
        return `  - ${key}: ${value1}\n  + ${key}: ${value2}`;
      }
      return `  - ${key}: ${value1}`;
    }
    return `  + ${key}: ${value2}`;
  });
  return ['{', ...res, '}'];
};

const genDiff = (filepath1, filepath2) => {
  const content1 = readFile(getAbsolutePath(filepath1));
  const content2 = readFile(getAbsolutePath(filepath2));
  return compareFiles(content1, content2).join('\n');
};

export default genDiff;
