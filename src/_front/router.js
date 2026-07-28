import { createRouter, createWebHistory } from 'vue-router';

import wwPage from './views/wwPage.vue';

import {
    initializeData,
    initializePlugins,
    initializeIntegrationInstances,
    onPageUnload,
} from '@/_common/helpers/data';
import { convertPathToRouterFormat } from '@/_common/helpers/urlParametersParsing';
import { getRuntimeEnvironment } from '@/helpers/frontEnv.js';
import { useBackAuthStore } from '@/pinia/backAuth.js';

/**
 * @typedef {import('vue-router').Router} Router
 * @typedef {import('vue-router').RouteRecordRaw} RouteRecordRaw
 * @typedef {import('vue-router').RouterOptions} RouterOptions
 * @typedef {import('vue-router').RouterScrollBehavior} RouterScrollBehavior
 */

/**
 * @typedef {Object} Lang
 * @property {string} lang
 * @property {boolean} [default]
 * @property {boolean} [isDefaultPath]
 */

/**
 * @typedef {Object} PageSecurity
 * @property {'authenticated' | string} [accessRule]
 * @property {string[]} [accessRoles]
 * @property {'AND' | 'OR'} [accessRolesCondition]
 */

/**
 * @typedef {Object} Page
 * @property {string} id
 * @property {Record<string, string> & { default: string }} paths
 * @property {string[]} langs
 * @property {PageSecurity} [security]
 * @property {{ userGroup: string }[]} [pageUserGroups]
 */

/**
 * @typedef {Object} DesignInfo
 * @property {string} homePageId
 * @property {Page[]} pages
 * @property {Lang[]} langs
 * @property {unknown} [auth]
 * @property {{ href?: string }} [baseTag]
 */

/** @type {Router} */
let router;
/** @type {RouteRecordRaw[]} */
const routes = [];

/** @type {RouterScrollBehavior} */
const scrollBehavior = to => {
    if (to.hash) {
        return {
            el: to.hash,
            behavior: 'smooth',
        };
    } else {
        return { top: 0 };
    }
};

 
/* wwFront:start */
import pluginsSettings from '../../plugins-settings.json';

window.wwg_designInfo = {"id":"a9d5912f-b0a6-46b9-bbd9-f9557c8e7164","homePageId":"05af0eac-5ff0-46b5-bf5e-38b4eaea36e5","authPluginId":"01af5352-af71-4382-844b-2ec141ff243b","baseTag":{},"defaultTheme":"light","langs":[{"lang":"en","default":true,"isDefaultPath":false},{"lang":"ar","default":false,"isDefaultPath":false},{"lang":"fr","default":false,"isDefaultPath":false},{"lang":"ru","default":false,"isDefaultPath":false},{"lang":"uk","default":false,"isDefaultPath":false},{"lang":"nl","default":false,"isDefaultPath":false},{"lang":"es","default":false,"isDefaultPath":false},{"lang":"it","default":false,"isDefaultPath":false}],"background":{"backgroundSize":"contain","backgroundImage":null,"backgroundRepeat":"no-repeat"},"workflows":[{"id":"6eecbaad-a073-4a75-b1ec-9b294368c44b","actions":{},"trigger":"onload","triggerConditions":null},{"id":"b2741871-4cab-4a5a-9ab6-b684d26be4b9","name":"Load Teacher Profile","folder":null,"actions":{"fetch_all":{"id":"fetch_all","code":"try {\n  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvdHp4cWthZ3B0Y29rcGF2aW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NTAwNjMsImV4cCI6MjA5MjAyNjA2M30.hxMfM3Wll6Al9n55FORzCkGACCZijOpHmTE0VSrN_88';\n  const base = 'https://kotzxqkagptcokpaviol.supabase.co/rest/v1/rpc/';\n\n  let teacherId = variables['a351cdd7-fe01-4f4d-b209-438c5395f53a'];\n  if (!teacherId) {\n    const params = new URLSearchParams(window.location.search);\n    const fromUrl = params.get('teacher_id');\n    if (fromUrl) teacherId = parseInt(fromUrl, 10);\n  }\n  if (!teacherId) {\n    variables['6cbc243c-51ab-4b98-b4da-f30eb14c622c'] = {};\n    variables['dec41a41-0426-4984-baf7-5c0f90748406'] = [];\n    return;\n  }\n\n  const profileRes = await fetch(base + 'get_teacher_public_profile', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json', 'apikey': anonKey, 'Authorization': 'Bearer ' + anonKey },\n    body: JSON.stringify({ p_teacher_user_id: teacherId })\n  });\n  const profile = await profileRes.json();\n  variables['6cbc243c-51ab-4b98-b4da-f30eb14c622c'] = profile || {};\n\n  const reviewsRes = await fetch(base + 'get_teacher_reviews', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json', 'apikey': anonKey, 'Authorization': 'Bearer ' + anonKey },\n    body: JSON.stringify({ p_teacher_user_id: teacherId })\n  });\n  const reviews = await reviewsRes.json();\n  variables['dec41a41-0426-4984-baf7-5c0f90748406'] = Array.isArray(reviews) ? reviews : [];\n\n  const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole') || '';\n  if (role === 'student') {\n    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';\n    const favRes = await fetch(base + 'get_my_favorite_tutor_ids', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json', 'apikey': anonKey, 'Authorization': 'Bearer ' + anonKey },\n      body: JSON.stringify({ p_token: token })\n    });\n    const favIds = await favRes.json();\n    variables['e1526f43-ac04-4b69-873b-7cf58f2ec0ee'] = Array.isArray(favIds) && favIds.includes(teacherId);\n  }\n} catch (e) {\n  console.log('Failed to load teacher profile', e);\n}","name":"Fetch profile, reviews, favorite status","next":null,"type":"custom-js","__wwdescription":"Resolve teacher id then fetch profile + reviews + favorite status from Supabase"}},"trigger":"onload","description":"On page load, resolves which teacher to show (from the selected-tutor variable or a teacher_id URL param), then fetches their public profile, approved reviews, and (for students) favorite status.","firstAction":"fetch_all"}],"back":{"isServerSetup":{"staging":false,"production":false}},"auth":null,"pages":[{"id":"73c54a22-7f6b-4059-ba34-575f71a8564e","linkId":"73c54a22-7f6b-4059-ba34-575f71a8564e","name":"app","folder":null,"paths":{"en":"app","default":"app"},"langs":["en","ar","fr","ru","uk","nl","es","it"],"cmsDataSetPath":null,"sections":[{"uid":"86fd89c6-4c80-4007-8c9c-2ed7cdc0be84","sectionTitle":"Section","linkId":"fdd7e4df-b1ac-4b5f-b31b-d0923bc46dcb"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"9af3f5a8-64f5-4b36-9c7f-fcdeb44b1171","linkId":"9af3f5a8-64f5-4b36-9c7f-fcdeb44b1171","name":"tutor complete profile","folder":null,"paths":{"en":"tutor-complete-profile","default":"tutor-complete-profile"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"269bd3d2-30a7-4a0c-9a90-2581967d9106","sectionTitle":"Section","linkId":"6aca3bfb-0e47-4e28-ace2-63e3f8c6950b"},{"uid":"5356ffcf-76c8-4231-8624-7258586f43ba","sectionTitle":"Onboarding Wizard","linkId":"0f3085fe-11e5-4b3d-b8c9-29459272b97f"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"766df3cc-b36d-41f3-ad34-8bf4d5a70fe8","linkId":"766df3cc-b36d-41f3-ad34-8bf4d5a70fe8","name":"settings","folder":null,"paths":{"en":"settings","default":"settings"},"langs":["en","ar","fr","ru","uk","nl","es","it"],"cmsDataSetPath":null,"sections":[{"uid":"6d629772-905a-4c98-bdf7-8e050c03f4a9","sectionTitle":"Section","linkId":"ea7529db-b172-491c-be58-e131eb5258fb"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"d53802e3-5f6d-402f-8cb1-3b6025a85560","linkId":"d53802e3-5f6d-402f-8cb1-3b6025a85560","name":"classroom","folder":null,"paths":{"en":"classroom","default":"classroom"},"langs":["en","ar","fr","ru","uk","nl","es","it"],"cmsDataSetPath":null,"sections":[{"uid":"c6c0bc82-f0f8-4c98-9c9d-f9994ebae24b","sectionTitle":"Section","linkId":"107a62c6-ae64-4a74-9eb5-93448d0492aa"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"5b3e0373-75b6-474a-a76d-d657cab5088a","linkId":"5b3e0373-75b6-474a-a76d-d657cab5088a","name":"calendars","folder":null,"paths":{"en":"calendars","default":"calendars"},"langs":["en","ar","fr","ru","uk","nl","es","it"],"cmsDataSetPath":null,"sections":[{"uid":"3bda9b02-4acc-426b-9f97-4bd2ab94be32","sectionTitle":"Section","linkId":"ad0635af-4ede-4b2f-9cc0-097741d5daaa"},{"uid":"6d629772-905a-4c98-bdf7-8e050c03f4a9","sectionTitle":"Section","linkId":"ea7529db-b172-491c-be58-e131eb5258fb"},{"uid":"99c4568a-8878-4579-9f58-4d1a021db5bc","sectionTitle":"Section","linkId":"f1e308e1-d824-446d-841a-0433aba244e4"},{"uid":"a7fa8407-4975-4291-9ac9-b574b30f8c3d","sectionTitle":"Sidemenu","linkId":"8cf29ba7-1d87-4dfc-a7b3-0ee495e47470"},{"uid":"6ea28894-51c7-43b7-8eeb-7d2b813848b6","sectionTitle":"Top Nav","linkId":"25b6a494-641a-407b-b838-dcdc9b290415"},{"uid":"b221f193-279e-4f8a-b816-b7276b94b343","sectionTitle":"Sidemenu","linkId":"f392914a-ac69-4bf3-898d-b33da9dcc567"},{"uid":"d17dcc88-91af-4b61-8b5f-c87cb3ebf349","sectionTitle":"Sidemenu","linkId":"e2c3c762-7900-4a16-b800-b148a31c27f2"},{"uid":"522ab7eb-ba27-4bf6-a256-839a91e16ae6","sectionTitle":"Sidemenu","linkId":"9d207ec4-1cf9-40a1-a1eb-8129e468f4bb"},{"uid":"da5acc83-5d65-408b-9a80-c0f83e2e1b08","sectionTitle":"Sidemenu","linkId":"d1a5afeb-37b6-4d90-88e5-7f67c2fea4a3"}],"pageUserGroups":[],"title":{"en":"Calendar"},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"b2b052f5-04a1-4992-80b6-15b0c399fbf8","linkId":"b2b052f5-04a1-4992-80b6-15b0c399fbf8","name":"social","folder":null,"paths":{"en":"social","default":"social"},"langs":["en","ar","fr","ru","uk","nl","es","it"],"cmsDataSetPath":null,"sections":[{"uid":"5e5fefb7-4a9f-45e6-87d4-8dc113d39cac","sectionTitle":"Social Media ","linkId":"5955302d-c6ad-4e87-a57f-7aa0f3162aa3"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"5a4d93a5-56ab-4e1c-ac0d-30570e430abd","linkId":"5a4d93a5-56ab-4e1c-ac0d-30570e430abd","name":"Home","folder":null,"paths":{"en":"home","default":"home"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"639a1cc7-8a43-4f41-8760-af24de62dfee","sectionTitle":"Login page","linkId":"99f49783-2f1a-4054-82f4-70b23de3cd28"}],"pageUserGroups":[],"title":{"en":"Languato"},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"b585845b-e5f6-4493-aac1-d97dea8d7ac6","linkId":"b585845b-e5f6-4493-aac1-d97dea8d7ac6","name":"Home Teacher","folder":null,"paths":{"default":"/home-teacher"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"6d629772-905a-4c98-bdf7-8e050c03f4a9","sectionTitle":"Section","linkId":"ea7529db-b172-491c-be58-e131eb5258fb"},{"uid":"9c1a7ecd-1785-4509-abd5-f6d5a9e470d4","sectionTitle":"Home Teacher Hero Section","linkId":"81c6b2ac-0c40-454f-82ef-d5453f4ecc93"}],"pageUserGroups":[],"title":{"default":"Home Teacher"},"meta":{},"metaImage":"","security":{}},{"id":"c94aee65-f0e7-49ae-a80f-649e8d57e16b","linkId":"c94aee65-f0e7-49ae-a80f-649e8d57e16b","name":"students","folder":null,"paths":{"en":"students","default":"students"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"52f0510d-e503-4fd3-a1ec-00d2551fccc5","sectionTitle":"Top Nav","linkId":"16a82fc1-e532-4031-8b62-a7ca2dfb4c60"},{"uid":"435755da-422a-4587-8ada-df2be47efd3c","sectionTitle":"Top Nav","linkId":"e91d4898-bef0-4cdb-b08e-58eb32249044"},{"uid":"8856c8ee-2bff-4535-8e04-1012c85a9a38","sectionTitle":"Section","linkId":"e326de89-f5ec-4344-b2ef-5d42d08328ef"},{"uid":"a80d85a6-fb7c-4588-afcc-ab4e6b9fa05d","sectionTitle":"Top Nav","linkId":"43427da6-6f32-481c-9e83-4f0c2203d7c8"},{"uid":"82123ffb-4ed8-446c-82d7-b96232d8dc75","sectionTitle":"Top Nav","linkId":"d87a4966-1e47-4ab2-836a-7bbd7e9a9c15"},{"uid":"5ab1a92b-ed1b-4029-bf91-d30a519dab4e","sectionTitle":"Section","linkId":"89d0cabc-5b55-4bae-904d-3ff86760b7e0"},{"uid":"1b97018b-65e9-489f-8df1-0ddda563cf1d","sectionTitle":"Section","linkId":"741b1c05-aff6-4001-a9f5-3baf00344ab3"},{"uid":"99222cf6-23e2-46dd-9baa-71ae63d0470c","sectionTitle":"Top Nav","linkId":"696de1d1-3af9-4293-983c-4aa13d57bc20"},{"uid":"4f3ab8ac-146a-4be5-9766-2ff84baacddc","sectionTitle":"Sidemenu","linkId":"4f665325-0583-4b2e-917e-183f4e86454a"},{"uid":"5109d43a-1734-4393-9157-f0befce70e1a","sectionTitle":"Top Nav","linkId":"1f5c1438-53a1-4757-8de1-b1f9dbb20340"},{"uid":"5643222a-98c1-4d40-bcb4-9740321f6685","sectionTitle":"Sidemenu","linkId":"c0f5da3b-88a7-4d9d-9d1d-ad00a378d18c"},{"uid":"6c947cf8-04d9-4959-baab-0cb7517e0fa4","sectionTitle":"Sidemenu","linkId":"e2215a49-a065-4d3e-9853-acd5da30e5d5"},{"uid":"71a68623-d0f5-426b-83b5-2cc9b96a96d0","sectionTitle":"Sidemenu","linkId":"234f52ae-09f2-4de9-929f-3058965bf181"},{"uid":"eb0ff1e3-0305-4bd3-a2ea-cef649620a30","sectionTitle":"Sidemenu","linkId":"0e69dc7a-ea23-4d6c-a5a7-56eea0babcbe"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"59c398b8-7134-41e4-8fcb-351fef8cfbfe","linkId":"59c398b8-7134-41e4-8fcb-351fef8cfbfe","name":"register Tutor","folder":null,"paths":{"en":"register-tutor","default":"register-tutor"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"abf3ceee-b560-4703-bb8e-a410344e91a8","sectionTitle":"MainContainer","linkId":"4afdeab0-2d08-437b-8e75-976de8405845"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"ae20ccc4-3bb7-4740-b3e8-8fcb6b5915e3","linkId":"ae20ccc4-3bb7-4740-b3e8-8fcb6b5915e3","name":"Verify Email","folder":null,"paths":{"default":"/verify-email"},"langs":["en"],"cmsDataSetPath":null,"sections":[],"pageUserGroups":[],"title":{},"meta":{},"metaImage":"","security":{}},{"id":"ba2e7ef5-bc37-4447-a9c2-3d807f94aea7","linkId":"ba2e7ef5-bc37-4447-a9c2-3d807f94aea7","name":"admin login","folder":null,"paths":{"en":"admin-login","default":"admin-login"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"1bd1d28d-15e7-466f-9b62-e462f921c133","sectionTitle":"Admin Login Root","linkId":"55ca871b-b1e8-4d6d-a32d-3bab5661b345"}],"pageUserGroups":[],"title":{},"meta":{},"metaImage":"images/Gemini_Generated_Image_kayve2kayve2kayv-Photoroom.png?_wwcv=97","security":{}},{"id":"12a0bfcb-ea57-42e0-8c74-92d97286d6c6","linkId":"12a0bfcb-ea57-42e0-8c74-92d97286d6c6","name":"admin register","folder":null,"paths":{"en":"admin-register","default":"admin-register"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"70fa7d3d-d990-4c1d-8287-8a10a7f732e9","sectionTitle":"Admin Register Root","linkId":"227ce83a-c452-4942-8757-537c2d65d236"}],"pageUserGroups":[],"title":{},"meta":{},"metaImage":"","security":{}},{"id":"f8b6459f-e3ed-4c16-b869-c8b155cc92a9","linkId":"f8b6459f-e3ed-4c16-b869-c8b155cc92a9","name":"insight","folder":null,"paths":{"en":"insight","default":"insight"},"langs":["en","ar","fr","ru","uk","nl","es","it"],"cmsDataSetPath":null,"sections":[{"uid":"6d629772-905a-4c98-bdf7-8e050c03f4a9","sectionTitle":"Section","linkId":"ea7529db-b172-491c-be58-e131eb5258fb"},{"uid":"c93661d6-3fea-498d-98ad-07ec7cc2c33f","sectionTitle":"Insights Content Section","linkId":"21fe18a7-a766-4daf-81b4-cb4d459e420d"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"151c918c-59c5-47fa-aed8-a26cfaa33762","linkId":"151c918c-59c5-47fa-aed8-a26cfaa33762","name":"admin teacher applications","folder":null,"paths":{"en":"admin-teacher-applications","default":"admin-teacher-applications"},"langs":["en"],"cmsDataSetPath":null,"sections":[],"pageUserGroups":[],"title":{},"meta":{},"metaImage":"","security":{}},{"id":"47480d09-d05a-4bca-b629-8a0145dcea3e","linkId":"47480d09-d05a-4bca-b629-8a0145dcea3e","name":"teacher profile","folder":null,"paths":{"en":"teacher-profile","default":"teacher-profile"},"langs":["en"],"cmsDataSetPath":null,"sections":[],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"4a88d337-ba0e-4842-995b-242ac678887b","linkId":"4a88d337-ba0e-4842-995b-242ac678887b","name":"tutor_page","folder":null,"paths":{"en":"tutor_page","default":"tutor_page"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"6d629772-905a-4c98-bdf7-8e050c03f4a9","sectionTitle":"Section","linkId":"ea7529db-b172-491c-be58-e131eb5258fb"},{"uid":"59ea309f-663f-4a0b-8456-53108e73f3c3","sectionTitle":"Section","linkId":"a3b03d00-0edf-4cb7-b69d-d1e2978c7601"},{"uid":"b573d1ee-178d-45f5-9586-542ae3ff10a3","sectionTitle":"Section","linkId":"777ff28a-0665-4e98-bd0f-7250a1d76b6b"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"826cf2e2-29d7-4303-90aa-6d1b159cea0a","linkId":"826cf2e2-29d7-4303-90aa-6d1b159cea0a","name":"otp","folder":null,"paths":{"en":"otp","default":"otp"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"e6d0b0b0-971f-44a4-9967-63f538c35d37","sectionTitle":"OTP Main Container","linkId":"7a12e5c2-57d0-455c-8409-d1845f9e6e58"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"10fb313e-74cb-40ab-a65d-19c587ac4636","linkId":"10fb313e-74cb-40ab-a65d-19c587ac4636","name":"register Student","folder":null,"paths":{"en":"register-students","default":"register-students"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"99410795-1192-4617-84d7-8ed1005f649d","sectionTitle":"Main Container","linkId":"282a7859-b1fb-4c2a-a550-6c999f30fd0f"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"ece0479c-746f-4769-a7ab-ef8bcdc053c5","linkId":"ece0479c-746f-4769-a7ab-ef8bcdc053c5","name":"homestudent","folder":null,"paths":{"en":"homestudent","default":"homestudent"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"6d629772-905a-4c98-bdf7-8e050c03f4a9","sectionTitle":"Section","linkId":"ea7529db-b172-491c-be58-e131eb5258fb"},{"uid":"c18e1307-efcf-4bef-9f41-80cccb72cc17","sectionTitle":"Home Content New","linkId":"ac9382f9-d64d-43f8-8c02-a708b32cb73f"},{"uid":"bb63125a-e78f-4082-9edf-0aa18fb25e1f","sectionTitle":"Chat Interface","linkId":"6b4d36f0-7d9f-411c-8563-5f2932bbf856"},{"uid":"3bda9b02-4acc-426b-9f97-4bd2ab94be32","sectionTitle":"Section","linkId":"ad0635af-4ede-4b2f-9cc0-097741d5daaa"},{"uid":"de97a5e1-575a-4d61-bc45-36474106d4f2","sectionTitle":"Section","linkId":"83029b5d-6f1d-4107-b4f0-658cfd146e4b"},{"uid":"38f741b4-d9a5-4ac9-a537-bdc40f21f925","sectionTitle":"Section","linkId":"2f3dc5b7-79cb-4c13-a273-a36dc26a3be6"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"fde74fc9-2892-49c7-9200-6e3cb0dd2d02","linkId":"fde74fc9-2892-49c7-9200-6e3cb0dd2d02","name":"Forgot Password","folder":null,"paths":{"default":"forgot-password"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"705c122f-989f-4297-804d-679179971847","sectionTitle":"Forgot Password Root","linkId":"ff668f5b-9bbe-4a50-983e-5f09a71bdda4"}],"pageUserGroups":[],"title":{},"meta":{},"metaImage":"","security":{}},{"id":"05af0eac-5ff0-46b5-bf5e-38b4eaea36e5","linkId":"05af0eac-5ff0-46b5-bf5e-38b4eaea36e5","name":"login","folder":null,"paths":{"en":"register-page","default":"register-page"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"b7d5d539-9299-466e-885c-e12eb5cae493","sectionTitle":"Login page","linkId":"1c24825a-0f13-41b5-8f1e-e112fd9b0986"}],"pageUserGroups":[],"title":{"en":"Languato","fr":"Languato"},"meta":{"desc":{"en":"Find your perfect online tutor for any subject! Book 1-on-1 lessons, achieve academic goals, and learn fast with Languato."},"keywords":{"en":"teaching , online teacher , learn online"},"socialDesc":{"en":"Find your perfect online tutor for any subject! Book 1-on-1 lessons, achieve academic goals, and learn fast with Languato."},"socialTitle":{"en":"Languato"},"structuredData":{"en":""}},"metaImage":"images/Gemini_Generated_Image_kayve2kayve2kayv-Photoroom.png?_wwcv=97","security":{}},{"id":"af68e281-7c3d-418e-adbf-9b9c588f6387","linkId":"af68e281-7c3d-418e-adbf-9b9c588f6387","name":"Privacy Policy","folder":null,"paths":{"default":"privacy-policy"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"faccb5f4-542f-489c-83d3-8fb8a4a58f14","sectionTitle":"Privacy Policy Root","linkId":"97a50137-5c38-484f-8158-4d0f68df4c89"}],"pageUserGroups":[],"title":{},"meta":{},"metaImage":"","security":{}},{"id":"a1ddfeae-b278-4f32-b6a2-0d5c669014ec","linkId":"a1ddfeae-b278-4f32-b6a2-0d5c669014ec","name":"Data Deletion","folder":null,"paths":{"default":"data-deletion"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"d8c09b53-7dcd-4bb6-98a9-2f49de4a19c0","sectionTitle":"Data Deletion Root","linkId":"726453f3-34e9-486a-a46d-355ad72ed7ef"}],"pageUserGroups":[],"title":{},"meta":{},"metaImage":"","security":{}},{"id":"2f40b831-e23d-446c-81e9-1f5e465be94a","linkId":"2f40b831-e23d-446c-81e9-1f5e465be94a","name":"schedule lessons ","folder":null,"paths":{"en":"schedule-lessons-","default":"schedule-lessons-"},"langs":["en","ar","fr","ru","uk","nl","es","it"],"cmsDataSetPath":null,"sections":[],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"fe2c8662-7052-474a-b82e-c16950d6acc9","linkId":"fe2c8662-7052-474a-b82e-c16950d6acc9","name":"schedule-lessons","folder":null,"paths":{"en":"schedule-lessons","default":"schedule-lessons"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"6d629772-905a-4c98-bdf7-8e050c03f4a9","sectionTitle":"Section","linkId":"ea7529db-b172-491c-be58-e131eb5258fb"},{"uid":"5f4129be-481b-41cc-9b31-4eab17339e32","sectionTitle":"Schedule Content","linkId":"6768b2a2-1570-4405-a149-d62b7d832aec"}],"pageUserGroups":[],"title":{},"meta":{},"metaImage":"","security":{}},{"id":"68b90fdb-48ab-4e4f-807b-09e3cfd17b50","linkId":"68b90fdb-48ab-4e4f-807b-09e3cfd17b50","name":"messages","folder":null,"paths":{"en":"messages","default":"messages"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"6d629772-905a-4c98-bdf7-8e050c03f4a9","sectionTitle":"Section","linkId":"ea7529db-b172-491c-be58-e131eb5258fb"},{"uid":"876c29c1-365b-49c8-bcf9-79f1d2f11334","sectionTitle":"Sidemenu","linkId":"5079aeba-791d-4a37-9f25-db6b014916e1"},{"uid":"6e8df53b-30da-48ea-b0e2-44e2ac3aefc9","sectionTitle":"Top Nav","linkId":"ca8305fe-95ed-4a6f-ba53-83770284b09e"},{"uid":"614bc400-18f5-4301-ab0f-fc5a9eebcec1","sectionTitle":"Section","linkId":"82bb5671-e54d-49d8-9a84-fc1e2e32ab5c"},{"uid":"b6327682-d6df-412f-816b-7a669821744d","sectionTitle":"Section","linkId":"35587a8e-e7d4-44a0-9a73-3ec9ae420f55"},{"uid":"4b819fac-2f9a-48e7-a87b-41ef0df0727b","sectionTitle":"Sidemenu","linkId":"e0cfd80a-bc0f-4131-bd71-bed406fd2685"},{"uid":"0f1ffc2c-00f6-4b76-8218-7438de01bd97","sectionTitle":"Section","linkId":"feb246a5-9274-4fce-a4a6-5eb010d9c574"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"587eaca4-60d2-42e9-9b13-d62669884241","linkId":"587eaca4-60d2-42e9-9b13-d62669884241","name":"Admin","folder":null,"paths":{"en":"admin","default":"admin"},"langs":["en","ar","fr","ru","uk","nl","es","it"],"cmsDataSetPath":null,"sections":[{"uid":"70f70538-8c29-4e4b-851e-442b8e073afc","sectionTitle":"Admin Applications Root","linkId":"4f247558-aff1-4d6c-873b-c96378898486"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"045e0cf6-d519-4551-92e2-2a404c6986af","linkId":"045e0cf6-d519-4551-92e2-2a404c6986af","name":"choose tutor","folder":null,"paths":{"en":"choose-tutor","default":"choose-tutor"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"6d629772-905a-4c98-bdf7-8e050c03f4a9","sectionTitle":"Section","linkId":"ea7529db-b172-491c-be58-e131eb5258fb"},{"uid":"fbdb8208-a874-404e-8081-5104fca07291","sectionTitle":"Section","linkId":"2dcd1cad-f88d-478a-b24f-eb6b7161c0a6"},{"uid":"345b06df-b96a-4db1-b674-a8d10fa7fef9","sectionTitle":"Section","linkId":"7790fb8e-00ee-4cb1-903d-9c9a6d837f0e"},{"uid":"228400c7-dd6b-482e-9962-3e8d49ca94cf","sectionTitle":"Section","linkId":"4632f9ec-6da1-4d13-9054-0803e09b4717"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"85305782-043a-438e-ba82-2a07284c8b1d","linkId":"85305782-043a-438e-ba82-2a07284c8b1d","name":"subscribe","folder":null,"paths":{"en":"subscribe","default":"subscribe"},"langs":["en","ar","fr","ru","uk","nl","es","it"],"cmsDataSetPath":null,"sections":[{"uid":"7e21ae6c-0f85-40f0-9947-35f249e87c75","sectionTitle":"Subscription Page","linkId":"98197624-55fc-4e77-8930-40f513db67f3"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":"","security":{}},{"id":"77f928d6-2009-49b9-b6cc-07428d70edf6","linkId":"77f928d6-2009-49b9-b6cc-07428d70edf6","name":"availability","folder":null,"paths":{"en":"availability","default":"availability"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"6d629772-905a-4c98-bdf7-8e050c03f4a9","sectionTitle":"Section","linkId":"ea7529db-b172-491c-be58-e131eb5258fb"},{"uid":"a19cc211-a62e-4fa7-b333-b36f4553549e","sectionTitle":"Availability Content Section","linkId":"6fcc5918-addc-41b6-9016-3dbe7593bf6d"}],"pageUserGroups":[],"title":{},"meta":{},"metaImage":"","security":{}}],"plugins":[{"id":"00d22f72-1a03-44f8-ad68-c593dc80b543","name":"Stripe","namespace":"stripe"},{"id":"f9ef41c3-1c53-4857-855b-f2f6a40b7186","name":"Supabase","namespace":"supabase"},{"id":"75b9e021-a5fe-4ae9-8c6a-f4b3e65f2a24","name":"Vimeo","namespace":"vimeo"},{"id":"fbf0feec-356b-461b-8738-3b1f44edaf02","name":"Google GTM","namespace":"gtm"},{"id":"1c5f5c0f-5609-4031-9e57-5bb4811be7b3","name":"Youtube","namespace":"youtube"},{"id":"66a79c98-70e7-4bc4-8859-20776b024ec2","name":"PWA","namespace":"pwa"},{"id":"e93a2dfd-9b19-473e-b445-c666fed4e14a","name":"Auth0","namespace":"auth0"},{"id":"1506e088-e31c-49bc-83a1-90a3de4f6db1","name":"SQL","namespace":"sql"},{"id":"d7d2c879-1783-4d58-a9bb-807f065d941e","name":"Dailymotion","namespace":"dailymotion"},{"id":"60610cfd-fa28-4fc1-9e72-088b5c667e81","name":"Calendly","namespace":"calendly"},{"id":"cabb43dd-6161-4140-8ebf-03b6fb045a0b","name":"Google","namespace":"google"},{"id":"97e7b1ae-f88a-4697-849c-ee56ab49bb48","name":"JavaScript","namespace":"javascript"},{"id":"9c40819b-4a8f-468f-9ba5-4b9699f3361f","name":"Charts","namespace":"chartjs"},{"id":"832d6f7a-42c3-43f1-a3ce-9a678272f811","name":"Date","namespace":"dayjs"},{"id":"2bd1c688-31c5-443e-ae25-59aa5b6431fb","name":"REST API","namespace":"restApi"},{"id":"6a64802c-52f8-4637-9932-580bf178aaa7","name":"WeWeb Auth","namespace":"wewebAuth"},{"id":"41448d5d-ae26-49bd-82b6-1c79f462e972","name":"Token Based Auth","namespace":"authToken"},{"id":"8bc1b5c9-29e4-4269-becb-a2e1a8de9127","name":"WeWeb Email","namespace":"wewebEmail"},{"id":"d66a250d-8468-469e-ad33-ee028f632398","name":"OpenAI","namespace":"openai"},{"id":"01af5352-af71-4382-844b-2ec141ff243b","name":"OpenID","namespace":"openid"},{"id":"f5856798-485d-47be-b433-d43d771c64e1","name":"Xano Auth","namespace":"xanoAuth"},{"id":"cd33cf33-e29f-4e8c-ac26-b997fe507ce7","name":"Xano","namespace":"xano"}]};
window.wwg_cacheVersion = 97;
window.wwg_pluginsSettings = pluginsSettings;
window.wwg_disableManifest = false;

/** @type {Lang} */
const defaultLang = window.wwg_designInfo.langs.find(({ default: isDefault }) => isDefault) || {
    lang: 'en',
    default: true,
};

/**
 * @param {Page} page
 * @param {Lang} lang
 * @param {string} [forcedPath]
 */
const registerRoute = (page, lang, forcedPath) => {
    const langSlug = !lang.default || lang.isDefaultPath ? `/${lang.lang}` : '';
    let path =
        forcedPath ||
        (page.id === window.wwg_designInfo.homePageId ? '/' : `/${page.paths[lang.lang] || page.paths.default}`);

    path = convertPathToRouterFormat(path);

    routes.push({
        path: langSlug + path,
        component: wwPage,
        name: `page-${page.id}-${lang.lang}`,
        meta: {
            pageId: page.id,
            lang,
            isPrivate: !!page.pageUserGroups?.length,
        },
        async beforeEnter(to, from) {
            if (to.name === from.name) return;
            //Set page lang
            wwLib.wwLang.defaultLang = defaultLang.lang;
            wwLib.$store.dispatch('front/setLang', lang.lang);

            const backAuthStore = useBackAuthStore(wwLib.$pinia);
            if (!wwLib.wwAuth.plugin) {
                if (!backAuthStore.projectAuth && window.wwg_designInfo.auth) {
                    backAuthStore.setProjectAuth(window.wwg_designInfo.auth);
                }
            }

            //Init plugins
            await initializePlugins();

            //Init integration instances
            await initializeIntegrationInstances();

            if (!wwLib.wwAuth.plugin) {
                await backAuthStore.refresh();
                const projectAuth = backAuthStore.projectAuth || {};

                //Check if private page
                if (page.security?.accessRule === 'authenticated') {
                    if (!backAuthStore.isAuthenticated) {
                        window.location.href = `${wwLib.wwPageHelper.getPagePath(
                            projectAuth.unauthenticatedPageId
                        )}?_source=${to.path}`;
                        return null;
                    } else if (page.security?.accessRoles?.length) {
                        const hasAccess =
                            page.security.accessRolesCondition === 'AND'
                                ? backAuthStore.matchAllRoles(page.security.accessRoles)
                                : backAuthStore.matchAnyRoles(page.security.accessRoles);
                        if (!hasAccess) {
                            window.location.href = `${wwLib.wwPageHelper.getPagePath(
                                projectAuth.unauthorizedPageId
                            )}?_source=${to.path}`;
                            return null;
                        }
                    }
                }
            } else {
                // Deprecated legacy auth plugins, to remove in the future
                if (page.pageUserGroups?.length) {
                    await wwLib.wwAuth.init();

                    // Redirect to not sign in page if not logged
                    if (!wwLib.wwAuth.getIsAuthenticated()) {
                        window.location.href = `${wwLib.wwPageHelper.getPagePath(
                            wwLib.wwAuth.getUnauthenticatedPageId()
                        )}?_source=${to.path}`;

                        return null;
                    }

                    //Check roles are required
                    if (
                        page.pageUserGroups.length > 1 &&
                        !wwLib.wwAuth.matchUserGroups(page.pageUserGroups.map(({ userGroup }) => userGroup))
                    ) {
                        window.location.href = `${wwLib.wwPageHelper.getPagePath(
                            wwLib.wwAuth.getUnauthorizedPageId()
                        )}?_source=${to.path}`;

                        return null;
                    }
                }
            }

            try {
                await import(`@/pages/${page.id.split('_')[0]}.js`);
                await wwLib.wwWebsiteData.fetchPage(page.id);

                //Scroll to section or on top after page change
                if (to.hash) {
                    const targetElement = document.getElementById(to.hash.replace('#', ''));
                    if (targetElement) targetElement.scrollIntoView();
                } else {
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                }

                return;
            } catch (err) {
                wwLib.$store.dispatch('front/showPageLoadProgress', false);

                if (err.redirectUrl) {
                    return { path: err.redirectUrl || '404' };
                } else {
                    //Any other error: go to target page using window.location
                    window.location = to.fullPath;
                }
            }
        },
    });
};

for (const page of window.wwg_designInfo.pages) {
    for (const lang of window.wwg_designInfo.langs) {
        if (!page.langs.includes(lang.lang)) continue;
        registerRoute(page, lang);
    }
}

const page404 = window.wwg_designInfo.pages.find(page => page.paths.default === '404');
if (page404) {
    for (const lang of window.wwg_designInfo.langs) {
        // Create routes /:lang/:pathMatch(.*)* etc for all langs of the 404 page
        if (!page404.langs.includes(lang.lang)) continue;
        registerRoute(
            page404,
            {
                default: false,
                lang: lang.lang,
            },
            '/:pathMatch(.*)*'
        );
    }
    // Create route /:pathMatch(.*)* using default project lang
    registerRoute(page404, { default: true, isDefaultPath: false, lang: defaultLang.lang }, '/:pathMatch(.*)*');
} else {
    routes.push({
        path: '/:pathMatch(.*)*',
        redirect: null,
        async beforeEnter() {
            window.location.href = '/404';
        },
    });
}

/** @type {RouterOptions} */
let routerOptions;

const isProd = getRuntimeEnvironment() === 'production';

if (isProd && window.wwg_designInfo.baseTag?.href) {
    let baseTag = window.wwg_designInfo.baseTag.href;
    if (!baseTag.startsWith('/')) {
        baseTag = '/' + baseTag;
    }
    if (!baseTag.endsWith('/')) {
        baseTag += '/';
    }

    routerOptions = {
        history: createWebHistory(baseTag),
        routes,
    };
} else {
    routerOptions = {
        history: createWebHistory(),
        routes,
    };
}

router = createRouter({
    ...routerOptions,
    scrollBehavior,
});

//Trigger on page unload
let isFirstNavigation = true;
router.beforeEach(async (to, from) => {
    if (to.name === from.name) return;
    if (!isFirstNavigation) await onPageUnload();
    isFirstNavigation = false;
    wwLib.globalVariables._navigationId++;
    return;
});

//Init page
router.afterEach((to, from, failure) => {
    wwLib.$store.dispatch('front/showPageLoadProgress', false);
    let fromPath = from.path;
    let toPath = to.path;
    if (!fromPath.endsWith('/')) fromPath = fromPath + '/';
    if (!toPath.endsWith('/')) toPath = toPath + '/';
    if (failure || (from.name && toPath === fromPath)) return;
    initializeData(to);
});
/* wwFront:end */

export default router;
