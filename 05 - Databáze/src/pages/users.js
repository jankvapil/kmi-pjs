

import useSWR from "swr"

  // const { data, error } = useSWR(
  //   "api/users",
  //   url => fetch(url).then(res => res.json())
  // )

  // if (error) return "An error has occurred."
  // if (!data) return "Loading..."

  // <ul>
  // {data.map(u => (
  //   <li key={u.id}>{u.username}</li>
  // ))}
  // </ul>
  
import { useEffect } from "react"
import Content from '../components/common/Content'

export default function Employees() {
 
  useEffect(async () => {
    const res = await fetch('api/users')
    const data = await res.json()
    console.log(data)
  }, [])

  return (
    <Content>
      <h1>Users</h1>
    </Content>
  )
}
