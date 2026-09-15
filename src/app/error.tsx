"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ErrorPage } from "@/components/error-page/error-page";

interface ErrorPageRouteProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Next.js App Router convention — see the main app's identical error.tsx for the full reasoning. */
export default function ErrorPageRoute({ error, reset }: ErrorPageRouteProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPage
      eyebrow="Error"
      heading="Something went wrong."
      message="We hit a snag loading this page. Trying again usually fixes it."
    >
      <Button onClick={() => reset()}>Try again</Button>
      <Button asChild variant="secondary">
        <Link href="/dashboard">Go to dashboard</Link>
      </Button>
    </ErrorPage>
  );
}
