import type { MetaFunction } from "@remix-run/cloudflare";
import { updateAction } from "~/features/post/action";
import { updateLoader } from "~/features/post/loader";
import Edit from "~/features/post/pages/edit";

export const meta: MetaFunction = () => {
  return [{ title: "Post Edit" }];
};

export const loader = updateLoader;

export const action = updateAction;

export default Edit;
