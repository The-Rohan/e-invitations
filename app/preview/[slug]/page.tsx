import { Suspense } from "react";
import { collection } from "@/lib/platform";
import { notFound } from "next/navigation";
async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const design = collection.find((t) => t.id === slug);
  if (!design) notFound();
  return (
    <div className="invitation">
      <iframe
        title={design.name + " interactive invitation preview"}
        allow="autoplay"
        src={"/collection/" + slug + ".html"}
      />
      <div className="sample-watermarks" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => <span key={i}>wedinvite.pk · preview</span>)}
      </div>

    </div>
  );
}

export default function Page(props: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div>Preparing something lovely…</div>}>
      <Content {...props} />
    </Suspense>
  );
}
