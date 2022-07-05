/**
 * 多选模式下的内容框中的选中tag
 * tag组件还未开发完成，所以暂时使用自定义组件
 */
import { CascaderItem } from '../../src/cascader-types';
import { multipleDeleteTag } from '../../hooks/use-cascader-multiple';

import './index.scss';

interface PropsType {
  tag: CascaderItem;
  tagList: CascaderItem[];
  cascaderOptions: CascaderItem[];
  allNodes: CascaderItem[];
}

export default (props: PropsType): JSX.Element => {
  const { tagList, tag, cascaderOptions, allNodes } = props;
  const deleteCurrentTag = (e: Event) => {
    e.stopPropagation();
    multipleDeleteTag(tagList, tag, cascaderOptions, allNodes);
  };
  return (
    <div class="devui-cascader-tag">
      <span>{tag?.label}</span>
      <div class="devui-cascader-tag__close" onClick={deleteCurrentTag}>
        <d-icon name="close"></d-icon>
      </div>
    </div>
  );
};
