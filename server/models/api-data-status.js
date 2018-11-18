const EntityState = [
  {name: 'NOT STARTED', value: 'NOT_STARTED'},
  {name: 'ACTIVE', value: 'ACTIVE'},
  {name: 'CANCELED', value: 'CANCELED'},
  {name: 'SUSPENDED', value: 'SUSPENDED'},
  {name: 'COMPLETE', value: 'COMPLETE'},
  {name: 'COMPLETE FALSE', value: 'COMPLETE_FALSE'},
];

const ApprovalStateDonor = [
  {name: 'ACCEPT IT', value: 'ACCEPTED'},
  {name: 'REJECT IT', value: 'REJECTED'},
];

const EntityStateList = (entities) => (status) =>
  entities.map(et => ({name: et.name, value: et.value, selected: et.value.toLowerCase() === status.toLowerCase() } ));


const EntityStateDdl = status => EntityStateList(EntityState)(status);

const ApprovalStateDonorDdl = status => EntityStateList(ApprovalStateDonor)(status);
 
module.exports = { EntityStateDdl, ApprovalStateDonorDdl }
