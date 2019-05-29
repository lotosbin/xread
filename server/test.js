// @flow
import {topic, keyword, newsSummary} from "./baidu-aip-nlp";
import {getAllTags, nextParsePriorityArticle, parsePriority, parseSeriesArticle} from "./service";
import {addFeedToStore} from "./store/service";
import {dataset_add_entity, dataset_list, dataset_today, getAccessToken, recommend_priority, recommend_priority_debug} from "./baidu-aip-easedl";
import {runParseArticlePriority} from "./job/priority";
import {runParseArticleTopic} from "./job/topic";
import {parseSeries} from "./services/article";
import {runParseArticleSeries} from "./job/series";
import {getAllSeries} from "./services/series";

// (async function () {
//     var content = "如果下面的方法还是没有解决你的问题建议来我们门店看下成都市锦江区红星路三段99号银石广场24层01室。";
//     var title = "iphone手机出现“白苹果”原因及解决办法，用苹果手机的可以看下";
//     const result = await topic(content, title);
//     console.log(JSON.stringify(result))
//     // var allTags = await getAllTags();
//     // console.log(allTags)
// })();
//
// addFeedToStore({link: "https://rsshub.app/oschina/news", title: "开源中国"});
(async function () {
    // const accessToken = await getAccessToken();
    // console.log(accessToken);
    // const json = await parsePriority('服务器内部错误，请再次请求， 如果持续出现此类错误，请通过QQ群（649285136）或工单联系技术支持团队。\n');
    // const json = await parsePriority('服务器内部错误，请再次请求， 如果持续出现此类错误，请通过QQ群（649285136）或工单联系技术支持团队。\n');
    // await runParseArticlePriority();
    // await runParseArticleTopic();
    // var json = await runParseArticleTopic();
    // const json = await dataset_add_entity("-1", "aaaaaa", "服务器内部错误，请再次请求， 如果持续出现此类错误，请通过QQ群（649285136）或工单联系技术支持团队。\\n");
    // var json = await dataset_today();
    // var json = await parseSeries("EOS 入门（一）：简析 EOS");
    var json = await getAllSeries();
    console.log(json);
    // setInterval(runParseArticlePriority, 5000);
    // await parseSeriesArticle();
    // await runParseArticleSeries()
})();