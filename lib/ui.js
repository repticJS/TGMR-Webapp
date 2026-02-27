export function ErrorPanel({ message }) {
  return (
    <section className="panel error">
      <h2>Unable to load data</h2>
      <p>{message}</p>
      <p>Check your UUID and API availability, then try again.</p>
    </section>
  );
}
