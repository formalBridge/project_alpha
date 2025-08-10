import { Form } from '@remix-run/react';
import { ReactNode } from 'react';

import Editor from 'app/components/Editor';
import { ClientOnly } from 'remix-utils/client-only';

import styles from './memoEditor.module.scss';

export const MemoEditor = ({
  children,
  initialContent,
  type,
}: {
  children: ReactNode;
  initialContent?: string;
  type: 'create' | 'edit';
}) => {
  return (
    <Form method={type === 'create' ? 'post' : 'put'}>
      <div className={styles.memoEditorTitleBox}>
        <h2>{type === 'create' ? '메모 작성하기' : '메모 수정하기'}</h2>
        <button type="submit" className={styles.submitButton}>
          저장
        </button>
      </div>
      <ClientOnly>{() => <Editor name="content" initialContent={initialContent} />}</ClientOnly>
      {children}
    </Form>
  );
};
