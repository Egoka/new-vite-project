import type { Properties as CSS } from 'csstype';
import type {Size, StyleClass} from "primevue/baseTypes";
export interface IAlert {
  modelValue?: boolean
  type?: "success"|"warning"|"info"| "error"|"neutral"
  position?: "top"|"bottom"|"left"|"right"|"center"|"bottom-left"|"top-left"|"bottom-right"|"top-right"
  size?: Size
  title?: string
  subtitle?: string
  class?: StyleClass
  style?: CSS
  displayTime?: string|number|1000|2000|3000|4000|5000
  notAnimate?: boolean
  closeButton?: boolean|undefined
}
export interface IAlertProps extends Omit<IAlert, 'position'> {
  position?: "top"|"bottom"|"left"|"right"|"center"
}
export function openAlert(optionsAlert:IAlert): void
export default class Alert {
}
