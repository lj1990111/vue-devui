import { defineComponent } from 'vue';
import { SearchProps, searchProps } from './search-types';
import { getRootClass } from './composables/use-search-class';
import { keywordsHandles } from './composables/use-search-keywords';
import { keydownHandles } from './composables/use-search-keydown';
import DInput from '../../input/src/input';
import { useNamespace } from '../../shared/hooks/use-namespace';
import './search.scss';

export default defineComponent({
  name: 'DSearch',
  props: searchProps,
  emits: ['update:modelValue', 'search'],
  setup(props: SearchProps, ctx) {
    const ns = useNamespace('search');
    const rootClasses = getRootClass(props);
    const { keywords, clearIconShow, onClearHandle } = keywordsHandles(ctx, props);
    const { onInputKeydown, onClickHandle, useEmitKeyword } = keydownHandles(ctx, keywords, props);

    const onInputUpdate = (event: string) => {
      if (props.isKeyupSearch) {
        useEmitKeyword(event);
      }
      keywords.value = event;
      ctx.emit('update:modelValue', event);
    };

    return () => {
      const inputProps = {
        size: props.size,
        disabled: props.disabled,
        autoFocus: props.autoFocus,
        modelValue: keywords.value,
        placeholder: props.placeholder,
        maxLength: props.maxLength,
        cssClass: props.cssClass,
        onKeydown: onInputKeydown,
        'onUpdate:modelValue': onInputUpdate,
      };
      return (
        <div class={rootClasses.value}>
          {props.iconPosition === 'left' && (
            <div class={ns.e('icon')} onClick={onClickHandle}>
              <d-icon name="search" size="inherit" key="search"></d-icon>
            </div>
          )}
          <DInput {...inputProps}></DInput>
          {clearIconShow.value && (
            <div class={ns.e('clear')} onClick={onClearHandle}>
              <d-icon name="close" size="inherit" key="close"></d-icon>
            </div>
          )}
          {props.iconPosition === 'right' && (
            <div class={ns.e('icon')} onClick={onClickHandle}>
              <d-icon name="search" size="inherit" key="search"></d-icon>
            </div>
          )}
        </div>
      );
    };
  },
});
