
import { useState } from "react"

///
/// Add User Form component
///
export default function AddUserForm() {
  const [username, setUsername] = useState("")

  ///
  /// Handles onClick event 
  ///
  const handleOnClick = async () => {
    const res = await fetch(`api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    })
    if (res.ok) {
      alert("User has been added into DB!")
    } else {
      alert("User can not be inserted into DB!")
    }
  }

  ///
  /// Handles onChange event 
  ///
  const handleOnChange = (e) => {
    const input = e.target.value
    setUsername(input)
  }
  
  return (
    <div>
      <input value={username} onChange={handleOnChange}/>
      <button onClick={handleOnClick}>Add User</button>
    </div>
  )
}