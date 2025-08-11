import { useLoaderData, useActionData, useNavigation, Form } from '@remix-run/react';

import { settingsAction } from '../action';
import { settingsLoader } from '../loader';
import styles from './setting.module.scss';

export default function SettingsPage() {
  const { user } = useLoaderData<typeof settingsLoader>();
  const actionData = useActionData<typeof settingsAction>();
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
