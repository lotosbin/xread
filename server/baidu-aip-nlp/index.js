// @flow
import {nlp as AipNlpClient} from "baidu-aip-sdk";
// 设置APPID/AK/SK
const APP_ID = process.env.BAIDU_AIP_APP_ID;
const API_KEY = process.env.BAIDU_AIP_API_KEY;
const SECRET_KEY = process.env.BAIDU_AIP_SECRET_KEY;

// 新建一个对象，建议只保存一个对象调用服务接口
const client = new AipNlpClient(APP_ID, API_KEY, SECRET_KEY);

type TNewsSummaryResult = {
    log_id: number,
    summary: String
};

export async function newsSummary(content: string, title: string): Promise<TNewsSummaryResult> {

    const maxSummaryLen = 300;

// 如果有可选参数
    const options = {};
    options["title"] = title;

// 带参数调用新闻摘要接口
    try {
        const result = await client.newsSummary(content, maxSummaryLen, options);
        console.log(JSON.stringify(result));
        return result;
    } catch (err) {
        // 如果发生网络错误
        console.log(err);
        throw err;
    }
}

type TTopicResult = {
    "log_id": number,
    "item": {
        "lv2_tag_list": [{
            "score": number,
            "tag": string
        }],
        "lv1_tag_list": [{
            "score": number,
            "tag": string
        }]
    }
};

export async function topic(content: string, title: string): Promise<TTopicResult> {
    // 调用文章分类
    try {
        var result = await client.topic(title, content);
        console.log(JSON.stringify(result));
        return result;
    } catch (err) {
        // 如果发生网络错误
        console.log(err);
        throw err;
    }
}

export type TKeywordResult = {
    "log_id": number,
    "items": [{
        "score": number,
        "tag": string
    }]
};

function trim(str: string) {
    return (str || "").replace(/<[^>]+>/g, "").replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");
}

//ref: https://ai.baidu.com/docs#/NLP-API/a1dae901
/**
 * @param title    string    文章标题（GBK编码），最大80字节    必填
 * @param content    string    文章内容（GBK编码），最大65535字节    必填
 */
export async function keyword(content: string = "", title: string = ""): Promise<TKeywordResult> {
    try {
        // 调用文章标签
        let trimTitle = trim(title);
        let trimContent = trim(content);
        if (trimTitle.length > 80) {
            console.warn(`title>80:trimTitle=${trimTitle},title=${title}`)
        }
        if (trimContent.length > 65535) {
            console.warn(`content>65535:trimContent=${trimContent},content=${content}`)
        }
        const result = await client.keyword(trimTitle.slice(0, 80), trimContent.slice(0, 65535));
        console.log(JSON.stringify(result));
        return result;
    } catch (err) {
        // 如果发生网络错误
        console.log(err);
        throw err;
    }
}