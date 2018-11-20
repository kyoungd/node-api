const _ = require('lodash');
const { get, post, getResourceId } = require('./api');
const config = require('./config');

const ApiDonationBlank = (customerId, donorId, entityId) => ({
  id: entityId,
  title: '',
  description: '',
  rules: '',
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
  customer: customerId,
  donor: donorId,
})

const ApiDonationList = async (customerId, donorId) => {
  const donations = await get('donation');
  const requests = await get('campaignrequest');
  const products = await get('product');
  const cr = donations.data.map(donation => {
    const total = requests.data.reduce((count, request) =>
      getResourceId(request.donation) == donation.entityId && !_.includes(['CANCELED', 'REJECTED'], request.status) ? count + 1 : count
      , 0);
    const accepted = products.data.reduce((count, product) =>
      getResourceId(product.donation) == donation.entityId && product.approvalStatus == "ACCEPTED" ? count + 1 : count
      , 0);
    const rejected = products.data.reduce((count, product) =>
      getResourceId(product.donation) == donation.entityId && product.approvalStatus == "REJECTED" ? count + 1 : count
      , 0);
    const slug = '/root';
    const editslug = ``;
    const clickslug = `/root-sublevel?${donation.entityId}`;
    const rules = donation.rules.join(' ');
    const result = {
      id: donation.entityId,
      title: donation.name,
      description: donation.description,
      rules,
      amount: donation.amount,
      expireOn: donation.expireOn.length > 10 ? donation.expireOn.slice(0, 10) : donation.expireOn,
      availableOn: donation.availableOn.length > 10 ? donation.availableOn.slice(0, 10) : donation.availableOn,
      status: donation.status,
      total,
      accepted,
      rejected,
      waiting: total - accepted - rejected,
      slug,
      editslug,
      clickslug,
      customer: customerId,
      donor: donorId,
    };
    return result;
  });
  return [ApiDonationBlank(customerId, donorId, 'blank'), ...cr, ApiDonationBlank(customerId, donorId, 'new')];
}

module.exports = { ApiDonationList };
