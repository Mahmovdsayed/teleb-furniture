import MessagePage from "@/components/pages/message/MessagePage";
import MessageSkeleton from "@teleb/ui/components/message-skeleton";
import { Suspense } from "react";

const page = () => {
  return <>
    <Suspense fallback={<MessageSkeleton />}>
      <MessagePage />
    </Suspense>
  </>;
};

export default page;