// src/app/register/page.tsx

import { Suspense } from "react";
import Register from "./Register";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Register />
    </Suspense>
  );
}
