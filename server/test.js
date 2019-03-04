// @flow
import {topic, keyword, newsSummary} from "./baidu-aip-nlp";
import {getAllTags} from "./service";

(async function () {
    var content = "如果下面的方法还是没有解决你的问题建议来我们门店看下成都市锦江区红星路三段99号银石广场24层01室。";
    var title = "iphone手机出现“白苹果”原因及解决办法，用苹果手机的可以看下";
    const result = await topic(content, title);
    console.log(JSON.stringify(result))
    // var allTags = await getAllTags();
    // console.log(allTags)
})();

