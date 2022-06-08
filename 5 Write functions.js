// сбор новых users
function writeNewUser(contact) {
  const sheet =
    ss.getSheetByName("USERS") || ss.insertSheet("USERS").setTabColor("RED");
  const lastRow = sheet.getLastRow();
  if (lastRow > 0)
    sheet.appendRow([
      new Date(),
      contact?.user_id,
      contact?.first_name,
      contact?.phone_number,
    ]);
  else {
    sheet.appendRow([
      "Дата добавления",
      "user id",
      "Имя",
      "Телефон",
      "Авторизация",
    ]);
    sheet.appendRow([
      new Date(),
      contact?.user_id,
      contact?.first_name,
      contact?.phone_number,
    ]);
  }
  SpreadsheetApp.flush();
}

// проверка авторизован user или нет
function authorizeNewUser(message, value) {
  const sheet = ss.getSheetByName("USERS");
  const userIdsValues = sheet.getRange(2, 2, sheet.getLastRow(), 1).getValues();
  let userRows = [];
  for (let i = userIdsValues.length - 1; i >= 0; i--) {
    if (
      userIdsValues[i][0] &&
      userIdsValues[i][0] === +message?.text.match(/\d+/gm)[1]
    ) {
      userRows.push(i + 2);
      // break;
    }
  }

  if (userRows && userRows.length === 1) {
    sheet.getRange(userRows[0], 5).setValue(value);
    SpreadsheetApp.flush();
    return true;
  } else if (userRows.length > 1) {
    userRows.map((item) => sheet.getRange(item, 5).setValue(value));
    SpreadsheetApp.flush();
    return true;
  } else return false;
}

// список ID
function usersList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("USERS") || ss.insertSheet("USERS");
  const lastRow = sheet.getLastRow();
  if (lastRow == 0) return undefined;
  let data = sheet
    .getRange("A1:E" + lastRow)
    .getValues()
    .filter((i) => i[4] === true);
  const dict = {};
  data.map((item, i) => (dict[item[1]] = i));
  return dict;
}

function saveFile_(id, folder, file_name, mimeType) {
  try {
    const content = getBlob_(id, mimeType);
    return checkFolder_(folder)
      .createFile(content)
      .setName(
        `${file_name} ${d2s_(new Date())}` || `${id} ${d2s_(new Date())}`
      )
      .getUrl();
  } catch (e) {
    console.log(e.stack);
  }
}

function getBlob_(fileId, mimeType) {
  const response = UrlFetchApp.fetch(
    "https://api.telegram.org/bot" + botToken + "/getFile?file_id=" + fileId
  );
  const filePath = JSON.parse(response.getContentText()).result.file_path;
  const fileUrl =
    "https://api.telegram.org/file/bot" + botToken + "/" + filePath;
  return UrlFetchApp.fetch(fileUrl).getBlob().setContentType(mimeType);
}

function checkFolder_(folder_name) {
  const folder = DriveApp.getFoldersByName(folder_name);
  return folder.hasNext() ? folder.next() : DriveApp.createFolder(folder_name);
}

function d2s_(date) {
  return Utilities.formatDate(
    date,
    Session.getScriptTimeZone(),
    "dd-MM-YY HH-mm"
  );
}

// сохраняем фото
function savePhotoVideo(
  chat_id,
  unix_timestamp,
  aUser,
  ms,
  chat,
  chatTitle,
  fileId,
  fileMime,
  fileName,
  sName,
  folderName
) {
  const sh = SpreadsheetApp.openById(config.id.FileWriteOffsId).getSheetByName(
    sName
  );
  const fileUrl = fileId
    ? saveFile_(fileId, folderName, fileName, fileMime)
    : "";
  const data = [
    [
      new Date(unix_timestamp * 1000),
      chat_id,
      chat,
      chatTitle,
      aUser,
      ms,
      fileUrl,
    ],
  ];

  sh.getRange(sh.getLastRow() + 1, 1, 1, data[0].length).setValues(data);
  return fileUrl;
}
