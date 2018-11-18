const moment = require('moment');
const uuidv1 = require('uuid/v1');
const { get, post, put, makeResourceId } = require('./api');
const { bankAccountIndex, bankAccountId, entityId, refModel, suffix } = require('./setup-helper');
const idName = require('./api-entityId');
const _ = require('lodash');

const baseEntity = {
  "bankaccount" : {
    "$class": "org.acme.smartdonation.util.BankAccount",
    "entityId": uuidv1(),
    "accountNumber": '',
    "routingNumber": '',
    "note": '',
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
    "expirationOn": moment().format(),
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
  }
}

Object.prototype.ForceMatchObject = function(secondObject) {
  var firstNames = Object.keys(this);
  var secondNames = Object.keys(secondObject);
  firstNames.forEach(n => {
    if(!_.includes(secondNames, n))
      delete this[n];
  });
  return this;
};

Object.prototype.ResourceId = function() {
  var allName = Object.keys(this);
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
        this[name] = makeResourceId(name, this[name]);
        break;
      default :
        break;
    }
  })
  return this;
}

const PostBlockchain = async (model, data) => {
  const baseBlock = baseEntity[model];
  const element = data.ForceMatchObject(baseBlock);
  const item = {...baseBlock, ...element}
  const info = item.ResourceId();
  return await post(model, info);
}

const PutBlockchain = async (model, data) => {
  const getResult = await get(model, data[idName[model]]);
  const baseBlock = getResult.data;
  const element = data.ForceMatchObject(baseBlock);
  const item = {...baseBlock, ...element}
  const info = item.ResourceId();
  return await put(model, info, data[idName[model]]);
}

const SetBlockchain = async (model, data) => 
  await get(model, data[idName[model]]) ? await PutBlockchain(model, data) : await PostBlockchain(model, data)


module.exports = { SetBlockchain }
