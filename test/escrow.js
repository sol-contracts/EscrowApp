const Escrow = artifacts.require('Escrow');

// will a function call result in an error inside the smart contract
const assertError = async (promise, error) => {
    try {
        await promise;
    } catch(e) {
        assertError(e.message.includes(error))
        return;
    }
    assert(false);
}

contract('Escrow', () => {
    let escrow = null;
    const [lawyer, payer, recipient] = accounts;
    before(async () => {
        escrow = await Escrow.deployed();
    })
    it('Should deposit', async () => {
        await escrow.deposit({ from: payer, value: 900 })
        // check balance of ether in smart contract is equal to 900 wei
        const escrowBalance = parseInt(await web3.eth.getBalance(escrow.address));
        assert(escrowBalance === 900)
    });
    it('Should NOT deposit if the sender is not the payer', async () => {
        assertError(
            escrow.deposit({ from: accounts[5], value: 100 }),
            'Sender must be the payer'
        )
    });
    it('Should NOT deposit if transfer exceed amount', async () => {
        assertError(
            // Value has to be more than the amount declared in the escrow migration file
            escrow.deposit({ from: payer, value: 2000 }),
            'Cant send more than escrow amount'

        )
    });
})