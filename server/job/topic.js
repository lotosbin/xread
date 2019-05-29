import {nextParseKeywordsArticle, nextParseTopicArticle, parseArticleKeywords, parseArticleTopic} from "../service";

let running = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// QPS限制 5 request/second 1000/5= 200ms
export async function runParseArticleTopic() {
    if (running) return;
    running = true;
    try {
        let article = await nextParseTopicArticle();
        while (article) {
            await parseArticleTopic(article);
            article = await nextParseTopicArticle();
            await sleep(200);//防止 QPS 超限制
        }
    } catch (e) {
        console.error(e.message, e);
        await sleep(5000);
    } finally {
        running = false
    }
}
