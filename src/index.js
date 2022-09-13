import fs from 'fs';
import path from 'path';
import process from 'process';
import parse from './parsers.js';
import formatter from './formatters/index.js';
import createComparisionTree from './makeTree.js';

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

const genDiff = (filepath1, filepath2, format) => {
  const content1 = readFile(getAbsolutePath(filepath1));
  const content2 = readFile(getAbsolutePath(filepath2));
  const comparisionTree = createComparisionTree(content1, content2);
  return formatter(comparisionTree, format);
};

export default genDiff;
