// Server component — renders the client GameShell with the route param
// generateStaticParams returns [] so no pages are pre-generated at build time.
// Nginx must be configured to serve the game shell for all /{CODE} paths.
import { GameShell } from "@/components/organisms/game/GameShell";

type GamePageProps = {
  params: Promise<{ code: string }>;
};

// Returns a single placeholder so the static export can generate the game shell HTML.
// In production, nginx rewrites all /{CODE} paths to this shell file.
export function generateStaticParams(): { code: string }[] {
  return [{ code: "SHELL" }];
}

export default async function GamePage({ params }: GamePageProps): Promise<React.ReactElement> {
  const { code } = await params;
  return <GameShell code={code.toUpperCase()} />;
}
