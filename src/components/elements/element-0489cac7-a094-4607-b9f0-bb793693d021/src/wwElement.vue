<template>
    <div class="langs" :style="cssVariable" @mouseenter="isMouseInHandler(true)" @mouseleave="isMouseInHandler(false)">
        <div class="currentLang-container" @click="showDropdown">
            <div class="lang-container">
                <wwLayout v-if="content.leftLayout" :path="`langLayout[${getCurrentLangIndex + 1}]`"></wwLayout>
                <wwElement v-bind="content.currentLangText" :ww-props="{ text: formatLangString(getCurrentLang) }" />
            </div>
        </div>
        <div v-show="isLang || isContentEdit" class="langs-container">
            <div v-for="(lang, index) in getLangs" :key="index" class="lang-container" @click="changeLang(lang)">
                <wwLayout v-if="content.leftLayout" :path="`langLayout[${index + 1}]`"></wwLayout>
                <wwElement v-bind="content.langText" :ww-props="{ text: formatLangString(lang) }" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
    },
    data() {
        return {
            isLang: false,
            isContentEdit: false,
            isMouseIn: false,
        };
    },
    computed: {
        isEditing() {
            // eslint-disable-next-line no-unreachable
            return false;
        },
        getLangs() {
            return wwLib.wwWebsiteData.getCurrentPage().langs;
        },
        getCurrentLang() {
            return wwLib.wwLang.lang;
        },
        getCurrentLangIndex() {
            return this.getLangs.indexOf(this.getLangs.find(lang => lang === this.getCurrentLang));
        },
        getDefaultLang() {
            return wwLib.wwWebsiteData.getInfo().langs.filter(lang => lang.default)[0].lang;
        },
        cssVariable() {
            return {
                '--backgroundColor': this.content.backgroundColor,
                '--hoverColor': this.content.hoverColor,
                '--alignement': this.content.leftLayout ? 'flex-start' : 'center',
            };
        },
    },
    mounted() {
        wwLib.getFrontDocument().addEventListener('click', () => {
            if (this.isMouseIn) return;
            this.isLang = false;
        });
    },
    created() {
        wwLib.$on('ww-lang-dropdown:opened', () => {
            this.isLang = false;
        });
    },
    beforeUnmount() {
        wwLib.$off('ww-lang-dropdown:opened');
    },
    methods: {
        changeLang(lang) {
            this.showDropdown();
            /* wwFront:start */

            const siteLangs = wwLib.wwWebsiteData.getInfo().langs;
            const defaultLangConfig = siteLangs.find(l => l.default);
            const defaultLang = defaultLangConfig ? defaultLangConfig.lang : '';
            const displayDefaultLangPrefix = defaultLangConfig ? defaultLangConfig.isDefaultPath : false;

            // 1. Determine current content path (e.g., /page-slug)
            let currentContentPath;
            const windowPathSegments = window.location.pathname.split('/').filter(Boolean);
            if (windowPathSegments.length > 0 && this.getLangs.includes(windowPathSegments[0])) {
                currentContentPath = '/' + windowPathSegments.slice(1).join('/');
            } else {
                currentContentPath = '/' + windowPathSegments.join('/');
            }
            if (currentContentPath === '//' || currentContentPath === '') {
                currentContentPath = '/';
            }

            // 2. Get page definition and its path for the target language
            const currentPageDef = wwLib.wwWebsiteData.getCurrentPage();
            const pagePaths = currentPageDef.paths || { default: '' };
            let targetLangPagePathDef = pagePaths[lang] || pagePaths.default || '/';
            if (targetLangPagePathDef !== '/' && !targetLangPagePathDef.startsWith('/')) {
                targetLangPagePathDef = '/' + targetLangPagePathDef;
            }

            // 3. Determine the actual page route/slug for the new URL
            let resolvedPageRoute;
            if (targetLangPagePathDef.includes('{') && targetLangPagePathDef.includes('}')) {
                // Dynamic path: fill placeholders from current content path
                const targetPatternSegments = targetLangPagePathDef.split('/').filter(Boolean);
                const currentContentSegments = currentContentPath.split('/').filter(Boolean);
                const filledSegments = targetPatternSegments.map((segment, index) =>
                    segment.startsWith('{') && segment.endsWith('}')
                        ? currentContentSegments[index] || segment
                        : segment
                );
                resolvedPageRoute = '/' + filledSegments.join('/');
                if (resolvedPageRoute === '//') resolvedPageRoute = '/';
            } else {
                // Static path: use the current content path
                resolvedPageRoute = currentContentPath;
            }

            // 4. Handle homepage slug
            const isHomePage = currentPageDef.id === wwLib.wwWebsiteData.getInfo().homePageId;
            const finalSlugPart = isHomePage ? '/' : resolvedPageRoute;

            // 5. Determine language prefix
            const langPrefix = lang === defaultLang && !displayDefaultLangPrefix ? '' : '/' + lang;

            // 6. Construct and normalize the final path
            let finalPath = isHomePage ? langPrefix + '/' : langPrefix + finalSlugPart;
            let normalizedPath = finalPath.replace(/\/\/+/g, '/');

            if (normalizedPath.endsWith('/') && normalizedPath !== '/') {
                const isLangPrefixedHomepage = isHomePage && langPrefix !== '' && normalizedPath === langPrefix + '/';
                if (!isLangPrefixedHomepage) {
                    normalizedPath = normalizedPath.slice(0, -1);
                }
            }

            if (normalizedPath === '') {
                normalizedPath = '/';
            }

            // 7. Preserve query parameters
            const queryObject = {};
            try {
                new URLSearchParams(window.location.search).forEach((value, key) => {
                    queryObject[key] = value;
                });
                wwLib.goTo(normalizedPath, queryObject);
            } catch (error) {
                wwLib.goTo(normalizedPath);
            }
            /* wwFront:end */
        },
        formatLangString(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        showDropdown() {
            if (this.isLang) {
                this.isLang = false;
                return;
            }

            // eslint-disable-next-line vue/custom-event-name-casing
            wwLib.$emit('ww-lang-dropdown:opened');
            this.isLang = true;
        },
        toggleEdit() {
            this.isContentEdit = !this.isContentEdit;
        },
        isMouseInHandler(value) {
            this.isMouseIn = value;
        },
    },
};
</script>

<style lang="scss" scoped>
.langs {
    position: relative;
    .currentLang-container {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    .langs-container {
        overflow: hidden;
        margin-top: 6px;
        z-index: 1000;
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translate(-50%);
        width: 100%;
        background-color: var(--backgroundColor);
    }
    .lang-container {
        cursor: pointer;
        display: flex;
        flex-flow: row nowrap;
        justify-content: var(--alignement);
        align-items: center;

        width: 100%;
        transition: 0.2s;

        &:hover {
            transition: 0.2s;
            background-color: var(--hoverColor);
        }
    }
}
</style>
