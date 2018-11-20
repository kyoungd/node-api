const { ObjectId } = require('mongodb');
const expect = require('chai').expect;
const request = require('supertest');

const { app } = require('../server/index');
const { entityId, entityPrefix } = require('../server/models/setup-helper');
const { get, remove } = require('../server/models/api');
const { getDashboardDonorPost } = require('../server/models/api-data');
const { ApiCampaignList } = require('../server/models/api-customer-campaign');
const { ApiCustomerCampaignRequest, ListSupplier } = require('../server/models/api-customer-campaignrequest');
const { ApiCampaignSupplier } = require('../server/models/api-customer-supplier');
const { ApiCampaignDonation } = require('../server/models/api-customer-donation');
const { ApiDonationList } = require('../server/models/api-donor-donation');
const { ApiSupplierRfpList } = require('../server/models/api-supplier-rfp');
const { EntityStateDdl, ApprovalStateDonorDdl } = require('../server/models/api-data-status');
const { SetBlockchain, RunOpCode } = require('../server/models/api-post');
const { ApiDonorPostList } = require('../server/models/api-donor-postlist');

const _ = require('lodash');

describe('Test basic functions', ()=> {

  it('test object', (done)=> {
    var o1 = { food: 'pizza', car: 'ford', rules: ['low maintenance', 'high mileage', 'nice exterier'], engine: {size: '4 cylinder', fan: 'electric'} };
    var o2 = { owner: 'james', car: 'toyota', rules: ['no maintenance', 'self driving'], engine: { size: 'no cylinder', fan: 'none'}};
    var test = {...o1, ...o2};
    console.log(test);
    done();
  })

  it('bank post test', async()=> {
    const model = 'bankaccount'
    const data1 = {
      "entityId": "new",
      "accountNumber": "10000-00000000-03",
      "routingNumber": "20000-00000000-03",
    }
    const item1 = await SetBlockchain(model, data1);
    expect(item1.data.entityId).to.not.equal('new');
    expect(item1.data.status).to.equal('ACTIVE');
    expect(item1.data.accountNumber).to.equal('10000-00000000-03');
  });

  it('bank put test', async()=> {
    const model = 'bankaccount'
    const data1 = {
      "entityId": "BANKACCOUNT03",
      "accountNumber": "10000-00000000-03",
      "routingNumber": "20000-00000000-03",
      "status": "ACTIVE",
      "note": "test"
    }
    const item1 = await SetBlockchain(model, data1);
    expect(item1.data.status).to.equal('ACTIVE');
    expect(item1.data.accountNumber).to.equal('10000-00000000-03');
    const data2 = {
      "entityId": "BANKACCOUNT01",
      "accountNumber": "10000-00000000-0X",
      "routingNumber": "20000-00000000-0X",
      "note": "test",
      "status": "COMPLETE"
    }
    const item2 = await SetBlockchain(model, data2);
    expect(item2.data.status).to.equal('COMPLETE');
    expect(item2.data.accountNumber).to.equal('10000-00000000-0X');
  })

  it('donation new test', async() => {
    const model = 'donation';
    const donor = entityId('donor', 1);
    const customer = entityId('customer', 1);
    const bankAccount = 'BANKACCOUNT01';
    await remove('donation', 'DONATION-TEST-ID-04')
    const data1 = {
      "id": "DONATION-TEST-ID-04",
      "entityId": "DONATION-TEST-ID-04",
      "title": "Just the facts, Maam",
      "name": "Arthur Dent",
      "description": "Proposing to restore the state’s commitment to fund two-thirds of public school costs, matching a plan by his Democratic opponent, State Superintendent Tony Evers.",
      "rules": [
        "Universe is big.  Really really big.",
        "focus on the candidate",
        "candidates accomplishments"
      ],
      "amount": 5000000,
      "status": "ACTIVE",
      "total": 4,
      "accepted": 4,
      "rejected": 0,
      "waiting": 0,
      "slug": "/root",
      "editslug": "",
      "clickslug": "/root-sublevel?DONATION-TEST-ID-04",
      bankAccount,
      customer,
      donor
    }
    let item1 = await SetBlockchain(model, data1);
    expect(item1.data.status).to.equal('ACTIVE');
    expect(item1.data.amount).to.equal(5000000);
    let data2 = _.cloneDeep(item1.data);
    data2.status = 'COMPLETE';
    data2.amount = 2000000;
    let item2 = await SetBlockchain(model, data2);
    expect(item2.data.status).to.equal('COMPLETE');
    expect(item2.data.amount).to.equal(2000000);
  })

  it('product update.  Will update approvalStatus and ApprovalResponse.', async()=> {
    const model = 'product';
    const data = {
      "entityId": entityId('product', 1),
      "approvalResponse": "FANTASTIC",
      "approvalStatus": "ACCEPTED",
    }
    let item = await SetBlockchain(model, data);
    expect(item.data.approvalResponse).to.equal('FANTASTIC');
    expect(item.data.approvalStatus).to.equal('ACCEPTED');
  })
  
  it('should return donation list', async ()=> {
    const result = await ApiDonationList(entityId('customer'), entityId('donor'));
    console.log(result);
  })

  it('should return a donation-product list ', async() => {
    const donationId = entityId('donation', 1);
    const result = await ApiDonorPostList(donationId);
    console.log(result);
  })

  it('api post update test', async() => {
    const entityId = "p-6ee91abf-d094-49e1-9385-d3cbd84b54a901";
    const newStatus = 'REJECTED';
    const data = {entityId, approvalStatus: newStatus, approvalResponse: "yes"};
    const result = await SetBlockchain('product', data);
    expect(result.data.approvalStatus).to.equal(newStatus);
    expect(result.data.approvalResponse).to.equal('yes');
    console.log(result);
  })

  it('live donation data test', async() => {
    const data = {
      "id": "new",
      "title": "Arthur D Dent",
      "description": "test.",
      "rules": [
        "one",
        " two",
        " three",
      ],
      "amount": "1000000",
      "expireOn": "2018-11-29",
      "availbleOn": "",
      "status": "NOT_STARTED",
      "total": "",
      "accepted": "",
      "rejected": "",
      "waiting": "",
      "slug": "",
      "editslug": "",
      "clickslug": "",
      "customer": "c-6ee91abf-d094-49e1-9385-d3cbd84b54a9",
      "donor": "d-6ee91abf-d094-49e1-9385-d3cbd84b54a9",
      "availableOn": "2018-11-05",
      "account": "1111111-1111-111111",
      "routing": "111111-111111",
      "expirationOn": "2018-11-29",
      "name": "Arthur D Dent",
      "entityId": "new",
      "bankAccount": "77b65c80-ec32-11e8-b0a0-89e2b908152d"
    }
    //changed availableOn.
    const result = await SetBlockchain('donation', data);
    expect(result.data.status).to.equal('NOT_STARTED');
    expect(result.data.amount).to.equal(1000000);
    console.log(result);
  })
  
  it('live campaign data test', async() => {
    const donation = await get('donation', 't-6ee91abf-d094-49e1-9385-d3cbd84b54a902');
    const data = {
      "id": "new",
      "title": "42 Campaign",
      "description": "take a look",
      "rules": "",
      "amount": "1000000",
      "expireOn": "2020-11-30",
      "availbleOn": "",
      "status": "NOT_STARTED",
      "total": "",
      "accepted": "",
      "rejected": "",
      "waiting": "",
      "slug": "",
      "editslug": "",
      "clickslug": "",
      "donation": "t-6ee91abf-d094-49e1-9385-d3cbd84b54a902",
      "customer": "c-6ee91abf-d094-49e1-9385-d3cbd84b54a9",
      "availableOn": "2018-11-19",
      "account": "1111111-1111-111111",
      "routing": "111111-111111",
      "name": "42 Campaign",
      "entityId": "new",
      "bankAccount": "74636e10-ec8c-11e8-b8e6-3dd63cd21a65",
      "donor": donation.status === 200 ? donation.data.donor : '',
    }    
    const result = await SetBlockchain('campaign', data);
    expect(result.data.status).to.equal('NOT_STARTED');
    expect(result.data.amount).to.equal(1000000);
    console.log(result);
  })

  it ('live campiagn new data test', async() => {
    const data = {
      "id": "new",
      "title": "44 rules",
      "description": "is this the best that the God can do?",
      "rules": "",
      "amount": "1000000",
      "expireOn": "2018-11-30",
      "availbleOn": "",
      "status": "NOT_STARTED",
      "total": "",
      "accepted": "",
      "rejected": "",
      "waiting": "",
      "slug": "",
      "editslug": "",
      "clickslug": "",
      "donation": "t-6ee91abf-d094-49e1-9385-d3cbd84b54a901",
      "customer": "c-6ee91abf-d094-49e1-9385-d3cbd84b54a9",
      "availableOn": "2018-11-01",
      "account": "1111111-1111-111111",
      "routing": "111111-111111",
      "name": "44 rules",
      "entityId": "new",
      "bankAccount": "12e530a0-eca1-11e8-baf7-9d7d3bad26e2",
      "donor": "resource:org.acme.smartdonation.participant.Donor#d-6ee91abf-d094-49e1-9385-d3cbd84b54a9"
    }
    const result = await SetBlockchain('campaign', data);
    expect(result.data.status).to.equal('NOT_STARTED');
    expect(result.data.amount).to.equal(1000000);
    console.log(result);
  });

  it.only ('check campaignrequest new data test', async() => {
    const campaignId = entityId('campaign', 1);
    const result = await ApiCustomerCampaignRequest(campaignId);
    const supplier = ListSupplier(result.data, result.allSupplier, result.data[1]);
    expect(supplier[0].checked).to.equal(true);
    expect(supplier[1].selected).to.equal(true);
  })
})

describe.skip('Test donations', ()=> {

  it('should return a product for approval', async () => {
    const productId = entityId('product', 2);
    const result = await get('product', productId);
    const dashboard = getDashboardDonorPost(result);
    expect(dashboard.status).to.equal('ACCEPTED');
    expect(dashboard.id).to.equal(productId);
    console.log(dashboard);
  })

  it('should return a campaign root for review', async()=> {
    const result = await ApiCampaignList();
    console.log(result);
  })

  it('should return a campaign-root-donation for review', async()=> {
    const result = await ApiCampaignDonation();
    console.log(JSON.stringify(result, null, 4));
  })

  it('should return a campaign request list campaign-1', async()=> {
    const campaignId = entityId('campaign', 1);
    const result = await ApiCustomerCampaignRequest(campaignId);
//    console.log(JSON.stringify(result, null, 4));
  })

  it('should return a campaign request list campaign-2', async()=> {
    const campaignId = entityId('campaign', 2);
    const result = await ApiCustomerCampaignRequest(campaignId);
//    console.log(JSON.stringify(result, null, 4));
  })

  it('should test object expansion with campaign-1 ', async() => {

    const campaignId = entityId('campaign', 2);
    const result = await ApiCustomerCampaignRequest(campaignId);

    const item = {...result.data[0], title: 'hello there'};
    console.log(item.title);
  })

  it('should return a new campaign supplier list for campaign', async()=> {
    const result = await ApiCampaignSupplier();
    expect(result[0].checked).to.equal(true);
  })

  it('should return a campaign supplier list for campaign', async()=> {
    const campaignId = entityId('campaign', 1);
    const result = await ApiCampaignSupplier(campaignId);
    expect(result[0].checked).to.equal(false);
  });

  it('should get supplier rfps', async()=> {
    const supplierId = entityId('supplier', 3);
    const result = await ApiSupplierRfpList(supplierId);
    console.log(result);
  });

  it('test approval Status', done => {
    const approval1 = ApprovalStateDonorDdl('ACCEPTED');
    expect(approval1[0].selected).to.equal(true);
    const approval2 = ApprovalStateDonorDdl('REJECTED');
    expect(approval2[1].selected).to.equal(true);
    const approval3 = ApprovalStateDonorDdl('');
    expect(approval3[0].selected).to.equal(false);
    expect(approval3[1].selected).to.equal(false);
    const state1 = EntityStateDdl('NOT_STARTED');
    expect(state1[0].selected).to.equal(true);
    const state2 = EntityStateDdl('ACTIVE');
    expect(state2[1].selected).to.equal(true);
    done();
  });

/* ----

  it('should not create a new todo with invalid POST', (done)=>{
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      // .end(done);
      .end((err, res) => {
        if (err)
          return done(err);
        Todo.find().then((todos)=> {
          expect(todos).to.have.lengthOf(2);
          done();
        })
        .catch((err) => done(err));
      });
  });

  it('should get all todos', (done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo).to.have.lengthOf(2)
      })
      .end(done);
  });

  describe('GET /todos/:id tests', () => {
    it('should return a valid todo with an id', (done)=> {
      // console.log('>>>>>>>>>>>> ', JSON.stringify(todos, undefined, 2));
      let id = todos[0]._id;
      request(app)
        .get(`/todos/${id}`)
        .expect(200)
        .expect((res)=>{
          // console.log(' ');
          // console.log('>>>>>>>>>>>> ', JSON.stringify(res.body, undefined, 2));
          // console.log(' ');
          expect(res.body.text.text).to.equal(todos[0].text);
        })
        .end(done);
    });

    it('should return a 404 with an wrong id', (done)=> {
      let id = '49c18925e18e500c50bb8d38';
      request(app)
        .get(`/todos/${id}`)
        .expect(404)
        .end(done);
      });


    it('should return a 404 with an invalid id', (done)=> {
      let id = '49c18925e18e500c50bb8d38aaa';
      request(app)
        .get(`/todos/${id}`)
        .expect(404)
        .end(done);
      });
  })

  describe('DELETE /todos/:id', ()=> {
    it('should delete a valid todo with an id', (done)=> {
      let id = todos[0]._id;
      request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res)=> {
          // console.log(' ');
          // console.log('>>>>>>>>>>>> ', JSON.stringify(res.body, undefined, 2));
          // console.log(' ');
          expect(res.body.data.text).to.equal(todos[0].text);
          expect(res.body.data._id).to.equal(id.toHexString());
        })
        .end((err, res)=> {
          expect(err).to.be.null;
          Todo.findById(id)
            .then((todo)=>{
              expect(todo).to.be.null;
              done();
            })
            .catch((err)=> {
              done(err);
            })
        });
    });
    it('should return a 404 with a wrong id', (done)=> {
      let id = '49c18925e18e500c50bb8d38aaa';
      request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
    });
    it('should return a 404 with an invalid id', (done)=> {
      let id = '49c18925e18e500c50bb8d38aaa';
      request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
    });
  });

  describe('PATCH /todos/:id', ()=> {
    var id = todos[0]._id.toHexString();
    var text = 'This should be the new text';

    it('should update a valid todo with an id to completed', (done)=> {
      request(app)
        .patch(`/todos/${id}`)
        .send({completed: true, text})
        .expect(200)
        .expect((res)=> {
          expect(res.body.data.completed).to.equal(true);
          expect(res.body.data.text).to.equal(text);
        })
        // .end(done);
        .end((err, res) => {
          if (err)
            done(err);
          Todo.findById(id)
            .then((result) => {
              expect(result.completed).to.equal(true);
              expect(result.text).to.equal(text);
              done();
            })
            .catch((err) => {
              done(err);
            })
        });
    })

    it('should update the completed of a valid todo with an id', (done)=> {
      var completed = false;
      request(app)
        .patch(`/todos/${id}`)
        .send({ completed })
        .expect(200)
        .expect((res)=>{
          expect(res.body.data.completed).to.equal(completed);
        })
        .end((err, res) => {
          if (err)
            done(err);
          Todo.findById(id)
            .then((item) => {
              expect(item.completed).to.equal(completed);
              done();
            })
            .catch((err) => {
              done(err);
            })
        })
    })

  });

---------------------------------- */

});
