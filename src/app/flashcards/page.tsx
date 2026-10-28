import { Suspense } from "react";
import { Flashcards } from "@/components/flashcards";
export default function Page() {
  return (
    <Suspense fallback={<p>Loading flashcards…</p>}>
      <Flashcards />
    </Suspense>
  );
}
