#!/usr/bin/env node
import { Command } from "commander";
import genDiff from '../src/index.js';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { receiveMessageOnPort } from "worker_threads";
const program = new Command();

program
    .name('gendiff')
    .description('Compares two configuration files and shows a difference.')
    .version('1.0.0')
    .arguments('<filepath1> <filepath2>')
    .option('-f, --format <type>', 'output format')
    .action((filepath1, filepath2) => console.log(genDiff(filepath1, filepath2)))
    .parse();