var settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('settings');
var CHANNEL_ACCESS_TOKEN = settingsSheet.getRange(1, 1).getValue();
var KEYWORD = settingsSheet.getRange(2, 1).getValue();

function doPost(e) {
  var event = JSON.parse(e.postData.contents).events[0];

  if (event.type === 'message' && event.message.text.indexOf(KEYWORD) !== -1) {
    var message = createRandomPostMessage();
    var response = UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
      },
      'method' : 'post',
      'payload' : JSON.stringify({
        'replyToken' : event.replyToken,
        'messages' : [
          {
            'type' : 'text',
            'text' : message
          }
        ]
      }),
    });
    return response.getResponseCode();
  }
}

function createRandomPostMessage() {
  var keywordsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('keywords');
  var lastRow = keywordsSheet.getLastRow();

  var row = Math.ceil(Math.random() * lastRow);
  var range = keywordsSheet.getRange(row, 2);
  var count = range.isBlank() ? 0 : range.getValue();  
  keywordsSheet.getRange(row, 2).setValue(count + 1);
  
  return keywordsSheet.getRange(row, 1).getValue();
}
