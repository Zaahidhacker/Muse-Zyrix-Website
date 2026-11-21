import { Btn } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="wrap flex min-h-svh flex-col items-start justify-center py-24">
      <p className="eyebrow mb-4">ZYRIX® — 404</p>
      <h1 className="heading-1 mb-6">This page does not exist.</h1>
      <p className="lead muted mb-12">
        The link may be old, or the page may have moved. The studio is
        still here.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <Btn href="/">Back to home</Btn>
        <Btn href="/#contact" variant="secondary">
          Get a free plan
        </Btn>
      </div>
    </main>
  );
}
