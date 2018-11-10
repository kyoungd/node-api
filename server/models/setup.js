const { get, post } = require('./api');

const bankAccountIndex = (model) => {
    switch (model) {
        case "customer": return 0;
        case "donor": return 1;
        case "supplier": return 2;
        case "campaign": return 11;
        case "donation": 15;
    }
}

const suffix = (ix) => (ix >= 10 ? ix.toString() : '0' + ix.toString());
const bankAccountPrefix = '69e2f276-5337-449d-9512-e2ddda42d0';
const bankAccountId = (ix) => bankAccountPrefix + suffix(ix);

const bankaccount = async () => {

    for (i=20; i < 30; ++i) {
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

const participantId = (prefix, ix) => prefix + "-6ee91abf-d094-49e1-9385-d3cbd84b54a9" + (ix ? suffix(ix) : '');
const participant = async () => {
    const c = await get('customer');
    if (!c || c.data.length <= 0) {
        const customerData = 
        {
            "$class": "org.acme.smartdonation.participant.Customer",
            "name": "Red Cross",
            "participantId": participantId('c'),
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
    const d = await get('donor');
    if (!d || d.data.length <= 0) {
        const donorData =
        {
            "$class": "org.acme.smartdonation.participant.Donor",
            "name": "Bill Gates",
            "participantId": participantId('d'),
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
            "customer": `resource:org.acme.smartdonation.participant.Customer#${participantId('c')}`,
            "bankAccount": `resource:org.acme.smartdonation.util.BankAccount#${bankAccountId(bankAccountIndex('donor'))}`,
        }
        await post('donor', donorData);
    }
    const s = await get('supplier');
    if (!s || s.data.length <= 0) {
        for (let ix=1; ix < 10; ++ix) {
            let supplier =
            {
                "$class": "org.acme.smartdonation.participant.Supplier",
                "name": "Bill Gates",
                "participantId": participantId('s', ix),
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
                "customer": `resource:org.acme.smartdonation.participant.Customer#${participantId('c')}`,
                "bankAccount": `resource:org.acme.smartdonation.util.BankAccount#${bankAccountId(bankAccountIndex('supplier') + ix - 1)}`
            }
            await post('supplier', supplier);
        }
    }
}


const all = () => {
    bankaccount();
    participant();
}

module.exports = {bankaccount, participant, all}
