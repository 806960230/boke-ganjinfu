// components/MarkdownRenderer.js

import { remark } from 'remark';
import html from 'remark-html';

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    const processedContent = remark().use(html).processSync(content).toString();

    return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
}

export default MarkdownRenderer;