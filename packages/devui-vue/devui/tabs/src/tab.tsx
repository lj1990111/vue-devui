import { defineComponent, inject } from 'vue';
import { tabProps } from './tab-types';
import type { Tabs } from './tabs-types';
import { useNamespace } from '../../shared/hooks/use-namespace';

export default defineComponent({
  name: 'DTab',
  props: tabProps,
  setup(props, { slots }) {
    const tabs = inject<Tabs>('tabs');
    tabs.state.slots.push(slots.title);
    tabs.state.data.push(props);
    const ns = useNamespace('tab');
    return () => {
      const { id } = props;
      const content =
        tabs.state.showContent && tabs.state.active === id ? (
          <div class={ns.e('content')}>
            <div role="tabpanel">{slots.default()}</div>
          </div>
        ) : null;
      return content;
    };
  },
});
