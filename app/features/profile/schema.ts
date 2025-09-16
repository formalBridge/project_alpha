import { z } from 'zod';

export const HandleCharacterSchema = z
  .string()
  .regex(/^[a-zA-Z0-9_]*$/, '핸들은 영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.');

export const HandleSchema = z.object({
  userId: z.string().nonempty('사용자 ID가 필요합니다.'),
  handle: z
    .string({
      required_error: '핸들을 입력해주세요.',
    })
    .min(3, '핸들은 3자 이상이어야 합니다.')
    .regex(/^[a-zA-Z0-9_]+$/, '핸들은 영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.'),
});

export const FollowsActionSchema = z.object({
  intent: z.enum(['follow', 'unfollow'], {
    required_error: '유효하지 않습니다. 다시 시도해주세요.',
  }),
  targetUserId: z.coerce.number({
    required_error: 'targetUserId가 필요합니다.',
  }),
});
