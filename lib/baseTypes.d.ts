import { AllowedComponentProps, ComponentCustomProps, ObjectEmitsOptions, VNodeProps } from "vue"
export type IMode = "filled" | "outlined" | "underlined"
export type PositionShort =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "center"
  | "bottom-left"
  | "top-left"
  | "bottom-right"
  | "top-right"
export type Position =
  | "center"
  | "center-top"
  | "center-bottom"
  | "center-right"
  | "center-left"
  | "top"
  | "top-right"
  | "top-left"
  | "bottom"
  | "bottom-right"
  | "bottom-left"
  | "right"
  | "right-top"
  | "right-bottom"
  | "left"
  | "left-top"
  | "left-bottom"
export type StyleClass = string | Array<string>
export type TWidth = number | string | "500px" | "50rem" | "50em" | "50vw"
export type THeight = number | string | "500px" | "50rem" | "50em" | "50vh"
export type RefLink = string | HTMLElement
export type _key = string
export type TLoading = boolean
export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl"
// ------------------------------------------------------------------------
declare type PublicProps = VNodeProps & AllowedComponentProps & ComponentCustomProps
declare type EmitFn<Options = ObjectEmitsOptions, Event extends keyof Options = keyof Options> =
  Options extends Array<infer V>
    ? (event: V, ...args: any[]) => void
    : object extends Options
      ? (event: string, ...args: any[]) => void
      : UnionToIntersection<
          {
            [key in Event]: Options[key] extends (...args: infer Args) => any
              ? (event: key, ...args: Args) => void
              : (event: key, ...args: any[]) => void
          }[Event]
        >
export class ClassComponent<Props, Slots, Emits> {
  $props: Props & PublicProps
  $slots: Slots
  $emit: EmitFn<Emits>
}
