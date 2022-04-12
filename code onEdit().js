
///////////////////////////////////////////////////////////////////////
 //
//function update(e) {
//  var activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//  var tabs = ['RAW'];
//  
//  if(tabs.indexOf(activeSheet.getName()) !== -1){
//    var cell = activeSheet.getRange("K2:L2");
//    var col = cell.getColumn();
//    if(cell.getFormula() !== ""){
//      var destination = activeSheet.getRange(2, col , activeSheet.getLastRow()-1,1);
//      cell.copyTo(destination);
//    }
//  
//  }
//}