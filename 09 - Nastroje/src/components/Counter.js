
///
/// My counter component
///
export default function Counter ({ value, setValue }) {
  return (
    <div>
      <p>{value}</p>
      <button onClick={() => setValue(value + 1)}>Add1</button>
    </div>
  )
}
