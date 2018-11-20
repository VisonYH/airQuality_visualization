export const changeMsg = ({commit}) => {
  commit({
    type: 'mutationMsg',
    msg: 'modified data'
  })
}
