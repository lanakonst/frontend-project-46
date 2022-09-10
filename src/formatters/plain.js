import _ from 'lodash';

const renameChildren = (parentKey, obj) => _.mapKeys(obj, (value, key) => {
  let sign = '';
  let newKey = key;
  if (key.slice(0, 2) === '+-' || key.slice(0, 2) === '-+') {
    sign = key.slice(0, 2);
    newKey = key.slice(3);
  } else if (key[0] === '+' || key[0] === '-') {
    [sign, ...newKey] = key;
    newKey = newKey.join('').trimStart();
  }
  return `${sign}${parentKey}.${newKey}`;
});

const plain = (data) => {
  const tree = _.transform(data, (acc, value, signedKey) => {
    let line = '';
    let sign = '';
    let key = signedKey;

    if (signedKey.slice(0, 2) === '+-' || signedKey.slice(0, 2) === '-+') {
      sign = signedKey.slice(0, 2);
      key = signedKey.slice(2);
    } else if (signedKey[0] === '+' || signedKey[0] === '-') {
      [sign, ...key] = key;
      key = key.join('').trimStart();
    }
    key = key.trimStart();
    if (sign === '-') {
      line = `Property '${key}' was removed`;
    } else if (sign === '+') {
      let newVal = _.isString(value) ? `'${value}'` : value;
      newVal = _.isObject(newVal) ? '[complex value]' : newVal;
      line = `Property '${key}' was added with value: ${newVal}`;
    } else if (sign === '+-') {
      let value1 = _.isString(value) ? `'${value}'` : value;
      value1 = _.isObject(value1) ? '[complex value]' : value1;
      line = `${line}Property '${key}' was updated. From ${value1} to `;
    } else if (sign === '-+') {
      let value2 = _.isString(value) ? `'${value}'` : value;
      value2 = _.isObject(value2) ? '[complex value]' : value2;
      line = `${_.last(acc)}${value2}`;
      acc[acc.length - 1] = line;
      return acc;
    } else if (_.isObject(value)) {
      line = `${line}${plain(renameChildren(key, value))}`;
    }
    acc.push(line);
    return acc;
  }, []);

  return tree.filter((line) => line.length > 0).join('\n');
};

export default plain;
