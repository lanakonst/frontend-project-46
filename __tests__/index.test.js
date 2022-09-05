import { test, expect } from '@jest/globals';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.resolve(__dirname, '..', '__fixtures__', filename);
const readFile = (filepath) => fs.readFileSync(getFixturePath(filepath), 'utf-8');

const expectedRes = readFile('compare1n2.txt');

test('two json files', () => {
  const testFilePath1 = getFixturePath('file1.test.json');
  const testFilePath2 = getFixturePath('file2.test.json');
  expect(genDiff(testFilePath1, testFilePath2)).toEqual(expectedRes);
});

test('yaml files', () => {
  const testFilePath1 = getFixturePath('file1.test.yaml');
  const testFilePath2 = getFixturePath('file2.test.yml');
  expect(genDiff(testFilePath1, testFilePath2)).toEqual(expectedRes);
});
