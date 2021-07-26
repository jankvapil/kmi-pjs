
import useSWR from "swr"
import Content from '../components/common/Content'
import AddUserForm from '../components/AddUserForm'

export default function Users() {
  const { data, error } = useSWR(
    "api/users",
    url => fetch(url).then(res => res.json())
  )

  if (error) return "An error has occurred."
  if (!data) return "Loading..."

  return (
    <Content>
      <h1>Users</h1>
      <AddUserForm />
      <ul>
        {data.map(u => (
          <li key={u.id}>{u.username}</li>
        ))}
      </ul>
    </Content>
  )
}
