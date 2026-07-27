
export default {
    /*=============================================m_ÔÔ_m=============================================\
        Collection API
    \================================================================================================*/
    async sqlRequest({ connection, query }, wwUtils) {
        const websiteId = wwLib.wwWebsiteData.getInfo().id;
        wwUtils?.log('info', `[SQL] Executing request`, { type: 'request', preview: query });
        const { data } = await axios.post(`${wwLib.wwApiRequests._getPluginsUrl()}/designs/${websiteId}/sql/query`, {
            connection,
            query,
        });
        return data;
    },
};
