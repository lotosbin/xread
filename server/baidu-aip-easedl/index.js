// @flow
import fetch from "node-fetch";

import utf8 from "utf8";
import moment from "moment";
const api_key = process.env.BAIDU_AIP_EASEDL_API_KEY;
const secret_key = process.env.BAIDU_AIP_EASEDL_SECRET_KEY;
const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${api_key}&client_secret=${secret_key}`;
type TCache = { access_token: null | string, dataset: null | Array<TDataSetListItem> };
var cache: TCache = {access_token: null, dataset: null};

export async function getAccessToken() {
    if (cache.access_token) {
        return cache.access_token;
    }
    const response = await fetch(url, {method: 'POST'});
    /*{
  "refresh_token": "25.b55fe1d287227ca97aab219bb249b8ab.315360000.1798284651.282335-8574074",
  "expires_in": 2592000,
  "scope": "public wise_adapt",
  "session_key": "9mzdDZXu3dENdFZQurfg0Vz8slgSgvvOAUebNFzyzcpQ5EnbxbF+hfG9DQkpUVQdh4p6HbQcAiz5RmuBAja1JJGgIdJI",
  "access_token": "24.6c5e1ff107f0e8bcef8c46d3424a0e78.2592000.1485516651.282335-8574074",
  "session_secret": "dfac94a3489fe9fca7c3221cbf7525ff"
}*/

    /*
    * {
    "error": "invalid_client",
    "error_description": "unknown client id"
}
    * */
    if (!response.ok) {
        throw new Error(`${response.statusCode}:${await response.text()}`)
    }
    const json = await response.json();
    if (json.error) {
        throw new Error(`${json.error}:${json.error_description}`)
    }
    cache.access_token = json.access_token;
    return json.access_token;
}

/**
 * @return
 */
export async function dataset_add_entity(label: string, name: string, content: string) {
    console.debug(`dataset_add_entity:name=${name},content=${content}`);
    const accessToken = await getAccessToken();
    const url = `https://aip.baidubce.com/rpc/2.0/easydl/dataset/addentity?access_token=${accessToken}`;
    const datasetId = (await dataset_today()).dataset_id;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            "type": "TEXT_CLASSIFICATION",
            "dataset_id": datasetId,
            "entity_content": `${utf8.encode(content.slice(0, 10000 / 2))}`,
            "entity_name": name,
            "labels": [{"label_name": `${label}`}]
        })
    });
    if (!response.ok) {
        throw new Error(`${response.statusCode}:${await response.text()}`)
    }
    const json = await response.json();
    /*{
    log_id: 8538749507596601000,
    results: [
     { name: '0', score: 0.7447099685668945 },
     { name: '1', score: 0.2552900016307831 }
    ]
    }*/
    console.debug(`dataset_add_entity:result=${JSON.stringify(json)}`);
    return json;
}

export async function dataset_today(): Promise<TDataSetListItem> {
    var date = moment(Date.now()).format("YYYYMMDD");
    var list: Array<TDataSetListItem> = cache.dataset || (await dataset_list() || {results: []}).results;
    cache.dataset = list;
    var dataset = list.find(it => it.dataset_name === date);
    if (!dataset) {
        dataset = await dataset_create(date);
        cache.dataset = null;
    }
    return dataset;
}

export async function dataset_create(name: string): Promise<TDataSetListItem> {
    console.debug(`dataset_list`);
    const accessToken = await getAccessToken();
    const url = `https://aip.baidubce.com/rpc/2.0/easydl/dataset/create?access_token=${accessToken}`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            "type": "TEXT_CLASSIFICATION",
            "dataset_name": `${name}`,
        })
    });
    if (!response.ok) {
        throw new Error(`${response.statusCode}:${await response.text()}`)
    }
    const json = await response.json();
    /*{
   { total_num: 2,
  results:
   [ { dataset_id: 33883,
       dataset_name: 'auto',
       type: 'TEXT_CLASSIFICATION',
       status: 'normal' },
     { dataset_id: 34015,
       dataset_name: '1',
       type: 'TEXT_CLASSIFICATION',
       status: 'normal' } ],
  log_id: 565872871 }

    */
    console.debug(`dataset_create:result=${JSON.stringify(json)}`);
    return {
        dataset_id: json.dataset_id,
        dataset_name: name
    };
}

type TDataSetListResult = {
    results: Array<TDataSetListItem>;
}
type TDataSetListItem = {
    dataset_id: number;
    dataset_name: string;
}

export async function dataset_list(): Promise<TDataSetListResult> {
    console.debug(`dataset_list`);
    const accessToken = await getAccessToken();
    const url = `https://aip.baidubce.com/rpc/2.0/easydl/dataset/list?access_token=${accessToken}`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            "type": "TEXT_CLASSIFICATION",
            "start": 0,
            "num": 100,
        })
    });
    if (!response.ok) {
        throw new Error(`${response.statusCode}:${await response.text()}`)
    }
    const json = await response.json();
    /*{
   { total_num: 2,
  results:
   [ { dataset_id: 33883,
       dataset_name: 'auto',
       type: 'TEXT_CLASSIFICATION',
       status: 'normal' },
     { dataset_id: 34015,
       dataset_name: '1',
       type: 'TEXT_CLASSIFICATION',
       status: 'normal' } ],
  log_id: 565872871 }

    */
    console.debug(`dataset_list:result=${JSON.stringify(json)}`);
    return json;
}
/**
 * @return
 */
export async function recommend_priority(text: string) {
    const accessToken = await getAccessToken();
    const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/text_cls/recommend_priority?access_token=${accessToken}`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            "text": `${text || "empty"}`,
            "top_num": 6
        })
    });
    if (!response.ok) {
        throw new Error(`${response.statusCode}:${await response.text()}`)
    }
    const json = await response.json();
    console.debug(`recommend_priority:result=${JSON.stringify(json)}`);
    if (json.error_code === 17) {
        //Open api daily request limit reached"
        console.warn(`recommend_priority:Open api daily request limit reached`);
        try {
            return await recommend_priority_debug(text)
        } catch (e) {
            console.error(e)
        }
    }
    /*{
    log_id: 8538749507596601000,
    results: [
     { name: '0', score: 0.7447099685668945 },
     { name: '1', score: 0.2552900016307831 }
    ]
    }*/
    return json;
}

export async function recommend_priority_debug(text: string) {
    const result = await fetch("http://ai.baidu.com/easydl/api", {
        credentials: "include",
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,zh-TW;q=0.8,zh-HK;q=0.7,en;q=0.6,en-US;q=0.5,tr;q=0.4",
            "content-type": "application/json;charset=UTF-8",
            "x-requested-with": "XMLHttpRequest",
            cookie: `${process.env.COOKIE}`
        },
        "referrer": "http://ai.baidu.com/easydl/app/4/models/verify",
        "referrerPolicy": "no-referrer-when-downgrade",
        body: JSON.stringify({
            "modelId": 28810,
            "iterationId": 40212,
            "type": 4,
            "entity": `${text}`,
            "method": "model/verify"
        }),
        method: "POST",
        mode: "cors"
    });
    if (!result.ok) {
        throw new Error(`${result.statusCode}:${await result.text()}`)
    }
    const json = await result.json();
    console.log(json);
    if (!json.success) {
        throw new Error(`${json.error}:${JSON.stringify(json)}`)
    }
    return json;
}