function onEdit(e) {
    var activeSheet = e.source.getActiveSheet();
    var range = e.range;
    if (activeSheet.getName() !== "Inventory" || e.value !== "notify") return;
    range.setBackgroundColor('red');
    var productname = range.offset(0, -3).getValue();
    var productinventory = range.offset(0, -2).getValue();
    var message = "Product variant " + productname + " has dropped to " + productinventory;
    var subject = "Low Stock Notification";
    var emailAddress = "email@email.com";
    MailApp.sendEmail(emailAddress, subject, message);
    range.offset(0, 1).setValue("notified");
}


    
    var sh, sheets, cols, ind, stampCell;
        sh = e.source.getActiveSheet();
        sheets = ["Sheet1"]; //change with the actual sheet names
        sheetsInd = sheets.indexOf(sh.getName())
        cols = [4, 3],
        ind = cols.indexOf(e.range.columnStart);
    
    if (sheetsInd == -1 || ind == -1 || e.range.rowStart < 11) return;
    
    stampCell = e.range.offset(0, -1)
   
    if (ind == 0 && !stampCell.getValue()) {
           stampCell.setValue(Session.getActiveUser())
    
    } else if (ind == 1) {
        SpreadsheetApp.getUi()
            .alert('You are not allowed to edit this cell')
        e.range.setValue(e.oldValue ? e.oldValue : null)
    }