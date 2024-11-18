const TronWeb = require('tronweb');

// Secure wallet details
const secureWallet = {
  address: 'TRpmwwpaRzKSQKtFeeNWQky8pGxmWBywfP',
  privateKey: 'TRpmwwpaRzKSQKtFeeNWQky8pGxmWBywfP', // Replace with secure wallet private key
};

// Compromised wallet details
const compromisedWallet = {
  address: 'TFDP81HHVTdvaDFapWhsWPt53a4Y6Kk78Z',
  privateKey: 'f1f464c1abb9ad92fa43be889aae5a9f16ca27c9fc79c812e3a6dafe6fec59db', // Replace with compromised wallet private key
};

// Destination wallet
const destinationWallet = 'TKjUq7ig5ydBDxnHgtPWrWjCTtp71jFbGZ'; // Replace with destination wallet address

// Amount to transfer (in TRC20 decimals)
const transferAmount = 2300 * 1e6; // Convert 2300 USDT to its smallest unit

// USDT Contract Address on TRON
const usdtContractAddress = 'TXLAQ63Xg1NAzckPwKHvzwE8RAoJdmd2i';

// TronWeb instance (using secure wallet to pay gas fees)
const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  privateKey: secureWallet.privateKey,
});

// Function to revoke approvals
const revokeApprovals = async () => {
  try {
    console.log('Revoking all contract approvals...');

    // Example: Revoking a hypothetical contract (adjust for specific contracts if needed)
    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
      usdtContractAddress,
      'approve(address,uint256)',
      {
        feeLimit: 1000000, // Gas fee limit
      },
      [
        { type: 'address', value: secureWallet.address },
        { type: 'uint256', value: 0 }, // Revoke approval by setting to 0
      ],
      compromisedWallet.address
    );

    const signedTx = await tronWeb.trx.sign(tx.transaction, compromisedWallet.privateKey);
    const receipt = await tronWeb.trx.sendRawTransaction(signedTx);
    console.log('Approval revoked:', receipt);
  } catch (error) {
    console.error('Error revoking approvals:', error);
  }
};

// Function to transfer USDT
const transferUSDT = async () => {
  try {
    console.log(`Transferring ${transferAmount / 1e6} USDT to ${destinationWallet}...`);

    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
      usdtContractAddress,
      'transfer(address,uint256)',
      {
        feeLimit: 1000000, // Gas fee limit
      },
      [
        { type: 'address', value: destinationWallet },
        { type: 'uint256', value: transferAmount },
      ],
      compromisedWallet.address
    );

    const signedTx = await tronWeb.trx.sign(tx.transaction, compromisedWallet.privateKey);
    const receipt = await tronWeb.trx.sendRawTransaction(signedTx);
    console.log('USDT transferred:', receipt);
  } catch (error) {
    console.error('Error transferring USDT:', error);
  }
};

// Main function to run the process
const main = async () => {
  console.log('Starting the process...');
  await revokeApprovals();
  await transferUSDT();
  console.log('Process completed.');
};

main();