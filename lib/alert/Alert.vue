<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  useSlots
} from "vue";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ChatBubbleOvalLeftIcon
} from '@heroicons/vue/20/solid';
import Button from 'primevue/button';
import type {IAlertProps} from 'primevue/alert';
import type {StyleClass} from 'primevue/baseTypes';
import {tailwind} from 'primevue/utils';
// ---------------------------------------
const props = defineProps<IAlertProps>()
const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void;
}>();
const $slots = useSlots()
// ---------------------------------------
const isVisible = ref(props.modelValue)
const type = computed<NonNullable<IAlertProps["type"]>>(()=> props.type ?? "success")
const title = computed<NonNullable<IAlertProps["title"]>>(()=> props.title ?? "")
const subtitle = computed<NonNullable<IAlertProps["subtitle"]>>(()=> props.subtitle ?? "")
const displayTime = computed<number>(()=> props.displayTime && !!+props.displayTime ? +props.displayTime : 0)
const isCloseButton = computed<NonNullable<IAlertProps["closeButton"]>>(()=>props.closeButton ?? false)
const position = computed<NonNullable<IAlertProps["position"]>>(()=> props.position ?? "top")
const classClass = computed<IAlertProps["class"]>(()=> props.class)
const startEnterAndLeaveClass = computed<StyleClass>(()=> {
  if (!props.notAnimate) {
    if(position.value.includes("left")){ return "-translate-x-[200%] opacity-0"}
    else if(position.value.includes("right")){ return "translate-x-[200%] opacity-0"}
    else if(position.value.includes("top")){ return "-translate-y-[200%] opacity-0"}
    else if(position.value.includes("bottom")){ return "translate-y-[200%] opacity-0"}}
  return "opacity-0"
})
const endEnterAndLeaveClass = computed<StyleClass>(()=> {
  if (!props.notAnimate) {
    if(position.value.includes("left")){ return "translate-x-0 opacity-100"}
    else if(position.value.includes("right")){ return "translate-x-0 opacity-100"}
    else if(position.value.includes("top")){ return "translate-y-0 opacity-100"}
    else if(position.value.includes("bottom")){ return "translate-y-0 opacity-100"}}
  return "opacity-100"
})
const style = computed<{body: string, icon: string, title: string, subtitle:string, button:string, buttonIcon:string}>(()=>{
  switch (type.value) {
    case "success": return {body: "bg-green-50 dark:bg-green-950", icon: "text-green-400 dark:text-green-600", title: "text-green-800 dark:text-green-200", subtitle: "text-green-700 dark:text-green-300", button: "hover:bg-green-200 dark:hover:bg-green-800", buttonIcon: "fill-green-500 dark:fill-green-500"}
    case "warning": return {body: "bg-yellow-50 dark:bg-yellow-950", icon: "text-yellow-400 dark:text-yellow-600", title: "text-yellow-800 dark:text-yellow-200", subtitle: "text-yellow-700 dark:text-yellow-300", button: "hover:bg-yellow-200 dark:hover:bg-yellow-800", buttonIcon: "fill-yellow-500 dark:fill-yellow-500"}
    case "info": return {body: "bg-blue-50 dark:bg-blue-950", icon: "text-blue-400 dark:text-blue-600", title: "text-blue-800 dark:text-blue-200", subtitle: "text-blue-700 dark:text-blue-300", button: "hover:bg-blue-200 dark:hover:bg-blue-800", buttonIcon: "fill-blue-500 dark:fill-blue-500"}
    case "error": return {body: "bg-red-50 dark:bg-red-950", icon: "text-red-400 dark:text-red-600", title: "text-red-800 dark:text-red-200", subtitle: "text-red-700 dark:text-red-300", button: "hover:bg-red-200 dark:hover:bg-red-800", buttonIcon: "fill-red-500 dark:fill-red-500"}
    case "neutral": return {body: "bg-neutral-100 dark:bg-neutral-800", icon: "text-neutral-400 dark:text-neutral-600", title: "text-neutral-600 dark:text-neutral-300", subtitle: "text-neutral-500 dark:text-neutral-400", button: "hover:bg-neutral-200 dark:hover:bg-neutral-700", buttonIcon: "fill-neutral-500 dark:fill-neutral-500"}
  }
})
const icon = computed(()=>{
  switch (type.value) {
    case "success": return CheckCircleIcon
    case "warning": return ExclamationTriangleIcon
    case "info": return InformationCircleIcon
    case "error": return XCircleIcon
    case "neutral": return ChatBubbleOvalLeftIcon
  }
})
const size = computed<string>(()=> {
  switch (props.size) {
    case "xs": return "sm:max-w-xs";case "sm": return "sm:max-w-sm";case "md": return "sm:max-w-md";
    case "lg": return "sm:max-w-lg";case "xl": return "sm:max-w-xl";case "2xl": return "sm:max-w-2xl";
    case "3xl": return "sm:max-w-3xl";case "4xl": return "sm:max-w-4xl";case "5xl": return "sm:max-w-5xl";
    case "6xl": return "sm:max-w-6xl";case "7xl": return "sm:max-w-7xl";default: return "sm:max-w-2xl"
  }
})
watch(()=>props.modelValue, (value)=>{
  isVisible.value = value
  if (displayTime.value >= 100 && value){
    setTimeout(()=> {
      isVisible.value = false
      emit('update:modelValue', false)
    }, displayTime.value)
  }
},{immediate: true})
function close() {
  isVisible.value = false
  emit('update:modelValue', false)
}
</script>
<script lang="ts">
import { createApp } from 'vue';
import Alert from "primevue/alert";
import type {IAlert} from 'primevue/alert';
// ---------------------------------------
export function openAlert(optionsAlert:IAlert) {
  /////////////////////////////////////////////////////////
  // SET options
  const options:IAlert = Object.assign({},optionsAlert)
  /////////////////////////////////////////////////////////
  // SET alertId
  const max = 1000; const min = 100
  const id = Math.floor(Math.random() * (max - min)) + min
  const alertId = `alert-${id}`
  /////////////////////////////////////////////////////////
  // SET options
  if (!options.position) { options.position = "top" }
  if (typeof options?.modelValue !== "boolean") { options.modelValue = true }
  // const alerts = [...document.querySelectorAll('.alert.top .alert-body')]
  // if (alerts.length) {
  //   const lastAlert = alerts[alerts.length-1].getBoundingClientRect()
  //   options.style = {
  //     transform: `translate(-50%, ${lastAlert.height + lastAlert.top}px)`
  //   }
  // }
  /////////////////////////////////////////////////////////
  const alertBody = document.querySelector(`.alert-${options.position}`)
  if (alertBody) {
    let divAlert = document.createElement('div');
    divAlert.id = alertId;
    divAlert.className = 'z-[100]'
    divAlert.style.cssText = "pointer-events: all;"
    alertBody.prepend(divAlert);
  } else {
    let div = document.createElement('div');
    div.className = `alert-${options.position} fixed z-[100] flex gap-4 overflow-auto max-h-screen pointer-events-none transition-all duration-500 ${
      options.position.includes("bottom") ? 'flex-col-reverse': 'flex-col'
    } ${
      options.position.includes("left")
        ? 'items-start'
        : options.position.includes("right")
          ? 'items-end'
          : 'items-center'
    } ${alertClassPosition(options.position).join(" ")}`
    document.body.append(div);
    // SET div alert
    let divAlert = document.createElement('div');
    divAlert.id = alertId;
    divAlert.className = 'z-[100]'
    divAlert.style.cssText = "pointer-events: all;"
    div.prepend(divAlert);
  }
  /////////////////////////////////////////////////////////
  // SET mount
  const alert = createApp(Alert, {...options})
  alert.mount(`#${alertId}`)
  /////////////////////////////////////////////////////////
  // SET destroy
  let timer:number|null = null
  if (options.displayTime && +(options.displayTime) >= 100){
    timer = +setTimeout(()=>destroy(), +(options.displayTime))
  }
  const alertButton = document.querySelector(`#${alertId} .button-delete`)
  if (alertButton){
    alertButton.addEventListener("click", destroy)
  }
  /////////////////////////////////////////////////////////
  // functions
  function destroy() {
    const alertEl = document.querySelector(`#${alertId}`);
    if (alertEl) {
      alertEl.className = 'z-10'
    }
    if (typeof timer === "number" && timer > 0) {
      clearTimeout(timer)
    }
    setTimeout( ()=>{
      alert.unmount()
      const divAlert = document.querySelector(`#${alertId}`)
      if (divAlert){ divAlert.remove() }
      const alertBodyForDelete = document.querySelector(`.alert-${options.position}`)
      if (alertBodyForDelete && alertBodyForDelete.childElementCount === 0){
        alertBodyForDelete.remove()
      }
    }, 600)
  }
  function alertClassPosition(position:IAlert["position"]="center"):Array<string>{
    const arrayClass:Array<string> = [];
    if (position === "center") {
      arrayClass.push("top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2")}
    if(position.includes("bottom")) { arrayClass.push(`bottom-0 mb-5`)
    } else if(position.includes("top")) { arrayClass.push(`top-0 mt-5`)
    } else { arrayClass.push("top-1/2 -translate-y-1/2") }
    if(position.includes("right")) { arrayClass.push(`right-0 mr-5`)
    } else if(position.includes("left")) { arrayClass.push(`left-0 ml-5`)
    } else { arrayClass.push("left-1/2 -translate-x-1/2") }
    return arrayClass
  }
}

</script>

<template>
  <transition appear leave-active-class="transition-all ease-in-out duration-500" :leave-from-class="endEnterAndLeaveClass" :leave-to-class="startEnterAndLeaveClass"
              enter-active-class="transition-all ease-in-out duration-500" :enter-from-class="startEnterAndLeaveClass" :enter-to-class="endEnterAndLeaveClass">
    <div
      v-if="isVisible"
      :class="tailwind.cn(
        'alert-body p-4 w-auto max-w-[89vw] rounded-md',
        style.body,
        classClass,
        size
        )"
      :style="props.style">
      <div class="flex">
        <div class="shrink-0">
          <component :is="icon" aria-hidden="true" :class="tailwind.cn('h-5 w-5', style.icon)"/>
        </div>
        <div class="ml-3">
          <h3 v-if="title?.length" :class="tailwind.cn('text-sm font-medium', style.title)">{{ title }}</h3>
          <div v-if="subtitle" :class="tailwind.cn('text-sm', !title?.length||'mt-2', style.subtitle)" v-html="subtitle"/>
          <div v-if="!!$slots?.default" :class="tailwind.cn('text-sm', !title?.length||'mt-2', style.subtitle)"><slot/></div>
        </div>
        <div v-if="isCloseButton || displayTime === 0" class="ml-auto pl-3">
          <div class="-mx-1.5 -my-2">
            <button
              type="button"
              :class="tailwind.cn(
                'button-delete','rounded-md m-0 h-9 w-9 px-2',
                style.button,
                'py-2 text-sm font-medium inline-flex items-center justify-center transition-colors duration-300'
               )"
              @click="close">
              <XMarkIcon aria-hidden="true" :class="tailwind.cn('h-5 w-5', style.buttonIcon)"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
