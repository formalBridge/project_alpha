import createAction from "~/utils/createAction";
import { redirect } from "@remix-run/cloudflare";
import { postSchema } from "~/features/post/schema";

export const insertAction = createAction(async ({ db, request }) => {
  const formdata = await request.formData();
  const { data, error } = postSchema.safeParse({
    title: formdata.get("title"),
    content: formdata.get("content"),
  });
  if (error) {
    return { error: error.issues };
  }

  await db.post.create({ data });
  return redirect("/posts");
});

export const updateAction = createAction(async ({ db, request, params }) => {
  const id = Number(params.postId);
  const formdata = await request.formData();
  const { data, error } = postSchema.safeParse({
    title: formdata.get("title"),
    content: formdata.get("content"),
  });
  if (error) {
    return { error: error.issues };
  }

  await db.post.update({ where: { id }, data });
  return redirect("/posts");
});

export const destroyAction = createAction(async ({ db, params }) => {
  await db.post.delete({ where: { id: Number(params.postId) } });
  return redirect("/posts");
});
