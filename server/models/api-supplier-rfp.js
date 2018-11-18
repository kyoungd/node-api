const _ = require('lodash');
const { get, getResourceId } = require('./api');
const config = require('./config');

const ApiSupplierRfpList = async (supplierId) => {
    const supplier = await get('supplier', supplierId);
    if (!supplier || !supplier.data)
        return {};
    const mainTitle = supplier.data.name;
    const allRequests = await get('campaignrequest');
    const allRequest = allRequests.data.filter(rq => getResourceId(rq.supplier) == supplier.data.participantId);
    const allProduct = await get('product');
    const reqs = allRequest.map(request => {
        const product = allProduct.data.filter(p => 
            getResourceId(p.campaignRequest) == request.entityId);
        const isProduct = product && product.length > 0;
        const editslug = '';
        const slug = `/`;
        const clickslug = '';
        const result = {
            id : request.entityId,
            name: isProduct ? product.name : '',
            title: `${request.name} / ${isProduct ? product.name : ' -- '}`,
            excerpt: (isProduct ? product[0].excerpt : config.default.productExcerpt),
            html: (isProduct ? product[0].html : config.default.productHtml),
            status: (isProduct ? product[0].approvalStatus : config.default.productApprovalStatus),
            rfp: (isProduct ? product[0].status : config.default.productStatus),
            createdOn: (isProduct ? product[0].createdOn : config.default.productCreatedOn),
            slug,
            editslug,
            clickslug,
            video: (isProduct ? product[0].video : config.default.video),
            product: (isProduct ? product[0].entityId : ''),
        }
        return result;
    });
    return { mainTitle, backslag: config.default.root, data: [...reqs] };
}

module.exports = { ApiSupplierRfpList };
