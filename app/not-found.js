export default function NotFound() {
  return (
    <section className="panel error">
      <h2>Unable to load data</h2>
      <p>Could not find a team or player for that UUID.</p>
      <p>Check your URL and try again.</p>
    </section>
  );
}
