
///
/// My button component
///
const Button = ({ name, msg }) => {
  return (
    <button onClick={() => alert(msg) }>
      {name}
    </button>
  )
}

export default Button