const _ = require('lodash');
const { get, post, getResourceId } = require('./api');
const config = require('./config');

const ApiCampaignBlank = {
  id: 'new',
  title: '',
  description: '',
  rules: '',
  amount: 0,
  expireOn: '',
  availbleOn: '',
  status: config.default.productStatus,
  total: '',
  accepted: '',
  rejected: '',
  waiting: '',
  slug: '',
  editslug: '',
  clickslug: '',
  donation: 'new',
};

const ApiCampaignList = async () => {
    const campaigns = await get('campaign');
    const requests = await get('campaignrequest');
    const products = await get('product');
    const cr = campaigns.data.map(campaign => {
        const total = requests.data.reduce((count, request) =>
            getResourceId(request.campaign) == campaign.entityId && !_.includes(['CANCELED', 'REJECTED'], request.status) ? count+1 : count
        , 0);
        const pAccepted = products.data.reduce((count, product) =>
            getResourceId(product.campaign) == campaign.entityId && product.approvalStatus == "ACCEPTED" ? count+1 : count
        , 0);
        const pRejected = products.data.reduce((count, product) =>
            getResourceId(product.campaign) == campaign.entityId && product.approvalStatus == "REJECTED" ? count+1 : count
        , 0);
        const reqAccepted = requests.data.reduce((count, request) =>
            getResourceId(request.campaign) == campaign.entityId && request.approvalStatus == "ACCEPTED" ? count+1 : count
        , 0);
        const reqRrejected = requests.data.reduce((count, request) =>
            getResourceId(request.campaign) == campaign.entityId && request.approvalStatus == "REJECTED" ? count+1 : count
        , 0);

        const pWaiting = total - pAccepted - pRejected;
        const reqWaiting = total - reqAccepted - reqRrejected;
        const accepted = `${pAccepted}/${reqAccepted}`;
        const rejected = `${pRejected}/${reqRrejected}`
        const waiting = `${pWaiting}/${reqWaiting}`;
        const slug = '/root';
        const editslug = '';
        const clickslug = `/root-sublevel?${campaign.entityId}`;
        const result = {
            id: campaign.entityId,
            title: campaign.name,
            description: campaign.description,
            rules: '',
            amount: campaign.amount,
            expireOn: '',
            availbleOn: campaign.createdOn,
            status: campaign.status,
            total,
            accepted,
            rejected,
            waiting,
            slug,
            editslug,
            clickslug,
            donation: getResourceId(campaign.donation),
          };
        return result;
    });
    return [ApiCampaignBlank, ...cr];
}

module.exports = { ApiCampaignList };
