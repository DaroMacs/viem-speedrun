import {
  Hex,
  createWalletClient,
  getContract,
  http,
  publicActions,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import funJson from "../artifacts/Fun.json";

import dotenv from "dotenv";

const { abi, bin } = funJson["contracts"]["contracts/Fun.sol:Fun"];

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(privateKey as Hex);

(async () => {
  const client = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.API_URL),
  }).extend(publicActions);

  const hash = await client.deployContract({
    abi,
    bytecode: `0x${bin}`,
    args: [127n],
  });

  const { contractAddress } = await client.waitForTransactionReceipt({ hash });

  if (contractAddress) {
    const contract = getContract({
      address: contractAddress,
      abi,
      client,
    });

    console.log(await contract.read.x());
    const hash2 = await contract.write.changeX([132n]);
    await client.waitForTransactionReceipt({ hash: hash2 });
    console.log(await contract.read.x());

    console.log({ contractAddress });
  }
})();
