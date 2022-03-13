export const incCounter1 = (store) => {
  store.setState(state => { state.cnt1 = state.cnt1 + 1})
}

export const incCounter2 = (store) => {
  store.setState(state => { state.cnt2 = state.cnt2 + 1})
}

export const incCounter3 = (store) => {
  store.setState(state => { state.cnt3 = state.cnt3 + 1})
}