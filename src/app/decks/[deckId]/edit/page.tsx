import { EditDeckPage } from "@/features/decks/edit-deck-page/edit-deck-page";

interface EditDeckRouteProps {
  params: Promise<{ deckId: string }>;
}

export default async function DeckEditPage({ params }: EditDeckRouteProps) {
  const { deckId } = await params;
  return <EditDeckPage deckId={deckId} />;
}
