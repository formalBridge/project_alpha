import { object, string } from "zod";

export const postSchema = object({
  title: string().max(20, "제목은 20자를 넘을 수 없습니다."),
  content: string(),
});
