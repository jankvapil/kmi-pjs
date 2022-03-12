import { useImmerReducer } from "use-immer"
import Content from '../components/common/Content'
import Counter from '../components/Counter'

const initialState = {
  cnt1: 0,
  cnt2: 0,
  cnt3: 0
}

function reducer(draft, action) {
  switch (action.type) {
    case "inc1":
      return void draft.cnt1++
    case "inc2":
      return void draft.cnt2++
    case "inc3":
      return void draft.cnt3++
  }
}

export default function Home() {
  const [state, dispatch] = useImmerReducer(reducer, initialState)

  return (
    <Content>
      <Counter value={state.cnt1} inc={() => dispatch({ type: "inc1" })}/>
      <Counter value={state.cnt2} inc={() => dispatch({ type: "inc2" })}/>
      <Counter value={state.cnt3} inc={() => dispatch({ type: "inc3" })}/>
      <Counter value={state.cnt1} inc={() => dispatch({ type: "inc1" })}/>
    </Content>
  )
}
