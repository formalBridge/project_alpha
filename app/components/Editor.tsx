'use client';

import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { useState } from 'react';

export default function Editor({ name }: { name: string }) {
  const [value, setValue] = useState('');
  const editor = useCreateBlockNote();

  return (
    <>
      <BlockNoteView
        editor={editor}
        theme="light"
        onChange={(e) => {
          e.blocksToMarkdownLossy(e.document).then((markdown) => {
            console.log('Markdown content:', markdown);
            setValue(markdown);
          });
        }}
      />
      <textarea readOnly hidden name={name} value={value} />
    </>
  );
}
