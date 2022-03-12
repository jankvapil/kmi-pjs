
///
/// My counter component
///
export default function Counter ({ value, inc }) {
  return (
    <div>
      <p>{value}</p>
      <button onClick={() => inc()}>Add1</button>
    </div>
  )
}
