import { defineComponent, ref, onMounted, onUnmounted, watch, SetupContext } from 'vue';
import { TimePickerProps, timePickerProps } from './time-picker-types';
import { Icon } from '../../icon';
import useTimePicker from './composables/use-time-picker';
import TimePopup from './components/time-popup/index';
import DInput from '../../input/src/input';

import './time-picker.scss';

export default defineComponent({
  name: 'DTimePicker',
  components: { TimePopup, DInput },
  props: timePickerProps,
  emits: ['change', 'update:modelValue'],
  setup(props: TimePickerProps, ctx: SetupContext) {
    const activeHour = ref('00');
    const activeMinute = ref('00');
    const activeSecond = ref('00');
    const format = props.format.toLowerCase();

    const {
      isActive,
      showPopup,
      devuiTimePicker,
      inputDom,
      left,
      top,
      showClearIcon,
      firsthandActiveTime,
      chooseTime,
      getTimeValue,
      clickVerifyFun,
      isOutOpen,
      clearAll,
      timePopupDom,
      vModeValue,
      getPopupPosition,
    } = useTimePicker(activeHour, activeMinute, activeSecond, format, props);

    const selectedTimeChange = () => {
      isActive.value = false;
      showPopup.value = false;
      ctx.emit('change', vModeValue.value);
    };
    onMounted(() => {
      getPopupPosition();
      isOutOpen();
      document.addEventListener('click', clickVerifyFun);
      document.addEventListener('click', getTimeValue);
      document.addEventListener('scroll', getPopupPosition);
      window.addEventListener('resize', getPopupPosition);
    });
    onUnmounted(() => {
      document.removeEventListener('click', clickVerifyFun);
      document.removeEventListener('click', getTimeValue);
      document.removeEventListener('scroll', getPopupPosition);
      window.removeEventListener('resize', getPopupPosition);
    });

    watch(vModeValue, (newValue: string) => {
      ctx.emit('update:modelValue', vModeValue.value);
      if (newValue !== props.minTime && newValue !== '00:00') {
        showClearIcon.value = true;
      } else {
        showClearIcon.value = false;
      }
    });

    ctx.expose({
      clearAll,
      chooseTime,
    });

    return () => {
      return (
        <>
          <div
            class={`devui-time-picker ${isActive.value ? 'time-picker-active' : ''} ${props.disabled ? 'picker-disabled' : ''}`}
            ref={devuiTimePicker}>
            {showPopup.value && (
              <TimePopup
                ref={timePopupDom}
                showPopup={showPopup.value}
                popupTop={top.value}
                popupLeft={left.value}
                popupWidth={props.timePickerWidth}
                popupFormat={props.format.toLowerCase()}
                minTime={props.minTime}
                maxTime={props.maxTime}
                bindData={firsthandActiveTime.value}
                onSubmitData={selectedTimeChange}>
                {ctx.slots.customViewTemplate?.()}
              </TimePopup>
            )}
            <DInput
              ref={inputDom}
              modelValue={vModeValue.value}
              placeholder={props.placeholder}
              disabled={props.disabled}
              readonly={props.readonly}
              size={props.size}
              v-slots={{
                suffix: () => (
                  <span class="time-input-icon">
                    <span onClick={clearAll} class="clear-button">
                      {showClearIcon.value ? <Icon size="small" name="close" /> : ''}
                    </span>
                    <Icon size="small" name="time" />
                  </span>
                ),
              }}></DInput>
          </div>
        </>
      );
    };
  },
});
