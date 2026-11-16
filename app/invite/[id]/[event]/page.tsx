import { Suspense } from "react";
import { notFound } from "next/navigation";
import Invitation from "@/components/Invitation";
import { identity } from "@/lib/platform-server";
import { eventId, eventSlugs } from "@/lib/template-config";

type Props = {
  params: Promise<{ id: string; event: string }>;
  searchParams: Promise<{ preview?: string }>;
};
async function Content({ params, searchParams }: Props) {
  const [{ id, event }, query, { db, admin }] = await Promise.all([
    params,
    searchParams,
    identity(),
  ]);
  const order = db.orders.find((o) => o.id === id || o.slug === id);
  if (!order || (order.status !== "approved" && !admin)) notFound();
  const index = eventSlugs(order.details.events).indexOf(event);
  if (index < 0) notFound();
  return (
    <Invitation
      id={id}
      event={eventId(order.details.events[index], index)}
      preview={query.preview === "1"}
    />
  );
}
export default function Page(props: Props) {
  return (
    <Suspense fallback={<div>Preparing something lovely…</div>}>
      <Content {...props} />
    </Suspense>
  );
}
