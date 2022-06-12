function startAuthorizationMenu(message, botToken) {
  const msg = `
Привет, ${message?.from?.first_name} 👋
Для работы нужна, регистрация! 🙂
Нажми кнопку 👇`;

  const Bot = new TGbot({ botToken: botToken });
  const Kb = new Keyboard();
  const K = new Key();

  const KEYBOARD_CONTACT = Kb.make([K.contact("Авторизация")]).reply();
  Bot.sendMessage({
    chat_id: message.chat.id,
    text: msg,
    reply_markup: KEYBOARD_CONTACT,
  });
}

// меню авторизации для админа, передать id админов в массиве
function adminAuthorizationMenu(message, adminIds, botToken) {
  const msg = `
<strong>Запрос авторизации</strong>
Пользователь: ${message.contact?.first_name}
Телефон: ${message.contact?.phone_number}
user_id: ${message.contact?.user_id}
Разрешить? 👇`;

  const Kb = new Keyboard();
  const K = new Key();

  const KEYBOARD_AUTHORIZATION = Kb.make(
    [K.callback("Авторизовать"), K.callback("Блокировать")],
    { columns: 2 }
  ).inline();

  writeNewUser(message.contact);

  const Bot = new TGbot({ botToken: botToken });

  adminIds.map((id) =>
    Bot.sendMessage({
      chat_id: id,
      text: msg,
      reply_markup: KEYBOARD_AUTHORIZATION,
    })
  );
}

// сбор новых users
function writeNewUser(contact) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet =
    ss.getSheetByName("USERS") || ss.insertSheet("USERS").setTabColor("RED");

  if (sheet.getLastRow() > 0)
    sheet.appendRow([
      new Date(),
      contact?.user_id,
      contact?.first_name,
      contact?.phone_number,
    ]);
  else {
    sheet.appendRow(["Дата", "user id", "Имя", "Телефон", "Авторизация"]);
    sheet.appendRow([
      new Date(),
      contact?.user_id,
      contact?.first_name,
      contact?.phone_number,
    ]);
  }
  SpreadsheetApp.flush();
}

// сообщение ожидание ответа
function awaitMessage(message, botToken, type = 1) {
  const Bot = new TGbot({ botToken: botToken });

  let msg;
  if (type === 1) msg = "⏳ Ждем подтверджения ...";
  if (type === 2) msg = "⏳ Готовим отчёт ...";
  return Bot.sendMessage({
    chat_id: message?.chat?.id,
    text: msg,
    reply_markup: new Keyboard().remove(),
  });
}

// подтверждение авторизации для user
function authorizationConfirmed(message, botToken) {
  const Bot = new TGbot({ botToken: botToken });
  const msg = `
${message?.text.split("\n")[1].split(" ")[1]}, авторизация прошла успешно!!!`;

  Bot.sendMessage({
    chat_id: +message?.text.match(/\d+/gm)[1],
    text: msg,
    reply_markup: new Keyboard().remove(),
  });
}

// проверка авторизован user или нет
function authorizeNewUser(message, value) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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

// список user_id
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

// сбор location
function writeLocation(message) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet =
    ss.getSheetByName("LOCATION") ||
    ss.insertSheet("LOCATION").setTabColor("RED");
  const lastRow = sheet.getLastRow();
  let data = [
    [
      new Date(),
      message.chat.id,
      `https://t.me/${message.chat.username}` || chat.first_name,
      message.location.latitude,
      message.location.longitude,
      `https://maps.google.ru/maps?q=${message.location.latitude},${message.location.longitude}`,
      `https://yandex.ru/maps/?rtext=~${message.location.latitude}%2C${message.location.longitude}`,
    ],
  ];
  if (lastRow === 0)
    data = [
      ["Дата", "chat_id", "Ник", "Широта", "Долгота", "Google", "Yandex"],
    ].concat(data.map((r) => r));
  sheet.getRange(lastRow + 1, 1, data.length, data[0].length).setValues(data);
  SpreadsheetApp.flush();
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
