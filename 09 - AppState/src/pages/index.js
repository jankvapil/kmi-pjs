import useGlobal from "../core/store"
import Content from '../components/common/Content'
import Counter from '../components/Counter'

export default function Home() {
  const [globalState, globalActions] = useGlobal()

  return (
    <Content>
      <Counter value={globalState.cnt1} inc={() => globalActions.counter.incCounter1()}/>
      <Counter value={globalState.cnt2} inc={() => globalActions.counter.incCounter2()}/>
      <Counter value={globalState.cnt3} inc={() => globalActions.counter.incCounter3()}/>
      <Counter value={globalState.cnt1} inc={() => globalActions.counter.incCounter1()}/>
    </Content>
  )
}
