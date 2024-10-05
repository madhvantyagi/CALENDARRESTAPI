import soap from "soap";
import dotenv from "dotenv";
import { searchCaregiver } from "./searchCaregiver.js";

dotenv.config();
const { APP_NAME, APP_SECRET, APP_KEY } = process.env;

const url = "https://app2.hhaexchange.com/integration/ent/v1.8/ws.asmx?WSDL";

const SearchVisits = async (Id, month) => {
  const date = new Date(month);
  const year = date.getFullYear();
  const currmonth = date.getMonth(); // 0-based, so January is 0, December is 11

  const CaregiverID = await searchCaregiver(Id);
  const firstDate = new Date(year, currmonth, 1);
  const lastDate = new Date(year, currmonth + 1, 0);
  const firstDateFormatted = firstDate.toISOString().split("T")[0];
  const lastDateFormatted = lastDate.toISOString().split("T")[0];
  console.log(firstDateFormatted, lastDateFormatted);
  // console.log(CaregiverID);
  const args = {
    Authentication: {
      AppName: APP_NAME,
      AppSecret: APP_SECRET,
      AppKey: APP_KEY,
    },
    SearchFilters: {
      StartDate: firstDateFormatted,
      EndDate: lastDateFormatted,
      CaregiverID: CaregiverID,
    },
  };

  const client = await soap.createClientAsync(url);
  try {
    const result = await client.SearchVisitsAsync(args);
    //   console.log(`res: ${JSON.stringify(result[0], null, 2)}`);
    if (result[0].SearchVisitsResult?.Visits?.VisitID == undefined) return [];
    const ActualResult = result[0].SearchVisitsResult?.Visits?.VisitID;
    // console.log(ActualResult);
    return ActualResult;
  } catch (e) {
    console.log("happening in searchvisits");
    console.log(`err: ${e}`);
  }
};

export { SearchVisits };
