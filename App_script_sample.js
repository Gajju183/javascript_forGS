/**
 * Runs a BigQuery query and logs the results in a spreadsheet.
 */
function runQuery() {
  // Replace this value with the project ID listed in the Google
  // Cloud Platform project.
  var projectId = '878093975246';

  var request = {
    query: "SELECT date(date_time) as Date, SUM(impressions) Impressions, ROUND(SUM(spend),0) Spend, SUM(swipes) Swipes, SUM(total_installs) Installs FROM `vid-ai.snapchat.hourly_stats` WHERE date(date_time) BETWEEN '2020-02-01' AND '2020-02-05' AND tyroo_account_id = 2179 GROUP BY 1;",useLegacySql:false
  };
  var queryResults = BigQuery.Jobs.query(request, projectId);
  var jobId = queryResults.jobReference.jobId;

  // Check on status of the Query Job.
  var sleepTimeMs = 500;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId);
  }

  // Get all the rows of results.
  var rows = queryResults.rows;
  while (queryResults.pageToken) {
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId, {
      pageToken: queryResults.pageToken
    });
    rows = rows.concat(queryResults.rows);
  }

  if (rows) {
    var spreadsheet = SpreadsheetApp.openById('1Vs3XRqKBU0oVoOxj31yY3w_cBJoFBkTt2QRrIpGfMZI');
    var sheet = spreadsheet.getSheetByName('abc')

    // Append the headers.
    var headers = queryResults.schema.fields.map(function(field) {
      return field.name;
    });
//    sheet.appendRow(headers);

    // Append the results.
    var data = new Array(rows.length);
    for (var i = 0; i < rows.length; i++) {
      var cols = rows[i].f;
      data[i] = new Array(cols.length);
      for (var j = 0; j < cols.length; j++) {
        data[i][j] = cols[j].v;
      }
    }
//    sheet.appendRow(data)
    sheet.getRange(sheet.getLastRow()+1, 1, rows.length, headers.length).setValues(data);

    Logger.log('Results spreadsheet created: %s',
        spreadsheet.getUrl());
  } else {
    Logger.log('No rows returned.');
  }
}