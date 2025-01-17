import { computed, inject } from 'vue';
import { FORM_TOKEN, FormContext } from '../../form-types';
import { FormItemContext, FORM_ITEM_TOKEN } from '../form-item/form-item-types';
import { UseFormLabel } from './form-label-types';
import { useNamespace } from '../../../../shared/hooks/use-namespace';

export function useFormLabel(): UseFormLabel {
  const formContext = inject(FORM_TOKEN) as FormContext;
  const formItemContext = inject(FORM_ITEM_TOKEN) as FormItemContext;
  const ns = useNamespace('form');

  const labelClasses = computed(() => ({
    [`${ns.e('label')}`]: true,
    [`${ns.em('label', 'vertical')}`]: formContext.layout === 'vertical',
    [`${ns.em('label', formContext.labelSize)}`]: formContext.layout === 'horizontal',
    [`${ns.em('label', formContext.labelAlign)}`]: formContext.layout === 'horizontal',
  }));

  const labelInnerClasses = computed(() => ({
    [`${ns.e('label-span')}`]: true,
    [`${ns.em('label', 'required')}`]: formItemContext.isRequired,
  }));

  return { labelClasses, labelInnerClasses };
}
