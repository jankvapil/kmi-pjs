
import { useRouter } from 'next/router'

///
/// My button component
///
const Button = ({ name, msg }) => {
  const router = useRouter ()
  return (
    <button onClick={() => router.push("/btc") }>
      {name}
    </button>
  )
}

export default Button