'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

type FrontMatter = {
  title: string;
  description?: string;
  date?: string;
  [key: string]: unknown;
};

type Post = {
  slug: string;
  category: string;
  title: string;
  description: string;
  date?: string;
};

type PostWithContent = {
  frontMatter: FrontMatter;
  content: string;
};

export type Category = {
  name: string;
  slug: string;
  count?: number;
};

const contentRoot = path.join(process.cwd(), 'content');

export async function getPostsByCategory(category: string): Promise<Post[]> {
  try {
    const dir = path.join(contentRoot, category);
    if (!fs.existsSync(dir)) {
      return [];
    }

    const files = fs.readdirSync(dir, { withFileTypes: true });
    return files
      .filter(file => file.isFile() && file.name.endsWith('.mdx'))
      .map(file => {
        const slug = file.name.replace(/\.mdx$/, '');
        const filePath = path.join(dir, file.name);
        const content = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(content);

        return {
          slug,
          category,
          title: typeof data.title === 'string' ? data.title : 'Untitled',
          description: typeof data.description === 'string' ? data.description : 'No description',
          date: typeof data.date === 'string' ? data.date : undefined,
        };
      });
  } catch (error) {
    console.error(`Error reading posts for category ${category}:`, error);
    return [];
  }
}

export async function getPost(category: string, slug: string): Promise<PostWithContent> {
  const filePath = path.join(contentRoot, category, `${slug}.mdx`);

  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Post not found: ${filePath}`);
    }

    const source = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(source);

    return {
      frontMatter: {
        title: typeof data.title === 'string' ? data.title : 'Untitled',
        description: typeof data.description === 'string' ? data.description : undefined,
        date: typeof data.date === 'string' ? data.date : undefined,
        ...data,
      },
      content,
    };
  } catch (error) {
    console.error(`Error reading post ${category}/${slug}:`, error);
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    if (!fs.existsSync(contentRoot)) return [];

    const items = fs.readdirSync(contentRoot, { withFileTypes: true });

    return items
      .filter(dirent => dirent.isDirectory())
      .map(dirent => {
        const postCount = fs
          .readdirSync(path.join(contentRoot, dirent.name))
          .filter(file => file.endsWith('.mdx')).length;

        return {
          name: dirent.name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          slug: dirent.name,
          count: postCount,
        };
      });
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
}
