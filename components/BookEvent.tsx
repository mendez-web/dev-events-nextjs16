"use client";

import { createBooking } from "@/lib/actions/booking.actions";
import { useState } from "react";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await createBooking({ eventId, email });

    if (result.success) {
      setSubmitted(true);
    } else {
      console.error("Booking creation failed", result.error);
      setErrorMessage(result.error);
    }

    setIsSubmitting(false);
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm"> Thank you for signing-up</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {errorMessage ? (
            <p className="text-sm text-red-500">{errorMessage}</p>
          ) : null}
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="enter your email address"
            />
          </div>
          <button
            type="submit"
            className="button-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
