const _ = require('lodash');
const { get, getResourceId } = require('./api');
const config = require('./config');

const getAllSupplier = async (customerId) => {
    const allSupplier = await get('supplier');
    const data = allSupplier.data.map(supplier => {
        const result = {
            id: supplier.participantId,
            name: supplier.name,
            checked: false,
        }
        return result;
    })
    return data;
}

const ApiCampaignSupplier = async (campaignId) => {
    if (!campaignId)
        return await getAllSupplier();
    const campaign = await get('campaign', campaignId);
    if (!campaign || !campaign.data)
        return {};
    const allRequests = await get('campaignrequest');
    const allRequest = allRequests.data.filter(request => 
        getResourceId(request.campaign) == campaignId);
    const allSuppliers = await get('supplier');
    const allSupplier = allSuppliers.data.filter(supplier => 
        supplier.customer == campaign.data.customer);
    
    if (!allSupplier || allSupplier.length <= 0)
        return {}
    const reqs = allSupplier.data.map(supplier => {
        let checkResult = allRequest.data.reduce((total, request) => 
            getResourceId(request.supplier) === supplier.participantId 
            && !_.includes(['CANCELED', 'REJECTED'], supplier.approvalStatus) ? total+1 : total, 0) ;
        const checked = checkResult > 0 ? true : false;
        const result = {
            id: supplier.participantId,
            name: supplier.name,
            description: supplier.description,
            checked,
        }
        return result;
    });
    return reqs;
}

module.exports = { ApiCampaignSupplier };
