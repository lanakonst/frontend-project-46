import fs from 'fs';
import path from 'path';
import process from 'process';
import _ from 'lodash';

const getAbsolutePath = (filepath) => {
  const current = process.cwd();
  return path.resolve(current, filepath);
};

const readFile = (filepath) => {
  const absPath = getAbsolutePath(filepath);
  const content = fs.readFileSync(absPath, 'utf-8');
  return JSON.parse(content);
};

const compareFiles = (data1, data2) => {
  const keys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)));
  const res = keys.reduce((acc, key) => {
    const value1 = data1[key];
    const value2 = data2[key];
    let newKey;
    if (Object.hasOwn(data1, key)) {
      if (Object.hasOwn(data2, key)) {
        if (_.isEqual(value1, value2)) {
          acc[key] = value1;
        } else {
          newKey = `- ${key}`;
          acc[newKey] = value1;
          newKey = `+ ${key}`;
          acc[newKey] = value2;
        }
      } else {
        newKey = `- ${key}`;
        acc[newKey] = value1;
      }
    } else {
      newKey = `+ ${key}`;
      acc[newKey] = value2;
    }
    return acc;
  }, {});

  return res;
};

const genDiff = (filepath1, filepath2) => {
  if (_.last(filepath1.split('.')) !== 'json' || _.last(filepath2.split('.')) !== 'json') return 'improper file extension';
  const content1 = readFile(getAbsolutePath(filepath1));
  const content2 = readFile(getAbsolutePath(filepath2));
  return JSON.stringify(compareFiles(content1, content2), null, ' ');
};

export default genDiff;
