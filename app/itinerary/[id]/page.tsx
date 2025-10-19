type Props = { params: { id: string } };
export default function ItineraryPage({ params }: Props){ return <main className="p-6">Itinerary {params.id}</main>; }
