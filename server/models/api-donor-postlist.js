const _ = require('lodash');
const { get, getResourceId } = require('./api');
const config = require('./config');

const ApiDonorPostList = async (donationId) => {
    const allDonation = await get('donation', donationId);
    if (!allDonation || !allDonation.data)
        return {};
    const donationName = allDonation.data.name;
    const allRequest = await get('campaignrequest');
    const allProduct = await get('product');
    const reqs = allRequest.data.filter(r => getResourceId(r.donation) == donationId).map(request => {
        const product = allProduct.data.filter(p => 
            getResourceId(p.campaignRequest) == request.entityId);
        const isProduct = product && product.length > 0;
        const editslug = '';
        const slug = `/root-donation?${donationId}`;
        const clickslug = isProduct ? `/root-post?${product[0].entityId}` : '';
        const result = {
            id : request.entityId,
            title: request.name,
            excerpt: (isProduct ? product[0].excerpt : config.default.productExcerpt),
            status: (isProduct ? product[0].approvalStatus : config.default.productApprovalStatus),
            html: (isProduct ? product[0].html : config.default.productHtml),
            createdOn: (isProduct ? product[0].createdOn : config.default.productCreatedOn),
            slug,
            editslug,
            clickslug,
            video: (isProduct ? product[0].video : config.default.video),
            product: (isProduct ? product[0].entityId: 'new'),
            customer: request.customer,
            campaign: request.campaign,
            campaignRequest: request.entityId,
            donor: request.donor,
            donation: request.donation,
            supplier: (isProduct ? product[0].supplier : ''),
        }
        return result;
    });
    return { donationName, backslag: config.default.root, data: reqs };
}

module.exports = { ApiDonorPostList };
