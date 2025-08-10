'use client';

import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { useEffect, useState } from 'react';

export default function Editor({ name, initialContent }: { name: string; initialContent?: string }) {
  const [value, setValue] = useState(initialContent || '');
  const editor = useCreateBlockNote();

  useEffect(() => {
    if (initialContent) {
      editor.tryParseMarkdownToBlocks(initialContent).then((blocks) => {
        editor.replaceBlocks(editor.document, blocks);
      });
    }
  }, []);

  return (
    <>
      <BlockNoteView
        editor={editor}
        theme="light"
        onChange={(e) => {
          e.blocksToMarkdownLossy(e.document).then((markdown) => {
            setValue(markdown);
          });
        }}
      />
      <textarea readOnly hidden name={name} value={value} />
    </>
  );
}
