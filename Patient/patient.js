import smartsheet from "smartsheet";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.MAIN_API;
console.log(API_KEY);
const client = smartsheet.createClient({
  accessToken: API_KEY,
});

const sheetId = 2377134421004164;
const caregiverCodeColumnId = 6962932047892356;
const statusColumnId = 1333432513679236;
// change this caregiver code

const searchContracts = async (careGiver) => {
  try {
    const codeValueToMatch = careGiver;
    const sheet = await client.sheets.getSheet({ id: sheetId });

    const matchingRows = sheet.rows.filter((row) => {
      const caregiverCodeCell = row.cells.find(
        (cell) => cell.columnId === caregiverCodeColumnId
      );
      const statusCell = row.cells.find(
        (cell) => cell.columnId === statusColumnId
      );
      return (
        caregiverCodeCell &&
        caregiverCodeCell.value === codeValueToMatch &&
        (statusCell.value === "Active" ||
          statusCell.value.startsWith("Fill In"))
      );
    });

    return matchingRows;
  } catch (e) {
    console.log(e);
  }
};

const ArrangeData = async (careGiver) => {
  const temparr = [];
  let final;
  try {
    final = await searchContracts(careGiver);
  } catch (e) {
    final = [];
  }

  if (final.length !== 0) {
    for (var i in final) {
      //   console.log(final[i].cells);

      let arr = [];
      for (var k in final[i].cells) {
        // console.log(final[i].cells[k]);
        if (
          final[i].cells[k].columnId === 3672148641009540 ||
          final[i].cells[k].columnId === 5923948454694788 ||
          final[i].cells[k].columnId === 3585232327364484 ||
          final[i].cells[k].columnId === 3486701950291844 ||
          final[i].cells[k].columnId === 8088831954734980
        ) {
          if (final[i].cells[k]?.displayValue)
            arr.push(final[i].cells[k].displayValue);
        }
      }
      const obj = {
        name: arr[0] || "N/A",
        payRate: arr[1] || "N/A",
        hoursPerWeek: arr[2] || "N/A",
        contractLink: arr[3] || "N/A",
        currentCareLink: arr[4] || "N/A",
      };

      temparr.push(obj);
      arr = [];
    }
  } else {
    temparr = [];
  }
  return temparr;
};

export { ArrangeData };
