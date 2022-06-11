import { Ref, ref, computed } from 'vue';
import { TimeObj, UseTimerPickerFn, popupTimeObj } from '../types';
import { TimePickerProps } from '../time-picker-types';
import { onClickOutside } from '@vueuse/core';

export default function useTimePicker(hh: Ref, mm: Ref, ss: Ref, format: string, props: TimePickerProps): UseTimerPickerFn {
  const showPopup = ref(false);
  const devuiTimePicker = ref();
  const inputDom = ref<HTMLElement>();
  const overlayRef = ref<HTMLElement>();
  const timePopupDom = ref();
  const timePickerValue = ref('');
  const showClearIcon = ref(false);
  const firsthandActiveTime = ref(`${hh.value}:${mm.value}:${ss.value}`);
  const vModeValue = ref(props.modelValue);

  const setTrueTime = (h: string, m: string, s: string) => {
    let value = '00:00:00';
    if (format === 'hh:mm:ss') {
      value = `${h}:${m}:${s}`;
    } else if (format === 'mm:hh:ss') {
      value = `${m}:${h}:${s}`;
    } else if (format === 'hh:mm') {
      value = `${h}:${m}`;
    } else if (format === 'mm:ss') {
      value = `${m}:${s}`;
    }
    return value;
  };
  const trueTimeValue = computed(()=> {
    const arr = vModeValue.value.split(":");
    return setTrueTime(arr[0],arr[1],arr[2]);
  });

  const setInputValue = (h: string, m: string, s: string) => {
    vModeValue.value = `${h}:${m}:${s}`;
  };
  const formatTime = () => {
    let modelValue = vModeValue.value || "00:00:00";
    if (['hh:mm','mm:ss'].includes(format)) {
      modelValue = vModeValue.value || "00:00";
    }
    const timeArr = modelValue.split(":");
    if (format === 'hh:mm:ss') {
      firsthandActiveTime.value = modelValue;
    } else if (format === 'mm:hh:ss') {
      firsthandActiveTime.value = `${timeArr[1]}:${timeArr[0]}:${timeArr[2]}`;
    } else if (format === 'hh:mm') {
      firsthandActiveTime.value = `${timeArr[0]}:${timeArr[1]}:00`;
    } else if (format === 'mm:ss') {
      firsthandActiveTime.value = `00:${timeArr[0]}:${timeArr[1]}`;
    }
    vModeValue.value = firsthandActiveTime.value;
  };

  const initTime= ()=> {
    if (!vModeValue.value) {
      vModeValue.value = '00:00:00';
    }
    formatTime();
  };
  initTime();

  const changeTimeData = ({ activeHour, activeMinute, activeSecond }: popupTimeObj) => {
    hh.value = activeHour.value;
    mm.value = activeMinute.value;
    ss.value = activeSecond.value;
    firsthandActiveTime.value = `${hh.value}:${mm.value}:${ss.value}`;
    setInputValue(hh.value, mm.value, ss.value);
  };

  const mouseInputFun = () => {
    const minTimeValueArr = props.minTime.split(':');
    const maxTimeValueArr = props.maxTime.split(':');

    if (vModeValue.value > props.maxTime) {
      firsthandActiveTime.value = props.maxTime;
      setInputValue(maxTimeValueArr[0], maxTimeValueArr[1], maxTimeValueArr[2]);
    } else if (vModeValue.value < props.minTime) {
      firsthandActiveTime.value = props.minTime;
      setInputValue(minTimeValueArr[0], minTimeValueArr[1], minTimeValueArr[2]);
    }
    showPopup.value = true;
  };

  const clickVerifyFun = (e: any) => {
    e.stopPropagation();

    if (props.disabled || props.readonly) {
      return;
    }
    mouseInputFun();
  };

  onClickOutside(devuiTimePicker, () => {
    showPopup.value = false;
  });

  const clearAll = (e: MouseEvent) => {
    e.stopPropagation();

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
    showPopup,
    trueTimeValue,
    devuiTimePicker,
    timePickerValue,
    inputDom,
    timePopupDom,
    showClearIcon,
    firsthandActiveTime,
    vModeValue,
    clickVerifyFun,
    isOutOpen,
    clearAll,
    chooseTime,
    overlayRef,
    changeTimeData,
  };
}
