const { getResourceId } = require('./api');
const config = require('./config');

const getDashboardDonorPost = (result) => {
    const { data } = result;
    const dashboard = {
        productName : data.name,
        id: data.entityId,
        title: data.name,
        html: data.html,
        status: data.approvalStatus,
        video: data.video,
        slug: `${config.default.pageDonorProduct}?${getResourceId(data.entityId)}`,
        backslug: `${config.default.pageDonorDonation}?${getResourceId(data.donation)}`,
        createdOn: data.createdOn
    }
    return dashboard;
}

const getBackslag = (model, ix) => {
    switch(model) {
        case 'donor-donation':
            return `${config.default.pageDonorDonation}?${getResourceId(data.donation)}`;
        case 'donor-post':
            return `${config.default.pageDonorDonation}?${getResourceId(data.donation)}`;
    }
}

module.exports = { getDashboardDonorPost }
