import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';


i18n
    .use(XHR)
    .use(LanguageDetector)
    .use(initReactI18next) // bind react-i18next to the instance
    .init({
        fallbackLng: 'en',
        debug: true,

        interpolation: {
            escapeValue: false, // not needed for react!!
        },
        resources: {
            en: {
                translation: {
                    "xRead": "xRead",
                    "view_mode_rich": "rich",
                    "view_mode_single_line": "single line",
                }
            },
            zh: {
                translation: {
                    "xRead": "来阅读",
                    "Dark Mode": "暗色模式",
                    "Home": "首页",
                    "Guess": "推荐",
                    "Topic": "分类",
                    "Tag": "标签",
                    "Feed": "频道",
                    "Series": "系列",
                    "Store": "发现",
                    "Advice": "建议",
                    "Login": "登录",
                    "Logout": "退出",
                    "Filter": "筛选",
                    "subscribe": "订阅",
                    "URL": "网址",
                    "Title": "标题",
                    "Refetch": "刷新",
                    "More": "更多",
                    "Empty": "没有更多内容",
                    "Loading": "加载中",
                    "Error": "出错啦",
                    "Mark Read": "标记已读",
                    "Mark Spam": "标记垃圾",
                    "All": "全部",
                    "Unread Only": "未读",
                    "Inbox": "收件箱",
                    "Spam": "垃圾箱",
                    "box": "邮箱",
                    "tags": "标签",
                    "feed": "频道",
                    "inbox": "收件箱",
                    "spam": "垃圾箱",
                    "Read": "已读",
                    "priority": "优先级",
                    "view_mode_rich": "图文",
                    "view_mode_single_line": "列表",
                    "Guess Read": "猜你会读",
                    "Guess Normal": "普通邮件",
                    "Guess Spam": "猜是垃圾",
                    "No More Content": "没有更多内容",
                    "Mark All Spam": "全部标记垃圾",
                    "Mark All Read": "全部标记已读",
                }
            }
        },

        // react i18next special options (optional)
        // override if needed - omit if ok with defaults
        /*
        react: {
          bindI18n: 'languageChanged',
          bindI18nStore: '',
          transEmptyNodeValue: '',
          transSupportBasicHtmlNodes: true,
          transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
          useSuspense: true,
        }
        */
    });


export default i18n;