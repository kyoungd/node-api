const _ = require('lodash');
const { get, post, getResourceId } = require('./api');

const ApiCampaignDonation = async () => {
  const allDonation = await get('donation');
  const data = allDonation.data.filter(donation => 
    !_.includes(['COMPLETE', 'CANCELED'], donation.status)
  )
  const allCampaign = await get('campaign');
  const result = data.map(donation => {
    const campaign = allCampaign.data.find(c => 
      getResourceId(c.donation) === donation.entityId)
    return {
      id: donation.entityId,
      name: donation.name,
      amount: donation.amount,
      status: donation.status,
      donorId: getResourceId(donation.donor),
      campaignId: campaign ? campaign.entityId : '',
    }
  })
  return result;
}

module.exports = { ApiCampaignDonation }