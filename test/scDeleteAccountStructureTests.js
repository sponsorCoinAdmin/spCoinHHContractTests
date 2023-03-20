const { expect } = require("chai");

const {
  addTestNetworkPatreonSponsors,
  addTestNetworkSponsorAgents,
  addTestNetworkAccount,
  getTestHHAccountListKeys,
} = require("./testMethods/scTestMethods");
const { testHHAccounts } = require("./testMethods/hhTestAccounts");

const { setCreateContract } = require("./prod/lib/scAccountMethods");
const { setDeleteContract } = require("./prod/lib/scAccountDeleteMethods");

const {
  AccountStruct,
  SponsorStruct,
  AgentStruct,
  RateHeaderStruct,
  TransactionStruct,
} = require("./prod/lib/dataTypes");

const {
  addTestNetworkAccounts,
  deleteTestNetworkAccount,
} = require("./testMethods/scTestMethods");

const {
  LOG_MODE,
  logJSON,
  logSetup,
  setLogDefaults,
  setIndentPrefixLevel,
  setLogMode,
  logTestHeader,
  logFunctionHeader,
  logDetail,
  log,
} = require("./prod/lib/utils/logging");

const { 
  deployContract, 
  loadSpCoinContract 
} = require("./prod/deployContract");

let spCoinContractDeployed;

logSetup("JS => Setup Test");

/**/

describe("spCoinContract", function () {
  beforeEach(async () => {
    spCoinContractDeployed = await loadSpCoinContract();
  });

/**/

    it("SUCCESSFUL EXECUTION: 'SUCCESSFULLY DELETED ACCOUNT'", async function () {
      await addTestNetworkAccounts([0, 1, 2]);
      let keys = await getAccountKeys();
      console.log("============================================================");
      console.log("*** DELETE SECOND ACCOUNT EXAMPLE ***");
      console.log("*** ACCOUNT KEYS BEFORE DELETE ***\n", keys);
      console.log("============================================================");
      console.log("*** ACCOUNT STRUCTURE BEFORE DELETE ***");
      await logJSONTree();
  
      let expectedErrMsg = "VM Exception while processing transaction: reverted with reason string 'Patreon Account has a Sponsor, (Patreon must Un-sponsor Sponsored Account)'";
      try {
        await deleteTestNetworkAccount(1);
      }
      catch (err) {
        expect(err.message).to.equal(expectedErrMsg);
      }

      keys = await getAccountKeys();
      console.log("============================================================");
      console.log("*** ACCOUNTS KEYS AFTER DELETE ***\n", keys);
      console.log("============================================================");
      console.log("*** ACCOUNT STRUCTURE AFTER DELETE ***");
      await logJSONTree();

      console.log("============================================================");
    });

  /**/

  it("SUCCESSFUL ERROR MSG CAUGHT: 'ACCOUNT DOES NOT EXIST'", async function () {
    await addTestNetworkPatreonSponsors(0, [1]);
    let expectedErrMsg = "VM Exception while processing transaction: reverted with reason string 'Account does not exists'";
    try {
      await deleteTestNetworkAccount(2);
      throw new Error("Trace point 0. Should have thrown expected error:\n" + expectedErrMsg);
    }
    catch (err) {
      expect(err.message).to.equal(expectedErrMsg);
    }
  });

  /**/

  it("SUCCESSFUL ERROR MSG CAUGHT: 'PATREON ACCOUNT HAS SPONSOR'", async function () {
    await addTestNetworkPatreonSponsors(0, [1]);
    let expectedErrMsg = "VM Exception while processing transaction: reverted with reason string 'Patreon Account has a Sponsor, (Patreon must Un-sponsor Sponsored Account)'";
    try {
      await deleteTestNetworkAccount(0);
      throw new Error("Trace point 0. Should have thrown expected error:\n" + expectedErrMsg);
    }
    catch (err) {
      expect(err.message).to.equal(expectedErrMsg);
    }
  });

/**/

    it("SUCCESSFUL ERROR MSG CAUGHT: 'SPONSOR ACCOUNT HAS PATREON'", async function () {
      await addTestNetworkPatreonSponsors(0, [1]);
      let expectedErrMsg = "VM Exception while processing transaction: reverted with reason string 'Sponsor Account has a Patreon, (Patreon must Un-sponsor Sponsored Account)'";
      try {
        await deleteTestNetworkAccount(1);
        throw new Error("Trace point 0. Should have thrown expected error:\n" + expectedErrMsg);
      }
      catch (err) {
        expect(err.message).to.equal(expectedErrMsg);
      }
    });
  
  /**/

  it("SUCCESSFUL ERROR MSG CAUGHT: 'AGENT ACCOUNT HAS PARENT SPONSOR'", async function () {
    await addTestNetworkSponsorAgents(1, 2, [3]);

    let expectedErrMsg = "VM Exception while processing transaction: reverted with reason string 'Agent Account has a Parent Sponsor, (Patreon must Un-sponsor Sponsored Account)'";
    try {
      await deleteTestNetworkAccount(3);
      throw new Error("Trace point 0. Should have thrown expected error:\n" + expectedErrMsg);
    }
    catch (err) {
      expect(err.message).to.equal(expectedErrMsg);
    }
  });
  /**/

  it("VALIDATE THAT ACCOUNTS, PATRIOT/SPONSOR/AGENT, ARE ALL MUTUALLY EXCLUSIVE", async function () {
    setLogMode(LOG_MODE.LOG, true);

    // Test Successful Record Insertion of Account Records 
    // Validate Account Size is zero
    let accountListSize = (await getAccountListSize()).toNumber();
    expect(accountListSize).to.equal(0);

    // Add 1 Record Validate Size is 1
    await addTestNetworkAccount(0);
    accountListSize = (await getAccountListSize()).toNumber();
    expect(accountListSize).to.equal(1);

    // Add duplicate Record Validate Size is still 1
    await addTestNetworkAccount(0);
    accountListSize = (await getAccountListSize()).toNumber();

    // delete Record Validate Size should reduce to 1
    await deleteTestNetworkAccount(0);
    accountListSize = (await getAccountListSize()).toNumber();
    expect(accountListSize).to.equal(0);

    // Add additional Record Validate Size is 2
    await addTestNetworkAccount(0);
    await addTestNetworkAccount(1);
    accountListSize = (await getAccountListSize()).toNumber();
    expect(accountListSize).to.equal(2);

    // Add 5 additional Records Validate Size is now 7
    await addTestNetworkAccounts([4,6,9,10,8]);
    accountListSize = (await getAccountListSize()).toNumber();
    expect(accountListSize).to.equal(7);

    // Add 4 Records Validate Size is now 3
    await deleteTestNetworkAccounts([10,8,4,0]);
    accountListSize = (await getAccountListSize()).toNumber();
    expect(accountListSize).to.equal(3);

    accountArr = await loadSPCoinStructures(spCoinContractDeployed);
    logJSON(accountArr);
  });

});
