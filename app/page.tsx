import Link from 'next/link';
import { useMemo } from 'react';
import React from 'react';
import MarkdownIt from 'markdown-it';
import 'github-markdown-css/github-markdown-light.css';
// @ts-ignore
import prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import fs from 'fs';
import path from 'path';

const readme = fs.readFileSync(
  path.join(process.cwd(), './README.md'),
  'utf-8',
);
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (code, lang) {
    if (prism.languages[lang]) {
      return prism.highlight(code, prism.languages[lang], lang);
    } else {
      return code;
    }
  },
});

export default function Home() {
  const content = useMemo(() => {
    return md.render(readme);
  }, []);

  return (
    <div style={{ width: 1200, margin: 'auto' }}>
      <h2>examples</h2>
      <p>
        <Link href="/simple">simple</Link>
      </p>
      <p>
        <Link href="/body-overflow">body-overflow</Link>
      </p>
      <p>
        <Link href="/fail">fail</Link>
      </p>
      <p>
        <Link href="/point">point</Link>
      </p>
      <p>
        <Link href="/shadow-dom">shadow-dom</Link>
      </p>
      <h2>readme</h2>
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
}
