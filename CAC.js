/**
 * Runs a BigQuery query and logs the results in a spreadsheet.
 */
function runQuery() {
  // Replace this value with the project ID listed in the Google
  // Cloud Platform project.
  var projectId = '878093975246';

  var request = {
    query: "SELECT B.campaignId, B.adsetId,B.creativeId, B.randomuserid, A.installDate, FORMAT_DATETIME('%F %T', DATETIME(B.dateTime, 'America/Los_Angeles')) AS PurchaseDate FROM `vid-ai.first_party_data.events` B JOIN (SELECT randomuserid, FORMAT_DATETIME('%F %T', DATETIME(dateTime, 'America/Los_Angeles')) AS installDate FROM `vid-ai.first_party_data.events` WHERE tyrooAttributionPartnerId = '15' AND DATE(dateTime, 'America/Los_Angeles') BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY) AND DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY) AND adsetId is not null AND pkgName in ('com.namshi.android','id840127349','840127349') AND actionkey = 'install') A ON A.randomuserid = B.randomuserid WHERE tyrooAttributionPartnerId = '15' AND DATE(dateTime, 'America/Los_Angeles') BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY) AND DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY) AND adsetId is not null AND pkgName in ( 'com.namshi.android','id840127349','840127349') AND actionkey = 'sale';",useLegacySql:false
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
    var spreadsheet = SpreadsheetApp.openById('1yr9NS2s6_ZeKCRs7qUdR0xx1UM4OKzFRiPdrlLeGq4Y');
    var sheet = spreadsheet.getSheetByName('Data')

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

function Spend() {
  // Replace this value with the project ID listed in the Google
  // Cloud Platform project.
  var projectId = '878093975246';

  var request = {
    query: "SELECT mp_campaign_id,mp_adset_id,mp_ad_id, date(timezone_date) as Date, ROUND(SUM(spend),0) Spend FROM `vid-ai.snapchat.hourly_stats_aggregated` WHERE date(timezone_date) BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY) AND DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY) AND tyroo_account_id = 2195 GROUP BY 1,2,3,4 ORDER BY 1 ASC;",useLegacySql:false
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
    var spreadsheet = SpreadsheetApp.openById('1yr9NS2s6_ZeKCRs7qUdR0xx1UM4OKzFRiPdrlLeGq4Y');
    var sheet = spreadsheet.getSheetByName('Spend')

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