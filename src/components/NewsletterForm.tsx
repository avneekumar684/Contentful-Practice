"use client";

import { useState } from "react";

// Demo only: we show a thank-you message but do not send or store the email anywhere.
export default function NewsletterForm({ buttonLabel = "Subscribe" }: { buttonLabel?: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) return <p className="newsletter__thanks">Thanks! (Demo only: nothing was saved.)</p>;

  return (
    <form
      className="newsletter__form"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Email address"
      />
      <button className="button" type="submit">
        {buttonLabel}
      </button>
    </form>
  );
}
