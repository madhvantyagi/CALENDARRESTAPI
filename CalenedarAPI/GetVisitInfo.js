import { SearchVisits } from "./SearchVisit.js";

import soap from "soap";
import dotenv from "dotenv";

dotenv.config();
const { APP_NAME, APP_SECRET, APP_KEY } = process.env;

const url = "https://app2.hhaexchange.com/integration/ent/v1.8/ws.asmx?WSDL";

const GetVisitInfo = async () => {
  const VisitIDArray = await SearchVisits();
  VisitIDArray.forEach(async (visit) => {
    const args = {
      Authentication: {
        AppName: APP_NAME,
        AppSecret: APP_SECRET,
        AppKey: APP_KEY,
      },
      VisitInfo: {
        ID: visit,
      },
    };

    const client = await soap.createClientAsync(url);
    try {
      const result = await client.GetVisitInfoV2Async(args);
      console.log(`res: ${JSON.stringify(result[0], null, 2)}`);
    } catch (e) {
      console.log(`err: ${e}`);
    }
  });
};

await GetVisitInfo();
