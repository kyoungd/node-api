import config from '../../config/SiteConfig';
const { ApiDonorPostList } = require('./api-donor-postlist');
const { ApiCustomerCampaignRequest } = require('./api-customer-campaignrequest');

export default async function (siteState, entityId) {
    return (
        siteState == config.siteStateDonor ? await ApiDonorPostList(entityId) :
        (siteState == config.siteStateCustomer ? await ApiCustomerCampaignRequest(entityId) : undefined)
    )
}
