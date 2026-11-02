// Shows a rating like ★★★★☆ (4.4) with the number of reviews.
export default function Stars({ rating = 0, reviewCount }: { rating?: number; reviewCount?: number }) {
  const full = Math.round(rating);
  return (
    <span className="stars" aria-label={`Rated ${rating} out of 5`}>
      <span className="stars__icons" aria-hidden>
        {"★".repeat(full)}
        {"☆".repeat(5 - full)}
      </span>
      {reviewCount !== undefined && <span className="stars__count">({reviewCount})</span>}
    </span>
  );
}
