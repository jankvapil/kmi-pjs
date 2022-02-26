import Content from '../components/common/Content'
import Button from '../components/Button'
import Counter from '../components/Counter'

export default function Home() {
  return (
    <Content>
      <h1>Hello</h1>
      <Button name="Click" msg="Hello!"/>
      <a href="/btc">BTC</a>
      <Counter initValue={42}/>
      <a href="/users">Users</a>
    </Content>
  )
}
