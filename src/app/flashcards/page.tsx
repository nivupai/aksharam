import { Suspense } from "react";
import { Flashcards } from "@/components/flashcards";
export default function Page() {
  return (
    <Suspense fallback={<p>Getting your cards ready…</p>}>
      <Flashcards />
    </Suspense>
  );
}
