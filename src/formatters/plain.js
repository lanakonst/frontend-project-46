import _ from 'lodash';

const renameChildren = (parentKey, arrOfchildren) => arrOfchildren.map((child) => {
  const { key, status } = child;
  if (status === 'nested') return { key: `${parentKey}.${key}`, status, children: child.children };
  return { key: `${parentKey}.${key}`, status, value: child.value };
});

const valueToLine = (value) => {
  if (_.isObject(value)) return '[complex value]';
  if (_.isString(value)) return `'${value}'`;
  return value;
};

const plain = (data) => {
  const tree = data.flatMap((obj) => {
    const { key, status } = obj;
    if (status === 'nested') {
      return `${plain(renameChildren(key, obj.children))}`;
    }
    const { value } = obj;
    if (status === 'updated') {
      const initValue = valueToLine(value[0]);
      const newValue = valueToLine(value[1]);
      return `Property '${key}' was updated. From ${initValue} to ${newValue}`;
    }
    if (status === 'removed') {
      return `Property '${key}' was removed`;
    }
    if (status === 'added') {
      return `Property '${key}' was added with value: ${valueToLine(value)}`;
    }
    return '';
  });
  return tree.filter((line) => line.length > 0).join('\n');
};

export default plain;
