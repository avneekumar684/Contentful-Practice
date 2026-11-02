import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container section">
      <h1>Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
