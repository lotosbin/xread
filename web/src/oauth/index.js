import {UserManager, WebStorageStateStore} from "oidc-client";

const config = {
    authority: `${process.env.REACT_APP_IDENTITY_SERVER_AUTHORITY}`,
    client_id: "xread_js",
    redirect_uri: `${process.env.REACT_APP_URI}/#/oauth/callback`,
    response_type: "code",
    scope: "openid profile",
    post_logout_redirect_uri: `${process.env.REACT_APP_URI}/`,
    userStore: new WebStorageStateStore({store: window.localStorage})
};
const mgr = new UserManager(config);

export function do_login() {
    mgr.signinRedirect();
}


export function do_logout() {
    mgr.signoutRedirect();
}

export async function getUser() {
    return mgr.getUser();
}

const userManager = new UserManager({response_mode: "query", userStore: new WebStorageStateStore({store: window.localStorage})});

export function signinRedirectCallback() {
    return userManager.signinRedirectCallback();
}
