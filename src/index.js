import fs from 'fs';
import path from 'path';
import process from 'process';
import _ from 'lodash';
import parse from './parsers.js';
import formatter from './formatters/index.js';

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

const getKey = (comparisionTree) => comparisionTree.key;
const getChildren = (comparisionTree) => comparisionTree.children;
const getGenDiffStatus = (comparisionTree) => comparisionTree.genDiffStatus;

const createComparisionTree = (data1, data2) => {
  const keys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)));
  const res = keys.reduce((acc, key) => {
    const value1 = data1[key];
    const value2 = data2[key];
    if (Object.hasOwn(data1, key)) {
      if (Object.hasOwn(data2, key)) {
        if (_.isEqual(value1, value2)) {
          acc.push({ key, genDiffStatus: 'unchanged', children: value1 });
        } else if (_.isObject(value1) && _.isObject(value2)) {
          acc.push({ key, genDiffStatus: '', children: createComparisionTree(value1, value2) });
        } else {
          acc.push({ key, genDiffStatus: 'updated', children: [value1, value2] });
        }
      } else {
        acc.push({ key, genDiffStatus: 'removed', children: value1 });
      }
    } else {
      acc.push({ key, genDiffStatus: 'added', children: value2 });
    }
    return acc;
  }, []);

  return res;
};

const genDiff = (filepath1, filepath2, format) => {
  const content1 = readFile(getAbsolutePath(filepath1));
  const content2 = readFile(getAbsolutePath(filepath2));
  const comparisionTree = createComparisionTree(content1, content2);
  return formatter(comparisionTree, format);
};

export default genDiff;
export { getChildren, getGenDiffStatus, getKey,
};
