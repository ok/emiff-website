import { renderBlock } from '../../scripts/faintly.js';
import { readBlockConfig } from '../../scripts/aem.js';
import { getIndexPath, INDEX_NEWS } from '../../scripts/index-utils.js';
import ffetch from '../../scripts/ffetch.js';


function fetchArticlesFactory(block) {
  return async function fetchArticles() {
    const config = readBlockConfig(block);
    const limit = parseInt(config?.limit ?? '', 10) || undefined;

    console.log(`news feed block config: ${JSON.stringify(config)}`);

    const rawEntries = await ffetch(getIndexPath(INDEX_NEWS)).all();
    const entries = rawEntries
      .filter(entry => entry.type === 'article' && entry.path.includes('/news/'))
      .slice(0, isNaN(limit) ? undefined : limit);
    return entries;
  };
}
  
export default async function decorate(block) {
  const fetchArticles = fetchArticlesFactory(block);
  
  await renderBlock(block, {
    fetchArticles,
    isFeaturedArticle: (context) => context.article.featured,
    articleLinkAttrs: (context) => ({
      href: context.article.path,
      title: context.article.title,
    }),
  });
}

