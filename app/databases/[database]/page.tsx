import { DatabaseViewer } from "@/components/database/DatabaseViewer";

export default async function DatabasePage({
  params,
}: {
  params: Promise<{ database: string }>;
}) {
  const { database } = await params;

  return (
    <div className="container mx-auto p-8">
      <DatabaseViewer modelName={database} />
    </div>
  );
}
