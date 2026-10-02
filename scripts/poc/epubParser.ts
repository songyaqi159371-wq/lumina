/**
 * EPUB解析器 - 提取书籍内容
 */
import EPub from 'epub2';
import { parse } from 'node-html-parser';
import { BookChapter } from './types';

export class EpubParser {
  private epub: any;

  async load(epubPath: string): Promise<void> {
    console.log(`📖 正在加载 EPUB: ${epubPath}`);
    this.epub = await EPub.createAsync(epubPath);
    console.log(`✅ EPUB 加载成功`);
    console.log(`   标题: ${this.epub.metadata.title}`);
    console.log(`   作者: ${this.epub.metadata.creator}`);
  }

  async extractChapters(): Promise<BookChapter[]> {
    const chapters: BookChapter[] = [];

    console.log(`\n📚 开始提取章节...`);
    console.log(`   总章节数: ${this.epub.flow.length}`);

    for (let i = 0; i < this.epub.flow.length; i++) {
      const chapterId = this.epub.flow[i].id;

      try {
        const chapterRaw = await this.epub.getChapterAsync(chapterId);

        // 解析HTML内容
        const root = parse(chapterRaw);
        const textContent = this.cleanText(root.text);

        // 提取标题
        const titleElement = root.querySelector('h1, h2, h3, title');
        const title = titleElement?.text?.trim() || `Chapter ${i + 1}`;

        // 过滤掉太短的章节（可能是封面、版权页等）
        if (textContent.length < 100) {
          console.log(`   ⏭️  跳过短章节: ${title} (${textContent.length}字)`);
          continue;
        }

        chapters.push({
          id: `ch_${i + 1}`,
          title: title,
          content: textContent,
          chapterNumber: i + 1,
        });

        console.log(`   ✅ 提取章节 ${i + 1}: ${title.substring(0, 50)}... (${textContent.length}字)`);

      } catch (error) {
        console.error(`   ❌ 提取章节 ${i + 1} 失败:`, error);
      }
    }

    console.log(`\n✅ 章节提取完成，共 ${chapters.length} 个有效章节\n`);
    return chapters;
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')           // 合并多余空白
      .replace(/\n\s*\n/g, '\n\n')    // 保留段落分隔
      .trim();
  }

  getMetadata() {
    return {
      title: this.epub.metadata.title,
      author: this.epub.metadata.creator,
      publisher: this.epub.metadata.publisher,
      language: this.epub.metadata.language,
    };
  }
}
