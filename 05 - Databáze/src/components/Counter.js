
import { useEffect, useState } from "react"

///
/// My counter component
///
export default function Counter ({ initValue }) {
  const [cnt, setCnt] = useState(initValue ? initValue : 0)
  useEffect(() => {
    alert("Cnt was increased!")
  }, [cnt])

  return (
    <div>
      <p>{cnt}</p>
      <button onClick={() => setCnt(cnt + 1)}>Add1</button>
    </div>
  )
}
