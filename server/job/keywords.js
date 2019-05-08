import {nextParseKeywordsArticle, parseArticleKeywords} from "../service";

let running = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function runParseArticleKeywords() {
    if (running) return;
    running = true;
    try {
        let article = await nextParseKeywordsArticle();
        while (article) {
            await parseArticleKeywords(article);
            article = await nextParseKeywordsArticle()
        }
    } catch (e) {
        console.error(e.message, e);
        await sleep(5000);
    } finally {
        running = false
    }
}
