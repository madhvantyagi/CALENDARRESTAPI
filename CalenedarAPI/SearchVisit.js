import soap from "soap";
import dotenv from "dotenv";
import { searchCaregiver } from "./searchCaregiver.js";

dotenv.config();
const { APP_NAME, APP_SECRET, APP_KEY } = process.env;

const url = "https://app2.hhaexchange.com/integration/ent/v1.8/ws.asmx?WSDL";

const SearchVisits = async (Id) => {
  const CaregiverID = await searchCaregiver(Id);
  console.log(CaregiverID);
  const args = {
    Authentication: {
      AppName: APP_NAME,
      AppSecret: APP_SECRET,
      AppKey: APP_KEY,
    },
    SearchFilters: {
      StartDate: "2024-09-01",
      EndDate: "2024-09-30",
      CaregiverID: CaregiverID,
    },
  };

  const client = await soap.createClientAsync(url);
  try {
    const result = await client.SearchVisitsAsync(args);
    //   console.log(`res: ${JSON.stringify(result[0], null, 2)}`);
    const ActualResult = result[0].SearchVisitsResult.Visits.VisitID;
    console.log(ActualResult);
    return ActualResult;
  } catch (e) {
    console.log("happening in searchvisits");
    console.log(`err: ${e}`);
  }
};

export { SearchVisits };
