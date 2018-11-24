const { get, post } = require('./api');
const { bankAccountIndex, bankAccountId, entityId, refModel, suffix } = require('./setup-helper');
const politicalads = require('../politicalads');

const doexist = async (model) => {
    const cr = await get(model);
    const result = (!cr || cr.data.length <= 0) ? false : true;
    return result;
}

const bankaccount = async () => {
    for (i=1; i < 30; ++i) {
        let data = 
            {
                "$class": "org.acme.smartdonation.util.BankAccount",
                "entityId": bankAccountId(i),
                "accountNumber": "1234-123-10" + suffix(i),
                "routingNumber": "123412-310" + suffix(i),
                "note": "string",
                "status": "ACTIVE",
                "createdOn": "2018-11-09T17:54:40.051Z"
            }
        await post ('bankaccount', data);
    }
}

const participant = async () => {
    if (!(await doexist('customer'))) {
        const customerData = 
        {
            "$class": "org.acme.smartdonation.participant.Customer",
            "name": "Red Cross",
            "participantId": entityId('c'),
            "phoneNumber": "555-123-1234",
            "email": "bill@redcross.com",
            "note": "Be Christ like. Serve all.",
            "status": "ACTIVE",
            "access": {
                "$class": "org.acme.smartdonation.participant.RoleAccess",
                "isRead": "false",
                "isWrite": "false",
                "isAccountOnly": "false",
                "isDepartmentOnly": "false",
                "isAll": "true"
            }
        }
        await post('customer', customerData);
    }
    if (!(await doexist('donor'))) {
        const donorData =
        {
            "$class": "org.acme.smartdonation.participant.Donor",
            "name": "Bill Gates",
            "participantId": entityId('d'),
            "phoneNumber": "555-123-1234",
            "email": "bill@microsoft.com",
            "note": "donate to chnage the world",
            "status": "ACTIVE",
            "access": {
                "$class": "org.acme.smartdonation.participant.RoleAccess",
                "isRead": "false",
                "isWrite": "false",
                "isAccountOnly": "false",
                "isDepartmentOnly": "false",
                "isAll": "true",
            },
            "customer": `resource:org.acme.smartdonation.participant.Customer#${entityId('c')}`,
            "bankAccount": `resource:org.acme.smartdonation.util.BankAccount#${bankAccountId(bankAccountIndex('donor'))}`,
        }
        await post('donor', donorData);
    }
    if (!(await doexist('supplier'))) {
        const nameList = [
            "Wiggly Wigglers", "Duke of Pork",
            "Canary Dwarf", "Feelingpeaky",
            "Smoke & Croak", "Yellobelly",
            "Goldipots", "WoofBox",
            "Cakes with Faces", "Sensible Dave",
            "Adam Smith", "Carl Marx"
        ];
        for (let ix=1; ix < 10; ++ix) {
            let supplier =
            {
                "$class": "org.acme.smartdonation.participant.Supplier",
                "name": `${nameList[ix]}`,
                "participantId": entityId('s', ix),
                "phoneNumber": "555-123-1234",
                "email": "bill@microsoft.com",
                "note": "donate to chnage the world",
                "status": "ACTIVE",
                "access": {
                    "$class": "org.acme.smartdonation.participant.RoleAccess",
                    "isRead": "false",
                    "isWrite": "false",
                    "isAccountOnly": "false",
                    "isDepartmentOnly": "false",
                    "isAll": "true"
                },
                "customer": `resource:org.acme.smartdonation.participant.Customer#${entityId('c')}`,
                "bankAccount": `resource:org.acme.smartdonation.util.BankAccount#${bankAccountId(bankAccountIndex('supplier') + ix - 1)}`
            }
            await post('supplier', supplier);
        }
    }
}

const donation = async () => {
    const donation1 = {
        "$class": "org.acme.smartdonation.object.Donation",
        "entityId": entityId('t', 1),
        "name": "Factual ads only",
        "description": "Proposing to restore the state’s commitment to fund two-thirds of public school costs, matching a plan by his Democratic opponent, State Superintendent Tony Evers.",
        "rules": ['factual advertisements', 'focus on the candidate', 'candidates accomplishments'],
        "note": "More than 250,000 people have been forced to flee their homes to avoid three major blazes in the state. Firefighters were powerless in stopping a wildfire destroying the northern town of Paradise, where nine people died and 35 are missing. A raging wildfire swept into the southern beach resort of Malibu - home to many Hollywood stars - on Friday.",
        "donateOn": "2016-11-10T19:05:41.190Z",
        "amount": 4000000,
        "availableOn": "2016-11-10T19:05:41.190Z",
        "expireOn": "2018-11-10T19:05:41.190Z",
        "status": "ACTIVE",
        "isExpired": "true",
        "isDonationLeft": "false",
        "isDonationSuccess": "true",
        "isDonationPartialSuccess": "false",
        "isDonationReturned": "false",
        "isDonationReturnMust": "true",
        "bankAccount": refModel('bankaccount', 1, 'donation'),
        "donor": refModel('donor'),
        "customer": refModel('customer'),
    }
    await post('donation', donation1);
    const donation2 = {
        "$class": "org.acme.smartdonation.object.Donation",
        "entityId": entityId('t', 2),
        "name": "Humours and postive ads only for senate and governor",
        "description": "Gov. Scott Walker is proposing to restore the state’s commitment to fund two-thirds of public school costs, matching a plan by his Democratic opponent, State Superintendent Tony Evers.",
        "rules": ['postive ads only', 'it must represent light site of the candidate', 'focus on the candidate', 'candidates accomplishments'],
        "note": "Authorities say the Camp Fire in the north and the Woolsey Fire and Hill Fire in the south are being fanned by strong winds and dry forests. By Saturday, the Woolsey Fire had doubled in size, officials said. The magnitude of the destruction of the fire is unbelievable and heartbreaking, said Mark Ghilarducci, of the California governor's office.",
        "donateOn": "2018-11-10T19:05:41.190Z",
        "amount": 5000000,
        "availableOn": "2018-11-10T19:05:41.190Z",
        "expireOn": "2020-11-10T19:05:41.190Z",
        "status": "ACTIVE",
        "isExpired": "false",
        "isDonationLeft": "false",
        "isDonationSuccess": "false",
        "isDonationPartialSuccess": "false",
        "isDonationReturned": "false",
        "isDonationReturnMust": "true",
        "bankAccount": refModel('bankaccount', 2, 'donation'),
        "donor": refModel('donor'),
        "customer": refModel('customer'),
    }
    await post('donation', donation2)
}

const campaign = async () => {
    const c1 = {
        "$class": "org.acme.smartdonation.object.Campaign",
        "entityId": entityId('campaign', 1),
        "name": "Campaign Factual.",
        "description": "Campaign that only highlights facts",
        "amount": 4000000,
        "status": "COMPLETE",
        "createdOn": "2016-11-10T19:05:41.084Z",
        "customer": refModel('customer'),
        "donor": refModel('donor'),
        "donation": refModel('donation', 1),
        "bankAccount": refModel('bankaccount', 1, 'campaign'),
    }
    await post('campaign', c1);
    const c2 = {
        "$class": "org.acme.smartdonation.object.Campaign",
        "entityId": entityId('campaign', 2),
        "name": "Positive and humours ads.",
        "description": "Campaign that only focus on positives",
        "amount": 5000000,
        "status": "ACTIVE",
        "createdOn": "2018-10-10T19:05:41.084Z",
        "customer": refModel('customer'),
        "donor": refModel('donor'),
        "donation": refModel('donation', 2),
        "bankAccount": refModel('bankaccount', 2, 'campaign'),
    }
    await post('campaign', c2);
}

const campaignrequest = async() => {
    for (ix = 1; ix <= 4; ++ix) {
        let cr1 = {
            "$class": "org.acme.smartdonation.object.CampaignRequest",
            "entityId": entityId('campaignrequest', ix),
            "amount": 1000000,
            "createdOn": "2016-11-10T19:05:41.130Z",
            "description": "Add to differentiate the candidate",
            "name": "Breast feeding spot",
            "approvalStatus": "ACCEPTED",
            "approvalStatusReason": "OK",
            "respondedOn": "2018-11-10T19:05:41.130Z",
            "status": "COMPLETE",
            "campaign": refModel('campaign', 1),
            "customer": refModel('customer'),
            "donation": refModel('donation', 1),
            "donor": refModel('donor'),
            "supplier": refModel('supplier', ix)
        }
        switch(ix) {
          case 1 :
            cr1.description = "An women to represent people, not just men";
            cr1.name = "Maryland's Krish Vignarajah";
            break;
          case 2:
            cr1.description = "Highlight cooperation to get things done";
            cr1.name = "Democratic Sen. Joe Donnelly";
            break;
          case 3:
            cr1.description = "Direct and factual about J.B. Pritzker to Rod Blagojevich";
            cr1.name = "Gov. Bruce Rauner";
            break;
          case 4:
            cr1.description = "#MeToo. A former employee of Jackley's accused the Attorney General";
            cr1.name = "South Dakota’s Republican Primary";
            break;
        }
        await post('campaignrequest', cr1);
        let cr2 = {
            "$class": "org.acme.smartdonation.object.CampaignRequest",
            "entityId": entityId('campaignrequest', ix + 4),
            "amount": 1250000,
            "createdOn": "2016-11-10T19:05:41.130Z",
            "description": "The idea that we might not be able to shop as normal in the immediate aftermath of Brexit seems ludicrous. When I asked on Twitter if anyone was putting aside goods, I was accused of scaremongering. What a ridiculous tweet, do people actually think were going back to the stone age immediately after Brexit? was one scathing response.",
            "name": "Postive and humorous Ad",
            "approvalStatus": "ACCEPTED",
            "approvalStatusReason": "OK",
            "respondedOn": "2018-11-10T19:05:41.130Z",
            "status": "COMPLETE",
            "campaign": refModel('campaign', 2),
            "customer": refModel('customer'),
            "donation": refModel('donation', 2),
            "donor": refModel('donor'),
            "supplier": refModel('supplier', ix)
        }
        switch(ix) {
          case 1 :
            cr1.description = "A hard hitting and no holds barred, Trumpesque";
            cr1.name = "Florida House Speaker Richard Corcoran Bid for Governor";
            break;
          case 2:
            cr1.description = "Connection between ultraliberal to opposition";
            cr1.name = "incumbent Republican Sen. Dean Heller ";
            break;
          case 3:
            cr1.description = "Pat Ryan Proposal To Protect Kids";
            cr1.name = "Incumbent Sen Pat Ryan";
            break;
          case 4:
            cr1.description = "Demonstrate his indendance from outside influence";
            cr1.name = "David Trone, a liquor store chain tycoon";
            break;
        }
        await post('campaignrequest', cr2);
    }
}

const product = async () => {
    for (ix = 1; ix <= 8; ++ix) {
        let item =
        {
            "$class": "org.acme.smartdonation.object.Product",
            "entityId": entityId('product', ix),
            "approvalResponse": "OK",
            "approvalStatus": "ACCEPTED",
            "createdOn": "2016-11-11T00:35:41.037Z",
            "description": "This is a factual ad only",
            "excerpt": "string",
            "html": "string",
            "name": "string",
            "note": "It went pretty well.  No surprises.",
            "status": "COMPLETE",
            "submittedForApprovalOn": "2018-11-11T00:35:41.037Z",
            "video": "string",
            "campaign": refModel('campaign', 1),
            "campaignRequest": refModel('campaignrequest', ix),
            "customer": refModel('customer'),
            "donation": refModel('donation', 1),
            "donor": refModel('donor'),
            "supplier": refModel('supplier', ix)
        }
        item = {...item, ...politicalads[ix-1]}
        switch(ix) {
            case 1:
            case 2:
            case 3:
            case 4:
              break;
            case 5:
                item.campaign = refModel('campaign', 2);
                item.donation = refModel('donation', 2);
                item.approvalStatus = "REJECTED";
                item.approvalResponse = "The ad is too negative and a bit racist",
                item.status = "COMPLETE";
                break;
            case 6:
                item.campaign = refModel('campaign', 2);
                item.donation = refModel('donation', 2);
                item.approvalStatus = "REJECTED";
                item.approvalResponse = "The ad is too irrelevant and stretching",
                item.status = "COMPLETE";
                break;
            case 7:
                item.campaign = refModel('campaign', 2);
                item.donation = refModel('donation', 2);
                item.approvalStatus = "ACCEPTED";
                item.approvalResponse = "OK",
                item.status = "COMPLETE";
                break;
            case 8:
                item.campaign = refModel('campaign', 2);
                item.donation = refModel('donation', 2);
                item.approvalStatus = "SUBMIITED";
                item.approvalResponse = " ",
                item.status = "COMPLETE";
                break;
        }
        await post('product', item);
    }
}

const all = async () => {
    !(await doexist('bankaccount')) ? await bankaccount() : null;
    await participant();
    !(await doexist('donation')) ? await donation() : null;
    !(await doexist('campaign')) ? await campaign() : null;
    !(await doexist('campaignrequest')) ? await campaignrequest() : null;
    !(await doexist('product')) ? await product() : null;
}

module.exports = { all }
