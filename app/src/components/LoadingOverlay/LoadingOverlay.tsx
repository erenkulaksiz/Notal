import { Loading } from "@components";

export function LoadingOverlay() {
  return (
    <div className="flex flex-1 w-full h-full items-center justify-center">
      <Loading size="xl" />
    </div>
  );
}
