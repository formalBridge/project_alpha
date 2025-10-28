import { useLoaderData, useActionData, useNavigation, Form } from '@remix-run/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { settingsAction } from '../action';
import { settingsLoader } from '../loader';
import styles from './setting.module.scss';
import { useHandleValidation } from './useHandleValidation';
import { FormField } from '../components/FormField';

const DEFAULT_AVATAR = '/images/features/profile/profile_default.png';

export default function SettingsPage() {
  const loaderData = useLoaderData<typeof settingsLoader>();
  const actionData = useActionData<typeof settingsAction>();
  const nav = useNavigation();
  const isSubmitting = nav.state === 'submitting';

  const { handle, clientError, handleInputChange, handleInputBlur } = useHandleValidation(loaderData.handle || '');

  const errorMessage =
    typeof actionData === 'object' && actionData !== null && 'error' in actionData ? actionData.error : clientError;

  const [avatarPreview, setAvatarPreview] = useState<string>(loaderData.avatarUrl || DEFAULT_AVATAR);
  const lastObjectUrlRef = useRef<string | null>(null);
  useEffect(() => {
    setAvatarPreview(loaderData.avatarUrl || DEFAULT_AVATAR);
  }, [loaderData.avatarUrl]);

  useEffect(() => {
    return () => {
      if (lastObjectUrlRef.current && lastObjectUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(lastObjectUrlRef.current);
        lastObjectUrlRef.current = null;
      }
    };
  }, []);

  const isDirty = useMemo(() => handle !== (loaderData.handle || ''), [handle, loaderData.handle]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>계정 설정</h1>
          <p className={styles.subtitle}>프로필 이미지와 핸들을 관리하고, 계정에서 로그아웃할 수 있어요.</p>
        </div>
      </header>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>프로필</h2>
        </div>

        <div className={styles.cardBody}>
          <Form method="post" encType="multipart/form-data" replace className={styles.avatarRow}>
            <img src={avatarPreview} alt="프로필 사진" className={styles.avatar} />

            <div className={styles.avatarControls}>
              <input
                id="avatar-file"
                type="file"
                name="avatar"
                accept="image/*"
                className={styles.fileInput}
                required
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) setAvatarPreview(URL.createObjectURL(file));
                }}
              />
              <input type="hidden" name="intent" value="update-avatar" />
              <input type="hidden" name="userId" value={loaderData.userId} />

              <div className={styles.btnRow}>
                <label htmlFor="avatar-file" className={`${styles.btn} ${styles.btnSecondary}`}>
                  파일 선택
                </label>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={isSubmitting}>
                  {isSubmitting ? '업로드 중…' : '프로필 사진 변경'}
                </button>
              </div>
              <p className={styles.hint}>JPG/PNG 권장, 5MB 이하</p>
            </div>
          </Form>

          <div className={styles.divider} />

          <Form method="post" replace className={styles.formRow}>
            <FormField
              label="핸들"
              id="handle-input"
              name="handle"
              type="text"
              placeholder="수정할 핸들을 입력하세요."
              required
              value={handle}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={errorMessage}
            />
            <input type="hidden" name="userId" value={loaderData.userId} />
            <div className={styles.actions}>
              <button
                type="submit"
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={isSubmitting || !!clientError || !isDirty}
                aria-disabled={isSubmitting || !!clientError || !isDirty}
              >
                {isSubmitting ? '저장 중…' : '저장'}
              </button>
            </div>
          </Form>
        </div>
      </section>

      <section className={`${styles.card} ${styles.danger}`}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>계정</h2>
          <p className={styles.cardDesc}>로그아웃하면 이 기기에서 세션이 종료됩니다.</p>
        </div>

        <div className={styles.cardBody}>
          <Form method="get" action="/logout" replace>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnDanger}`}
              onClick={(e) => {
                if (!confirm('정말 로그아웃 하시겠어요?')) e.preventDefault();
              }}
            >
              로그아웃
            </button>
          </Form>
        </div>
      </section>
    </div>
  );
}
