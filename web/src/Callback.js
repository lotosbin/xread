import React, {useEffect} from "react";
import {signinRedirectCallback} from "./oauth";

const Callback = () => {
    useEffect(() => {
        const run = async () => {
            signinRedirectCallback().then(function () {
                console.error(`success`);
                window.location = "/";
            }).catch(function (e) {
                console.error(`failed`);
                console.error(e);
            });
        };
        // noinspection JSIgnoredPromiseFromCall
        run();
    }, []);
    return <div></div>
};
export default Callback;