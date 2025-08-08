import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react';

import styles from 'app/features/profile/pages/setting.module.scss';

export async function loader(_args: LoaderFunctionArgs) {
  return json({
    user: {
      nickname: '',
      avatarUrl: '/images/features/profile/profile_test.png',
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const fd = await request.formData();
  const nickname = String(fd.get('nickname') ?? '').trim();
  return json({ ok: true, nickname });
}

export default function SettingsPage() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const isSubmitting = nav.state === 'submitting';

  const currentNickname = actionData?.nickname ?? user.nickname;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>계정 설정</h1>

      <section className={styles.card}>
        <Form method="post" replace>
          <div className={styles.avatarWrap}>
            <img src={user.avatarUrl} alt="프로필 사진" className={styles.avatar} />
          </div>

          <label className={styles.labelWrap}>
            <div className={styles.label}>닉네임</div>
            <input
              name="nickname"
              defaultValue={currentNickname}
              placeholder="수정할 닉네임을 입력하세요"
              className={styles.input}
            />
          </label>

          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? '저장 중…' : '저장'}
          </button>
        </Form>
      </section>
    </div>
  );
}
