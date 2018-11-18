const _ = require('lodash');
const { get, getResourceId } = require('./api');
const config = require('./config');

const EmptySublevelItem = async (campaignId) => {
    const allRequests = await get('campaignrequest');
    const allRequest = allRequests.data.filter(rq => getResourceId(rq.campaign) == campaignId);
    const allSupplier = await get('supplier');
    const listSupplier = allSupplier.data.map(supplier => {
        const checkResult = allRequest.reduce((total, req) => 
            getResourceId(req.supplier) === supplier.participantId 
            && !_.includes(['CANCELED', 'REJECTED'], supplier.approvalStatus) ? total+1 : total, 0)
        const checked = checkResult > 0 ? true : false;
        const result = {
            id: supplier.participantId,
            name: supplier.name,
            checked,
            description: supplier.note,
            selected: false,
        }
        return result;
    });
    const result = {
        id : 'new',
        name: '',
        title: '',
        excerpt: '',
        html: '',
        status: config.default.productApprovalStatus,
        rfp: config.default.productStatus,
        createdOn: config.default.productCreatedOn,
        slug: '',
        editslug: '',
        clickslug: '',
        video: config.default.video,
        supplier: listSupplier,
    }
    return result;
}

const ApiCustomerCampaignRequest = async (campaignId) => {
    const allCampaign = await get('campaign', campaignId);
    if (!allCampaign || !allCampaign.data)
        return {};
    const mainTitle = allCampaign.data.name;
    const allRequests = await get('campaignrequest');
    const allRequest = allRequests.data.filter(rq => getResourceId(rq.campaign) == campaignId);
    const allProduct = await get('product');
    const allSupplier = await get('supplier');
    const reqs = allRequest.filter(r => getResourceId(r.campaign) == campaignId).map(request => {
        const listSupplier = allSupplier.data.map(supplier => {
            const selected = supplier.participantId === getResourceId(request.supplier);
            const checkResult = allRequest.reduce((total, req) => 
                getResourceId(req.supplier) === supplier.participantId 
                && !_.includes(['CANCELED', 'REJECTED'], supplier.approvalStatus) ? total+1 : total, 0) ;
            const checked = !selected && checkResult > 0 ? true : false;
            const result = {
                id: supplier.participantId,
                name: supplier.name,
                checked,
                description: supplier.note,
                selected,
            }
            return result;
        });
        const supplier = allSupplier.data.find(s => s.participantId == getResourceId(request.supplier));
        const product = allProduct.data.filter(p => 
            getResourceId(p.campaignRequest) == request.entityId);
        const isProduct = product && product.length > 0;
        const editslug = '';
        const slug = `/root-campaignrequest?${campaignId}`;
        const clickslug = '';
        const result = {
            id : request.entityId,
            name: `${request.name}`,
            title: `${request.name} / ${supplier ? supplier.name : '-'}`,
            excerpt: (isProduct ? product[0].excerpt : config.default.productExcerpt),
            html: (isProduct ? product[0].html : config.default.productHtml),
            status: (isProduct ? product[0].approvalStatus : config.default.productApprovalStatus),
            rfp: (isProduct ? product[0].status : config.default.productStatus),
            createdOn: (isProduct ? product[0].createdOn : config.default.productCreatedOn),
            slug,
            editslug,
            clickslug,
            video: (isProduct ? product[0].video : config.default.video),
            supplier: listSupplier,
        }
        return result;
    });
    const emptySublevelItem = await EmptySublevelItem(campaignId);
    return { mainTitle, backslag: config.default.root, data: [emptySublevelItem, ...reqs], test: {one:'one', two: 'two', three: 'three'} };
}

module.exports = { ApiCustomerCampaignRequest };
