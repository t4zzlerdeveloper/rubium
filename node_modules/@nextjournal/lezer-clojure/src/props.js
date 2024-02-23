import {NodeProp} from "@lezer/common"

// TODO: naïvely restored to previoius NodeProp.flag() behaviour. Can we do any better?
let flag = () => new NodeProp({deserialize: str => true})

export const coll = flag()
export const prefixColl = flag()
export const prefixEdge = flag()
export const sameEdge = flag()
export const prefixContainer = flag()
