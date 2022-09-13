import { test, expect } from '@jest/globals';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { genDiff } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.resolve(__dirname, '..', '__fixtures__', filename);
const readFile = (filepath) => fs.readFileSync(getFixturePath(filepath), 'utf-8');

const expectedResStylish = readFile('compare1n2.Stylish.txt');
const expectedResPlain = readFile('compare1n2.Plain.txt');
const expectedResJSON = readFile('compare1n2.JSON.txt');

test('two json files. Stylish', () => {
  const testFilePath1 = getFixturePath('file1.test.json');
  const testFilePath2 = getFixturePath('file2.test.json');
  expect(genDiff(testFilePath1, testFilePath2, 'stylish')).toEqual(expectedResStylish);
});

test('yaml files. Stylish', () => {
  const testFilePath1 = getFixturePath('file1.test.yaml');
  const testFilePath2 = getFixturePath('file2.test.yml');
  expect(genDiff(testFilePath1, testFilePath2, 'stylish')).toEqual(expectedResStylish);
});

test('two json files. Plain', () => {
  const testFilePath1 = getFixturePath('file1.test.json');
  const testFilePath2 = getFixturePath('file2.test.json');
  expect(genDiff(testFilePath1, testFilePath2, 'plain')).toEqual(expectedResPlain);
});

test('yaml files. Plain', () => {
  const testFilePath1 = getFixturePath('file1.test.yaml');
  const testFilePath2 = getFixturePath('file2.test.yml');
  expect(genDiff(testFilePath1, testFilePath2, 'plain')).toEqual(expectedResPlain);
});

test('two json files. JSON', () => {
  const testFilePath1 = getFixturePath('file1.test.json');
  const testFilePath2 = getFixturePath('file2.test.json');
  expect(genDiff(testFilePath1, testFilePath2, 'json')).toEqual(expectedResJSON);
});

test('yaml files. JSON', () => {
  const testFilePath1 = getFixturePath('file1.test.yaml');
  const testFilePath2 = getFixturePath('file2.test.yml');
  expect(genDiff(testFilePath1, testFilePath2, 'json')).toEqual(expectedResJSON);
});
