import {nextParsePriorityArticle, parseArticlePriority, setArticlePriority} from "../service";

let running = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function runParseArticlePriority() {
    if (running) return;
    running = true;
    try {
        let article = await nextParsePriorityArticle();
        while (article) {
            const priority = await parseArticlePriority(article);
            await setArticlePriority(article.id, priority);
            article = await nextParsePriorityArticle()
        }
    } catch (e) {
        console.error(e.message, e);
        await sleep(5000);
    } finally {
        running = false
    }
}
