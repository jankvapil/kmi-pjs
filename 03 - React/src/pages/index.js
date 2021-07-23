import Content from '../components/common/Content'
import Button from '../components/Button'

export default function Home() {
  return (
    <Content>
      <h1>Hello world!</h1>
      <Button name="Click" msg="Hello!"/>
      <a href="/btc">BTC</a>
    </Content>
  )
}
