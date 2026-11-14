import { Suspense } from "react";
import Invitation from "@/components/Invitation";
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    preview?: string | string[];
    event?: string | string[];
  }>;
};
async function Content({ params, searchParams }: Props) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  return (
    <Invitation
      id={id}
      preview={query.preview === "1"}
      event={typeof query.event === "string" ? query.event : undefined}
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
