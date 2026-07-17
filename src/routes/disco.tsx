import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/disco")({
  component: DiscoComponent,
});

function DiscoComponent() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <h1 className="font-italianno text-4xl text-foreground">Disco Don Quijote</h1>
    </main>
  );
}
