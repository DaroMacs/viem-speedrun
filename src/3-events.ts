import { Hex, createWalletClient, getContract, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import funJson from "../artifacts/Fun.json";

import dotenv from "dotenv";

const { abi, bin } = funJson["contracts"]["contracts/Fun.sol:Fun"];

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(privateKey as Hex);
const contractAddress = "0x74d03a691b50478af3d13a13ce7f49bba251dd24";

(async () => {
  const client = await createWalletClient({
    account,
    transport: http(process.env.API_URL),
    chain: sepolia,
  });

  const contract = await getContract({
    address: contractAddress,
    abi,
    client,
  });

  await contract.watchEvent.XWasChanged({
    onLogs: (logs) => console.log(logs),
  });

  let x = 55n;
  setInterval(async () => {
    await contract.write.changeX([x]);
    x++;
  }, 3000);
})();
