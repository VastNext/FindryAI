import { Loader2Icon } from "lucide-react";

// The unsubscribe page is a client page reading useSearchParams (email
// param); this loading boundary confines that CSR bailout during prerender.
export default function Loading() {
  return <Loader2Icon className="my-32 mx-auto size-6 animate-spin" />;
}
