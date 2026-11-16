import { Suspense } from "react";
import Invitation from "@/components/Invitation";
type Props = {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{ preview?: string }>;
};
async function Content({ params, searchParams }: Props) {
  const [{ alias }, query] = await Promise.all([params, searchParams]);
  return <Invitation id={"event:" + alias} preview={query.preview === "1"} />;
}
export default function Page(props: Props) {
  return (
    <Suspense fallback={<div>Preparing your invitation…</div>}>
      <Content {...props} />
    </Suspense>
  );
}
