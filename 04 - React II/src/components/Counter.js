
import { useEffect, useState } from "react"

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

///
/// My counter component
///
export default function Counter ({ initValue }) {
  const [cnt, setCnt] = useState(initValue ? initValue : 0)
  useEffect(() => {
    // alert("Cnt was changed!")
    toast("Cnt was changed!")
  }, [cnt])

  return (
    <div>
      <p>{cnt}</p>
      <button onClick={() => setCnt(cnt + 1)}>Add1</button>
    </div>
  )
}
