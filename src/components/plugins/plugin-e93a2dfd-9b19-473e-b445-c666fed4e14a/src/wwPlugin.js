import { createAuth0Client } from '@auth0/auth0-spa-js';


const ACCESS_COOKIE_NAME = 'session';

export default {
    /*=============================================m_ÔÔ_m=============================================\
        Plugin API
    \================================================================================================*/
    async _onLoad() {
        await this.createClient();
    },
    async _initAuth() {
        if (!this.client) return;
        await this.checkRedirectCallback();
        await this.checkIsAuthenticated();
    },
    _getUserRoles() {
        return this.user?.roles || [];
    },
    _matchRoles(roles) {
        return roles.every(role => this.user?.roles.includes(role));
    },

    /*=============================================m_ÔÔ_m=============================================\
        Auth API
    \================================================================================================*/
    /*=============================================m_ÔÔ_m=============================================\
        Auth0 API
    \================================================================================================*/
    client: null,
    async createClient() {
        const {
            domain,
            customDomain,
            SPAClientId: client_id,
            afterSignInPageId,
            audience,
            scope,
        } = this.settings.publicData;
        if ((!domain && !customDomain) || !client_id) return;

        /* wwFront:start */
        const defaultLang = wwLib.wwWebsiteData.getInfo().langs.find(lang => lang.default);
        const pagePath = wwLib.wwPageHelper.getPagePath(afterSignInPageId, defaultLang.lang);
        this.client = await createAuth0Client({
            domain: customDomain || domain,
            clientId: client_id,
            authorizationParams: {
                audience,
                scope: scope || 'openid profile email',
                redirect_uri: `${window.location.origin}${pagePath}`,
            },
        });
        /* wwFront:end */
    },
    async checkRedirectCallback() {
        try {
            const _window = wwLib.manager ? wwLib.getEditorWindow() : wwLib.getFrontWindow();
            const params = new URLSearchParams(_window.location.search);
            if (params.has('code') && params.has('state')) {
                await this.client.handleRedirectCallback();
                await this.setCookieSession();
                this.redirectAfterSignIn();
            }
        } catch (err) {
            wwLib.wwLog.error(err);
        }
    },
    async checkIsAuthenticated() {
        const isAuthenticated = await this.client.isAuthenticated();
        wwLib.wwVariable.updateValue(`${this.id}-isAuthenticated`, isAuthenticated);
        const accessToken = window.vm.config.globalProperties.$cookie.getCookie(ACCESS_COOKIE_NAME);
        wwLib.wwVariable.updateValue(`${this.id}-accessToken`, accessToken);
        const user = await this.client.getUser();
        wwLib.wwVariable.updateValue(
            `${this.id}-user`,
            user ? JSON.parse(JSON.stringify(user).replace(/https:\/\/auth0.weweb.io\//g, '')) : null
        );
    },
    async loginWithPopup({ screenHint, organization }) {
        try {
            await this.client.loginWithPopup({
                authorizationParams: {
                    screen_hint: screenHint,
                    organization,
                },
            });
            await this.setCookieSession();
            this.redirectAfterSignIn();
        } catch (err) {
            wwLib.wwLog.error(err);
        } finally {
            this.checkIsAuthenticated();
        }
    },
    loginWithRedirect({ screenHint, organization }) {
        /* wwFront:start */
        return this.client.loginWithRedirect({
            authorizationParams: {
                screen_hint: screenHint,
                organization,
            },
        });
        /* wwFront:end */
    },
    logout() {
        this.removeCookieSession();
        /* wwFront:start */
        const pagePath = wwLib.wwPageHelper.getPagePath(this.settings.publicData.afterNotSignInPageId);
        return this.client.logout({ logoutParams: { returnTo: `${window.location.origin}${pagePath}` } });
        /* wwFront:end */
    },
    removeCookieSession() {
        /* wwFront:start */
        window.vm.config.globalProperties.$cookie.removeCookie('session');
        /* wwFront:end */
        wwLib.wwVariable.updateValue(`${this.id}-accessToken`, null);
    },
    async setCookieSession(token = null) {
        const sessionToken = token || (await this.client.getTokenSilently());
        window.vm.config.globalProperties.$cookie.setCookie('session', sessionToken, {
            secure: true,
            sameSite: 'Lax',
        });
        wwLib.wwVariable.updateValue(`${this.id}-accessToken`, sessionToken);
    },
    redirectAfterSignIn() {
        /* wwFront:start */
        const pagePath = wwLib.wwPageHelper.getPagePath(this.settings.publicData.afterSignInPageId);
        wwLib.goTo(pagePath);
        /* wwFront:end */
    },
    async changeUserPassword({ connection, email }) {
        if (!email) return;

        const response = await axios.post(`https://${this.settings.publicData.domain}/dbconnections/change_password`, {
            connection,
            email,
        });

        return response.data;
    },
    async updateUserProfile({ familyName, givenName, nickname, username, name, picture, metadata }) {
        const data = {
            familyName,
            givenName,
            nickname,
            username,
            name,
            picture,
            metadata: (metadata || []).reduce((obj, item) => ({ ...obj, [item.key]: item.value }), {}),
        };
        /* wwFront:start */
        await axios.patch(`${window.location.origin}/ww/settings/${this.settings.id}/auth0/users/current`, {
            accessToken: this.accessToken,
            data,
        });
        /* wwFront:end */
        await wwLib.wwPlugins.auth0.client.getTokenSilently({ cacheMode: 'off' });
        const user = await this.client.getUser();
        wwLib.wwVariable.updateValue(
            `${this.id}-user`,
            user ? JSON.parse(JSON.stringify(user).replace(/https:\/\/auth0.weweb.io\//g, '')) : null
        );
    },
    async updateUserEmail({ email }) {
        const data = { email };
        /* wwFront:start */
        await axios.patch(`${window.location.origin}/ww/settings/${this.settings.id}/auth0/users/current`, {
            accessToken: this.accessToken,
            data,
        });
        /* wwFront:end */
        this.logout();
    },
};

