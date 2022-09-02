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

const valToString = (value) => {
    if (Array.isArray(value)) return `${JSON.stringify(value)}`;
    return `${JSON.stringify(value, null, ' ')}`;
}

const compareFiles = (data1, data2) => {
    let res = [];
    const keys = _.union(Object.keys(data1), Object.keys(data2)).sort();

    for (const key of keys) {
        const value1 = data1[key];
        const valAsString1 = valToString(value1);
        const value2 = data2[key];
        const valAsString2 = valToString(value2);
        if (Object.hasOwn(data1, key)) {
            if (Object.hasOwn(data2, key)) {
                if (_.isEqual(value1, value2)) {
                    res.push(`  ${key}: ${valAsString1}`);
                } else {
                    res.push(`- ${key}: ${valAsString1}`);
                    res.push(`+ ${key}: ${valAsString2}`);
                }
            } else {
                res.push(`- ${key}: ${valAsString1}`);
            }
        } else {
            res.push(`+ ${key}: ${valAsString2}`);
        }
    }
    return(res.join('\n'));
};

const genDiff = (filepath1, filepath2) => {
    const content1 = readFile(getAbsolutePath(filepath1));
    const content2 = readFile(getAbsolutePath(filepath2));
    console.log(getAbsolutePath(filepath1))
    return compareFiles(content1, content2);
};


export default genDiff;