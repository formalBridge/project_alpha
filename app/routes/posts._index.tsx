import type { MetaFunction } from "@remix-run/cloudflare";
import Index from "~/features/post/pages";
import { indexLoader } from "~/features/post/loader";

export const meta: MetaFunction = () => {
  return [{ title: "Post Index" }];
};

export { indexLoader as loader };

export default Index;
