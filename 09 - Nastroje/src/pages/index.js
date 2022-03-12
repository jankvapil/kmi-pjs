import { useState } from 'react'
import Content from '../components/common/Content'
import Counter from '../components/Counter'

export default function Home() {
  const [cnt, setCnt] = useState(0)
  return (
    <Content>
      <Counter value={cnt} setValue={setCnt}/>
      <Counter value={cnt} setValue={setCnt}/>
      <Counter value={cnt} setValue={setCnt}/>
    </Content>
  )
}
