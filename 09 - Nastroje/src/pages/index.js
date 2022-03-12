import { useImmer } from "use-immer"
import Content from '../components/common/Content'
import Counter from '../components/Counter'

export default function Home() {
  const [state, setState] = useImmer({
    cnt1: 0,
    cnt2: 0,
    cnt3: 0
  })
  return (
    <Content>
      <Counter value={state.cnt1} inc={() => setState(draft => {
        draft.cnt1 = state.cnt1 + 1
      })}/>
      <Counter value={state.cnt2} inc={() => setState(draft => {
        draft.cnt2 = state.cnt2 + 1
      })}/>
      <Counter value={state.cnt3} inc={() => setState(draft => {
        draft.cnt3 = state.cnt3 + 1
      })}/>
      <Counter value={state.cnt1} inc={() => setState(draft => {
        draft.cnt1 = state.cnt1 + 1
      })}/>
    </Content>
  )
}
