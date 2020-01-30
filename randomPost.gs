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

  // 候補１を取得
  var row1 = Math.ceil(Math.random() * lastRow);
  var range1 = keywordsSheet.getRange(row1, 2);
  var count1 = range1.isBlank() ? 0 : range1.getValue();
  
  // 候補２を取得
  var row2 = Math.ceil(Math.random() * lastRow);
  var range2 = keywordsSheet.getRange(row2, 2);
  var count2 = range2.isBlank() ? 0 : range2.getValue();

  // 出現頻度が低い方を選択
  var row = count1 > count2 ? row2 : row1;
  var count = count1 > count2 ? count2 : count1;

  // 選択した方の出現頻度をインクリメント
  keywordsSheet.getRange(row, 2).setValue(count + 1);
  
  return keywordsSheet.getRange(row, 1).getValue();
}
