import { processBulkData } from "./b2bController.js";

document.querySelector("#bulkUploadBtn").addEventListener('click',uploadBulkFile);

var opJson = [];

function uploadBulkFile()
{
    console.log("Bulk call");
   const uploadedFile =  document.querySelector("#bulkFile").files;
   console.log(uploadedFile[0]);
   excelFileToJSON(uploadedFile[0]);
}

function excelFileToJSON(file) {
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });

          // Get the first sheet
          const sheet = workbook.Sheets[workbook.SheetNames[0]];

          // Convert sheet to JSON
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          // Output the JSON data
          console.log(jsonData);
          opJson = processBulkData(jsonData);
          document.getElementById('bulkOpBtn').disabled = false;
          console.log(opJson);
         
        };
        reader.readAsBinaryString(file);
      }
}

document.querySelector("#bulkOpBtn").addEventListener('click',downloadBulkExcel);

export function downloadBulkExcel() {
    // const jsonData = [
    //   { "name": "John", "age": 30, "city": "New York" },
    //   { "name": "Jane", "age": 25, "city": "Los Angeles" }
    // ];

    // Convert JSON to a worksheet
    const ws = XLSX.utils.json_to_sheet(opJson);

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate and download the Excel file
    XLSX.writeFile(wb, "output.xlsx");
  }
   

