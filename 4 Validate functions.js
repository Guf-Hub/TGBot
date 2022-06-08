function isAuthorizationMessage(message) {
  if (message.hasOwnProperty("contact")) return true;
  return false;
}

function isAdminMessage(message) {
  if (idAdmin.includes(message.from.id)) return true;
  return false;
}

function isMessageType(message, type) {
  if (message.hasOwnProperty("entities") && !message.hasOwnProperty(type))
    return false;
  return true;
}

function isTextMessage(message) {
  if (!message.hasOwnProperty("entities") && message.hasOwnProperty("text"))
    return true;
  return false;
}

function isPhotoMessage(message) {
  if (message.hasOwnProperty("entities") && message.hasOwnProperty("photo"))
    return true;
  return false;
}

function isVideoMessage(message) {
  if (message.hasOwnProperty("entities") && message.hasOwnProperty("video"))
    return true;
  return false;
}

function isDocumentMessage(message) {
  if (message.hasOwnProperty("entities") && message.hasOwnProperty("document"))
    return true;
  return false;
}

function isBotCommandMessage(message) {
  if (
    !(
      message?.hasOwnProperty("entities") &&
      message?.entities[0].type === "bot_command" &&
      /^\//.exec(message?.text)
    )
  )
    return false;
  return true;
}

function isBotMessageByContents(contents) {
  const message = contents.message || contents.callback_query.message;
  if (message.from.is_bot === true) return true;
  return false;
}

function isBotMessageByMessage(message) {
  if (message.from.is_bot === true) return true;
  return false;
}

function isChannelMessage(contents) {
  if (
    contents.hasOwnProperty("channel_post") ||
    contents.hasOwnProperty("edited_channel_post")
  )
    return true;
  return false;
}

function isMediaGroup(message) {
  if (message.hasOwnProperty("media_group_id")) return true;
  return false;
}

function isPoll(contents) {
  if (contents.hasOwnProperty("poll")) return true;
  return false;
}

function extractTextFromMessage(message) {
  if (!message) return undefined;
  return message.text;
}

function isNoValide(message) {
  if (
    /([A-Za-zА-Яа-я]+[0-9]+|[0-9]+[A-Za-zА-Яа-я]+|^\d{3,}|[A-Za-zА-Яа-я])/gm.test(
      String(message.text.replace(/\s+/g, "").replaceAll(/\/|,/g, ".").trim())
    )
  )
    return true;
  else return false;
}

function isValideDate(message) {
  if (
    !!/^\d{2}\.\d{2}\.\d{4}$/g.exec(
      String(message.text.replace(/\s+/g, "").replaceAll(/\/|,/g, ".").trim())
    )
  )
    return true;
  else return false;
}
