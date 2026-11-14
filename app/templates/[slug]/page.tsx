import { Suspense } from "react";
import { designs } from "@/lib/designs";
import { ProductPage } from "@/components/Storefront";
import { notFound } from "next/navigation";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = designs.find((t) => t.id === slug);
  return {
    title: d
      ? `${d.name} Wedding Invitation | wedinvite.pk`
      : "Invitation not found",
    description: d?.description,
  };
}
async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!designs.some((d) => d.id === slug)) notFound();
  return <ProductPage id={slug} />;
}
export default function Page(props: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div>Preparing something lovely…</div>}>
      <Content {...props} />
    </Suspense>
  );
}
