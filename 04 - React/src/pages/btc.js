
import useSWR from "swr"
import Content from '../components/common/Content'

export default function Btc() {
  const { data, error } = useSWR(
    "api/btc",
    url => fetch(url).then(res => res.json())
  )

  if (error) return "An error has occurred."
  if (!data) return "Loading..."
  return (
    <Content>
      <h1>BTC Price</h1>
      <p>{data?.value}</p>
    </Content>
  )
}
