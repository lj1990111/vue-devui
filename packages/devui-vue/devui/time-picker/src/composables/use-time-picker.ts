import { Ref, ref } from 'vue';
import { TimeObj, UseTimerPickerFn } from '../types';
import { getPositionFun } from '../utils';
import { TimePickerProps } from '../time-picker-types';

export default function useTimePicker(hh: Ref, mm: Ref, ss: Ref, format: string, props: TimePickerProps): UseTimerPickerFn {
  const isActive = ref(false);
  const showPopup = ref(false);
  const devuiTimePicker = ref();
  const inputDom = ref();
  const left = ref(-100);
  const top = ref(-100);
  const timePopupDom = ref();
  const timePickerValue = ref('');
  const showClearIcon = ref(false);
  const firsthandActiveTime = ref(`${hh.value}:${mm.value}:${ss.value}`);
  const vModeValue = ref(props.modelValue);

  const getPopupPosition = () => {
    getPositionFun(devuiTimePicker.value, left, top);
  };
  const setInputValue = (h: string, m: string, s: string) => {
    if (format === 'hh:mm:ss') {
      vModeValue.value = `${h}:${m}:${s}`;
    } else if (format === 'mm:hh:ss') {
      vModeValue.value = `${m}:${h}:${s}`;
    } else if (format === 'hh:mm') {
      vModeValue.value = `${h}:${m}`;
    } else if (format === 'mm:ss') {
      vModeValue.value = `${m}:${s}`;
    }
  };

  const mouseInputFun = () => {
    if (firsthandActiveTime.value === '00:00:00') {
      const vModelValueArr = vModeValue.value.split(':');
      const minTimeValueArr = props.minTime.split(':');
      const maxTimeValueArr = props.maxTime.split(':');

      vModeValue.value === '' ? (vModeValue.value = '00:00:00') : '';

      if (vModeValue.value >= props.minTime && vModeValue.value <= props.maxTime) {
        firsthandActiveTime.value = vModeValue.value;
        setInputValue(vModelValueArr[0], vModelValueArr[1], vModelValueArr[2]);
      } else if (vModeValue.value > props.maxTime) {
        firsthandActiveTime.value = props.maxTime;
        setInputValue(maxTimeValueArr[0], maxTimeValueArr[1], maxTimeValueArr[2]);
      } else {
        firsthandActiveTime.value = props.minTime;
        setInputValue(minTimeValueArr[0], minTimeValueArr[1], minTimeValueArr[2]);
      }
    }
    isActive.value = true;
    showPopup.value = true;
  };

  const clickVerifyFun = (e: any) => {
    e.stopPropagation();
    isActive.value = false;
    showPopup.value = false;

    if (props.disabled || props.readonly) {
      return;
    }

    const path = (e.composedPath && e.composedPath()) || e.path;
    const inInputDom = path.includes(devuiTimePicker.value);
    inInputDom && mouseInputFun();
  };

  const getTimeValue = (e: MouseEvent) => {
    e.stopPropagation();
    if (showPopup.value) {
      hh.value = timePopupDom.value.changTimeData().activeHour.value;
      mm.value = timePopupDom.value.changTimeData().activeMinute.value;
      ss.value = timePopupDom.value.changTimeData().activeSecond.value;
      firsthandActiveTime.value = `${hh.value}:${mm.value}:${ss.value}`;
      setInputValue(hh.value, mm.value, ss.value);
    }
  };

  const clearAll = (e: MouseEvent) => {
    e.stopPropagation();
    showPopup.value = false;

    if (props.minTime !== '00:00:00') {
      const minTimeArr = props.minTime.split(':');
      hh.value = minTimeArr[0];
      mm.value = minTimeArr[1];
      ss.value = minTimeArr[2];
    } else {
      hh.value = '00';
      mm.value = '00';
      ss.value = '00';
    }
    firsthandActiveTime.value = `${hh.value}:${mm.value}:${ss.value}`;
    setInputValue(hh.value, mm.value, ss.value);
  };

  const isOutOpen = () => {
    if (props.autoOpen) {
      mouseInputFun();
      isActive.value = true;
      showPopup.value = props.autoOpen;
    }
  };

  // slot -- 选择时间
  const chooseTime = (slotTime: TimeObj) => {
    if (slotTime.type) {
      if (slotTime.type.toLowerCase() === 'hh') {
        hh.value = slotTime.time;
      } else if (slotTime.type.toLowerCase() === 'mm') {
        mm.value = slotTime.time;
      } else if (slotTime.type.toLowerCase() === 'ss') {
        ss.value = slotTime.time;
      }
      firsthandActiveTime.value = `${hh.value}:${mm.value}:${ss.value}`;
      setInputValue(hh.value, mm.value, ss.value);
    } else {
      const timeArr = slotTime.time.split(':');
      hh.value = timeArr[0];
      mm.value = timeArr[1];
      ss.value = timeArr[2];
      firsthandActiveTime.value = `${hh.value}:${mm.value}:${ss.value}`;
      setInputValue(hh.value, mm.value, ss.value);
    }
  };

  return {
    isActive,
    showPopup,
    devuiTimePicker,
    timePickerValue,
    inputDom,
    timePopupDom,
    left,
    top,
    showClearIcon,
    firsthandActiveTime,
    vModeValue,
    getPopupPosition,
    getTimeValue,
    clickVerifyFun,
    isOutOpen,
    clearAll,
    chooseTime,
  };
}
