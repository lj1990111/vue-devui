import { CascaderItem } from '../src/cascader-types';
export const setChildrenParent = (parentNode: CascaderItem): CascaderItem => {
  if (parentNode.children && parentNode.children.length) {
    parentNode.children.forEach((child) => {
      child.parent = parentNode;
      // 父级为disbled，子级添加为disabled
      if (parentNode.disabled) {
        child.disabled = true;
      }
    });
  }
  return parentNode;
};

export const addParent = (data: CascaderItem[]): CascaderItem[] => {
  data.forEach((item) => {
    if (item.children && item.children.length) {
      setChildrenParent(item);
      addParent(item.children);
    } else {
      item.isLeaf = true;
    }
  });
  return data;
};
