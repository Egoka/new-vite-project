export type IMode = "filled"|"outlined"|"underlined"
export type PositionShort =
  "top"|"bottom"|"left"|"right"|"center"|
  "bottom-left"|"top-left"|"bottom-right"|"top-right"
export type Position =
  "center"|"center-top"  |"center-bottom"|"center-right"|"center-left"|
  "top"   |"top-right"   |"top-left"|
  "bottom"|"bottom-right"|"bottom-left"|
  "right" |"right-top"   |"right-bottom"|
  "left"  |"left-top"    |"left-bottom"
export type StyleClass = string|Array<string>
export type TWidth = number|string|"500px"|"50rem"|"50em"|"50vw"
export type THeight = number|string|"500px"|"50rem"|"50em"|"50vh"
export type RefLink = string|HTMLElement
export type _key = string
export type TLoading = boolean
export type Size = "xs"|"sm"|"md"|"lg"|"xl"|"2xl"|"3xl"|"4xl"|"5xl"|"6xl"|"7xl"
// type StyleVariants<T> = <T extends Omit<T, "class">>{
//   [Key in keyof T]?: { [K in T[Key]]: string|string[] }
// }
// type StyleVariants<Style extends Record<string, any>> = {
//   [Key in keyof Omit<Style, "class">]?: Record<NonNullable<Omit<Style, "class">[Key]>, string|string[]>
// }