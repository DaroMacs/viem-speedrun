import dotenv from "dotenv";
import { Hex, createPublicClient, formatEther, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";

dotenv.config();
const privateKey = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(privateKey as Hex);

console.log(account.address);

(async () => {
  const client = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(process.env.API_URL),
  });

  const balance = await client.getBalance({
    address: account.address,
  });

  console.log(formatEther(balance));
  console.log(balance);

  const nonce = await client.getTransactionCount({
    address: account.address,
  });

  console.log(nonce);
})();
