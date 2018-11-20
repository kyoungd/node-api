const moment = require('moment');
const uuidv1 = require('uuid/v1');
const _ = require('lodash');
const { get, post, put, makeResourceId } = require('./api');
const idName = require('./api-entityId');

const baseEntity = {
  "bankaccount" : {
    "$class": "org.acme.smartdonation.util.BankAccount",
    "entityId": uuidv1(),
    "accountNumber": '',
    "routingNumber": '',
    "note": ' ',
    "status": 'ACTIVE',
    "createdOn": moment().format()
  },
  "donation": {
    "$class": "org.acme.smartdonation.object.Donation",
    "entityId": uuidv1(),
    "name": "",
    "description": " ",
    "rules": [],
    "note": " ",
    "donateOn": moment().format(),
    "amount": 0,
    "availableOn": moment().format(),
    "expireOn": moment().format(),
    "status": "ACTIVE",
    "isExpired": "false",
    "isDonationLeft": "false",
    "isDonationSuccess": "true",
    "isDonationPartialSuccess": "false",
    "isDonationReturned": "false",
    "isDonationReturnMust": "true",
    "bankAccount": "",
    "donor": "",
    "customer": "",
  },
  "product": {
    "$class": "org.acme.smartdonation.object.Product",
    "entityId": uuidv1(),
    "approvalResponse": " ",
    "approvalStatus": "NOT_SUBMITTED",
    "createdOn": moment().format(),
    "description": " ",
    "excerpt": " ",
    "html": " ",
    "name": "",
    "note": " ",
    "status": "NOT_STARTED",
    "submittedForApprovalOn": moment().format(),
    "video": " ",
    "campaign": "",
    "campaignRequest": "",
    "customer": "",
    "donation": "",
    "donor": "",
    "supplier": ""
  },
  "campaign": {
    "$class": "org.acme.smartdonation.object.Campaign",
    "entityId": "",
    "name": "",
    "description": " ",
    "amount": 0,
    "status": "NOT_STARTED",
    "createdOn": "2018-11-20T09:08:43.032Z",
    "customer": "",
    "donor": "",
    "donation": "",
    "bankAccount": ""
  },
  "campaignrequest": {
    "$class": "org.acme.smartdonation.object.CampaignRequest",
    "entityId": "",
    "amount": 0,
    "createdOn": "",
    "description": " ",
    "name": "",
    "approvalStatus": "NOT_SUBMITTED",
    "approvalStatusReason": " ",
    "respondedOn": "",
    "status": "NOT_STARTED",
    "campaign": "",
    "customer": "",
    "donation": "",
    "donor": "",
    "supplier": ""
  }
}

const ForceMatchObject = (firstObject, secondObject) => {
  var firstNames = Object.keys(firstObject);
  var secondNames = Object.keys(secondObject);
  firstNames.forEach(n => {
    if(!_.includes(secondNames, n))
      delete firstObject[n];
  });
  return firstObject;
};

const ResourceId = (firstObject) => {
  var allName = Object.keys(firstObject);
  allName.forEach(name => {
    switch(name) {
      case "customer":
      case "donor":
      case "supplier":
      case "bankaccount":
      case "campaign":
      case "campaignrequest":
      case "donation":
      case "product":
      case "transferfund":
        firstObject[name] = makeResourceId(name, firstObject[name]);
        break;
      default :
        break;
    }
  })
  return firstObject;
}

const PostBlockchain = async (model, data) => {
  const baseBlock = baseEntity[model];
  const element = ForceMatchObject(data, baseBlock);
  const item = {...baseBlock, ...element}
  const info = ResourceId(item);
  const param = info[idName[model]] === 'new' ? {...info, [idName[model]]: uuidv1()} : info;
  console.log('api-post - PostBlockchain: ', param);
  return await post(model, param);
}

const PutBlockchain = async (model, data) => {
  console.log('api-put - PutBlockchain 1: ', data);
  const getResult = await get(model, data[idName[model]]);
  // console.log('api-put - PutBlockchain 2: ', getResult);
  const baseBlock = getResult.data;
  const element = ForceMatchObject(data, baseBlock);
  // console.log('api-put - PutBlockchain 3: ', element);
  const item = {...baseBlock, ...element}
  // console.log('api-put - PutBlockchain 4: ', item);
  const info = ResourceId(item);
  console.log('api-put - PutBlockchain 5: ', info, data[idName[model]]);
  return await put(model, info, data[idName[model]]);
}

const SetBlockchain = async (model, data) => {
  if (data.id === 'new' || data.entityId === 'new' || data.participantId === 'new') {
    return await PostBlockchain(model, data);
  } 
  const getBlock = await get(model, data[idName[model]]);
  return getBlock ? await PutBlockchain(model, data) : await PostBlockchain(model, data);
}

module.exports = { SetBlockchain }
