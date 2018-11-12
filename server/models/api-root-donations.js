const _ = require('lodash');
const { get, getResourceId } = require('./api');
const config = require('./config');

const ApiRootDonation = async (donationId) => {
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
        const slug = `/root-donation/${donationId}`;
        const clickslug = isProduct ? `/root-post/${product[0].entityId}` : '';
        const result = {
            id : request.entityId,
            title: request.name,
            excerpt: (isProduct ? product[0].excerpt : config.default.productExcerpt),
            status: (isProduct ? product[0].approvalStatus : config.default.productApprovalStatus),
            slug,
            editslug,
            clickslug,
            video: (isProduct ? product[0].video : config.default.video),
        }
        return result;
    });
    return { donationName, backslag: config.default.root, data: reqs };
}

module.exports = { ApiRootDonation };
