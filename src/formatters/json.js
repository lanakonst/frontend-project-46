import _ from 'lodash';

const renameUpdated = (data) => {
  const newData = _.transform(data, (acc, value, key) => {
    let newKey = key;
    if (key.slice(0, 2) === '+-' || key.slice(0, 2) === '-+') {
      newKey = key.slice(1);
    }
    if (_.isObject(value)) {
      acc[newKey] = renameUpdated(value);
    } else {
      acc[newKey] = value;
    }
    return acc;
  }, {});
  return newData;
};

const json = (data) => JSON.stringify(renameUpdated(data));

export default json;
