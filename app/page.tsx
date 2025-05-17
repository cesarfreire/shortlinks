import { NewShortlinkForm } from "@/components/create-shortlink-form";

export default function Home() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <NewShortlinkForm />
      </div>
    </div>
  );
}
