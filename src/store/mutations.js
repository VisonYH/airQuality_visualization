export const mutationMsg = (state, payload) => {
  state.msg = payload.msg
}

export const mSpaceScale = (state, payload) => {
  console.log(payload)
  state.spaceScaleArr = payload
}
