import { Suspense } from "react";
import OrderSuccess from "./OrderSuccessContent";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-20">Loading...</p>}>
      <OrderSuccess />
    </Suspense>
  );
}