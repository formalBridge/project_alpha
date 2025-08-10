import 'github-markdown-css/github-markdown-light.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        // 1. GitHub 스타일 마크다운(테이블 등)을 사용하기 위한 플러그인
        remarkPlugins={[remarkGfm]}
        // 2. 특정 태그를 원하는 컴포넌트로 교체
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
