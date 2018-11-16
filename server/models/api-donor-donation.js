const _ = require('lodash');
const { get, post, getResourceId } = require('./api');
const config = require('./config');

const ApiDonationBlnak = {
  id: 'new',
  title: '',
  description: '',
  rules: [],
  amount: 0,
  expireOn: '',
  availbleOn: '',
  status: config.default.productStatus,
  total:'',
  accepted: '',
  rejected: '',
  waiting: '',
  slug:'',
  editslug:'',
  clickslug:'',
}

const ApiDonationList = async () => {
    const donations = await get('donation');
    const requests = await get('campaignrequest');
    const products = await get('product');
    const cr = donations.data.map(donation => {
        const total = requests.data.reduce((count, request) =>
            getResourceId(request.donation) == donation.entityId && !_.includes(['CANCELED', 'REJECTED'], request.status) ? count+1 : count
        , 0);
        const accepted = products.data.reduce((count, product) =>
            getResourceId(product.donation) == donation.entityId && product.approvalStatus == "ACCEPTED" ? count+1 : count
        , 0);
        const rejected = products.data.reduce((count, product) =>
            getResourceId(product.donation) == donation.entityId && product.approvalStatus == "REJECTED" ? count+1 : count
        , 0);
        const slug = '/root';
        const editslug = ``;
        const clickslug = `/root-sublevel?${donation.entityId}`;
        const result = {
            id: donation.entityId,
            title: donation.name,
            description: donation.description,
            rules: donation.rules,
            amount: donation.amount,
            expireOn: donation.expireOn,
            availbleOn: donation.availbleOn,
            status: donation.status,
            total,
            accepted,
            rejected,
            waiting: total - accepted - rejected,
            slug,
            editslug,
            clickslug,
            };
        return result;
    });
    return [ApiDonationBlnak, ...cr];
}

module.exports = { ApiDonationList };
