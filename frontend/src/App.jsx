function App() {
  return (
    <main className="page">
      <header className="topbar">
        <div className="brand">Brightloop</div>
        <span className="tag">Subscription Management</span>
      </header>

      <section className="welcome">
        <p className="eyebrow">BRIGHTLOOP SOFTWARE</p>
        <h1>Subscription Management System</h1>
        <p>
          Starter workspace is ready. Dashboard cards, navigation and module
          pages will be added as the team implements the requirements.
        </p>
      </section>

      <section className="grid" aria-label="Application modules">
        {[
          ["Products & Plans", "Manage products, variants, prices and plans."],
          ["Subscriptions", "Create quotations and track subscription status."],
          ["Invoices & Payments", "Generate invoices and record payments."],
          ["Reports", "Review recurring revenue and outstanding invoices."]
        ].map(([title, description]) => (
          <article className="module-card" key={title}>
            <h2>{title}</h2>
            <p>{description}</p>
            <span>Coming soon</span>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
