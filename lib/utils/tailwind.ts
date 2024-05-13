import {twMerge} from "tailwind-merge";
import clsx, { type ClassValue} from "clsx";

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes))
}
export function getRegExpClass(regExpClass?:string, ...classes: any[]):Array<string>|null {
  if (!regExpClass?.length && !classes.length) { return [] }
  const reg = `\\b\\w*(?<!\\d)[\\w:-]*${regExpClass}[\\w:-]*\\b`
  return JSON.stringify(classes).match(new RegExp(reg, "g"))
}