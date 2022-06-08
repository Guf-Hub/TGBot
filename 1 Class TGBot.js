/**
 * @class TGbot c version 28 через именованные аргументы в {options}.
 * @author Mikhail Nosaev <m.nosaev@gmail.com, https://t.me/nosaev_m> разработка Google таблиц и GAS скриптов.
 * @description Работа с API telegram.
 * @see https://core.telegram.org/bots/api.
 * @license Open Source GPL (при использовании требуется указывать имя автора).
 */
class TGbot {
  /**
   * @constructor
   * @param {Object} options параметры конструктора.
   * @param {string} options.botToken токен Telegram бота от \@BotFather.
   * @param {string} [options.webAppUrl] ссылка на WebApp Google для работы с ответами doGet(e).
   * @param {boolean} [options.log_request] печать URL и OPTIONS запроса при выполнении, по умочанию false.
   */
  constructor({ botToken, webAppUrl, log_request = false }) {
    this._botToken = "";
    this._webAppUrl = "";
    this._log_request = log_request;
    this._apiTelegramUrl = `https://api.telegram.org/bot${botToken}/`;
    this._build = this._builder(botToken, webAppUrl);
    this.InputMediaDocument = InputMediaPhoto;
    this.InputMediaDocument = InputMediaVideo;
    this.InputMediaDocument = InputMediaAnimation;
    this.InputMediaDocument = InputMediaAudio;
    this.InputMediaDocument = InputMediaDocument;
  }

  /**
   * @private
   * @method _builder
   * @param {string} botToken токен Telegram бота от \@BotFather.
   * @param {string} webAppUrl ссылка на WebApp Google для работы с ответами doGet(e).
   */
  _builder(botToken, webAppUrl) {
    if (!botToken)
      throw new Error(
        `Укажите token to access the HTTP API { botToken: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }`
      );

    if (botToken && webAppUrl) {
      this._botToken = botToken;
      this._webAppUrl = webAppUrl;
      delete this._build;
      return;
    }

    if (!webAppUrl) {
      this._botToken = botToken;
      delete this._build;
      return;
    }
  }

  /**
   * @private
   * @method _request
   * @description Метод, для отправки запроса к API.
   * @param {string} method метод по которому делается запрос.
   * @param {string} payload дополнительные параметры запроса.
   * @param {string} [options.contentType] "application/x-www-form-urlencoded;", "application/json;" (по умолчанию), "multipart/form-data;"
   * @return {JSON} В случае успеха возвращается объект JSON.
   */
  _request(method, payload, contentType = "application/json;") {
    if (!method)
      this._miss_parameter(
        "method не указан метод по которому делается запрос."
      );

    const fullUrl = `${this._apiTelegramUrl}${method}`;

    const options = {
      method: "post",
      muteHttpExceptions: true,
      followRedirects: true,
      validateHttpsCertificates: true,
      contentType: contentType,
    };

    for (var item in payload) {
      if (payload[item] == null) delete payload[item];
    }

    if (payload) {
      if (contentType === "multipart/form-data;") {
        delete options.contentType;
        options["Content-Type"] = contentType;
        options.payload = payload;
      } else options.payload = JSON.stringify(payload);
    }

    if (this._log_request)
      console.log(
        `URL >>> ${fullUrl},\nOPTIONS >>>\n ${JSON.stringify(options, null, 5)}`
      );

    var response = UrlFetchApp.fetch(fullUrl, options);

    if (response.getResponseCode() == 200) return JSON.parse(response);
    else false;
  }

  /**
   * @private
   * @method _miss_parameter
   * @description Проверка наличия обязательных параметров для отправки запроса.
   * @param {string} param пропущенный параметр.
   * @return {Error} Возвращает Error(`Пропущен ${param}`) в случае пропуска.
   */
  _miss_parameter(param) {
    throw new Error(`Пропущен ${param}`);
  }

  // Getting updates

  /**
   * @metod setWebhook
   * @description Метод, для указания URL-адреса и получения входящих обновлений через исходящий веб-перехватчик.
   * Всякий раз, когда для бота появляется обновление, мы отправляем HTTPS-запрос POST на указанный URL-адрес, содержащий сериализованное обновление JSON.
   * @see https://core.telegram.org/bots/api#setwebhook
   * @param {Object} options параметры запроса.
   * @param {string} options.url URL этого метода HTTPS для отправки обновлений.
   * @param {InputFile} [options.certificate] сертификат открытого ключа, чтобы можно было проверить используемый корневой сертификат.
   * @param {string} [options.ip_address] фиксированный IP-адрес, который будет использоваться для отправки запросов веб-перехватчика вместо IP-адреса, разрешенного через DNS.
   * @param {number} [options.max_connections] max допустимое количество одновременных подключений HTTPS к веб-перехватчику для доставки обновлений: 1–100. По умолчанию 40. Используйте более низкие значения, чтобы ограничить нагрузку на сервер вашего бота, и более высокие значения, чтобы увеличить пропускную способность вашего бота.
   * @param {String[]} [options.allowed_updates] JSON список типов обновлений, которые должен получать ваш бот. Укажите [“message”, “edited_channel_post”, “callback_query”], чтобы получать обновления только этих типов.
   * @param {boolean} [options.drop_pending_updates] True, чтобы удалить все ожидающие обновления.
   * @return {boolean} Возвращает True в случае успеха.
   */
  setWebhook({
    url = this._webAppUrl,
    certificate = "",
    ip_address = "",
    max_connections = 40,
    allowed_updates = [],
    drop_pending_updates = false,
  }) {
    if (this._botToken && url)
      var payload = {
        url: url,
        certificate: certificate ? JSON.stringify(certificate) : null,
        ip_address: ip_address ? String(ip_address) : null,
        max_connections: Number(max_connections),
        allowed_updates: allowed_updates
          ? JSON.stringify(allowed_updates)
          : null,
        drop_pending_updates: Boolean(drop_pending_updates),
      };

    return console.log(
      JSON.stringify(this._request("setWebhook", payload), null, 5)
    );
  }

  /**
   * @metod deleteWebhook
   * @description Метод, для удаления интеграции с веб-перехватчиком, если вы решите вернуться к getUpdates.
   * @see https://core.telegram.org/bots/api#deletewebhook
   * @param {boolean} [drop_pending_updates] True, чтобы удалить все ожидающие обновления, по умолчанию false.
   * @return {boolean} Возвращает True в случае успеха.
   */
  deleteWebhook(drop_pending_updates = false) {
    if (this._botToken && this._webAppUrl)
      var payload = {
        // url : this._webAppUr,
        drop_pending_updates: Boolean(drop_pending_updates),
      };

    return console.log(
      JSON.stringify(this._request("deleteWebhook", payload), null, 5)
    );
  }

  /**
   * @metod getWebhookInfo
   * @description Метод, для получения текущего статуса веб-перехватчика. Не требует параметров.
   * @see https://core.telegram.org/bots/api#getwebhookinfo
   * @return {WebhookInfo} В случае успеха возвращает объект WebhookInfo. Если бот использует getUpdates, он вернет объект с пустым полем URL.
   */
  getWebhookInfo() {
    if (this._botToken && this._webAppUrl)
      var payload = {
        url: String(this._webAppUrl),
      };

    return console.log(
      JSON.stringify(this._request("getWebhookInfo", payload), null, 5)
    );
  }

  // Methods

  /**
   * @metod getMe
   * @description Метод проверки токена аутентификации вашего бота. Не требует параметров.
   * @see https://core.telegram.org/bots/api#getme
   * @return {User} Возвращает основную информацию о боте в виде объекта User.
   */
  getMe() {
    return console.log(JSON.stringify(this._request("getMe"), null, 5));
  }

  /**
   * @metod setMyDefaultAdministratorRights
   * @description Метод, для измения прав администратора по умолчанию, запрашиваемые ботом, когда он добавляется в качестве администратора в группы или каналы.
   * Эти права будут предложены пользователям, но они могут изменить список перед добавлением бота.
   * @see https://core.telegram.org/bots/api#setmydefaultadministratorrights
   * @param {ChatAdministratorRights} rights объект JSON, описывающий новые права администратора по умолчанию.
   * Если не указано, права администратора по умолчанию будут удалены.
   * @param {boolean} [for_channels] True, чтобы изменить права администратора бота по умолчанию в каналах.
   * В противном случае будут изменены права администратора бота по умолчанию для групп и супергрупп.
   * @return {boolean} Возвращает True в случае успеха.
   */
  setMyDefaultAdministratorRights(rights, for_channels = false) {
    if (!rights)
      this._miss_parameter(
        "rights объект JSON, описывающий новые права администратора по умолчанию."
      );

    var payload = {
      rights: JSON.stringify(rights),
      for_channels: Boolean(for_channels),
    };

    return console.log(
      JSON.stringify(
        this._request("setMyDefaultAdministratorRights", payload),
        null,
        5
      )
    );
  }

  /**
   * @metod getMyDefaultAdministratorRights
   * @description Метод, для получения текущих прав администратора бота по умолчанию.
   * @see https://core.telegram.org/bots/api#getmydefaultadministratorrights
   * @param {boolean} for_channels True, чтобы получить права администратора бота по умолчанию в каналах.
   * В противном случае будут возвращены права администратора бота по умолчанию для групп и супергрупп.
   * @return {ChatAdministratorRights} Возвращает ChatAdministratorRights в случае успеха.
   */
  getMyDefaultAdministratorRights(for_channels = false) {
    var payload = {
      for_channels: Boolean(for_channels),
    };

    return console.log(
      JSON.stringify(
        this._request("getMyDefaultAdministratorRights", payload),
        null,
        5
      )
    );
  }

  /**
   * @metod setMyCommands
   * @description Метод, для установки списока команд бота.
   * @see https://core.telegram.org/bots/api#setmycommands
   * @param {BotCommand[]} commands список комманд.
   * @return {boolean} Возвращает True в случае успеха.
   */
  setMyCommands(commands) {
    if (!commands || commands === [])
      this._miss_parameter(
        "commands объект JSON, описывающий новые права администратора по умолчанию."
      );

    var payload = {
      commands: JSON.stringify(commands),
      // scope: scope,
      // language_code : language_code
    };

    return console.log(
      JSON.stringify(this._request("setMyCommands", payload), null, 5)
    );
  }

  /**
   * @metod getMyCommands
   * @description Метод, для получения списка команд бота.
   * @see https://core.telegram.org/bots/api#getmycommands
   * @return {BotCommand[]|[]} Возвращает массив BotCommand в случае успеха. Если команды не заданы, возвращается пустой список.
   */
  getMyCommands() {
    return console.log(JSON.stringify(this._request("getMyCommands"), null, 5));
  }

  /**
   * @metod deleteMyCommands
   * @description Метод, для удаления списока команд бота.
   * @see https://core.telegram.org/bots/api#deletemycommands
   * @return {boolean} Возвращает True в случае успеха.
   */
  deleteMyCommands() {
    return console.log(
      JSON.stringify(this._request("deleteMyCommands"), null, 5)
    );
  }

  // Chat

  /**
   * @metod getChat
   * @description Используйте этот метод для получения актуальной информации о чате (текущее имя пользователя для разговоров один на один, текущее имя пользователя, группы или канала и т. д.).
   * @see https://core.telegram.org/bots/api#getchat
   * @param {(string|number)} chat_id уникальный идентификатор целевой группы или имя пользователя целевой супергруппы или канала (в формате \@channelusername).
   * @return {Chat} Возвращает объект чата Chat в случае успеха.
   */
  getChat(chat_id) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевой группы или имя пользователя целевой супергруппы или канала (в формате @channelusername)."
      );

    var payload = {
      chat_id: String(chat_id),
    };

    return console.log(
      JSON.stringify(this._request("getChat", payload), null, 5)
    );
  }

  /**
   * @metod getChatAdministrators
   * @description Метод, для получения списка администраторов в чате.
   * @see https://core.telegram.org/bots/api#getchatadministrators
   * @param {(string|number)} chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы или канала (в формате \@channelusername).
   * @return {ChatMember} В случае успеха возвращает массив объектов ChatMember, содержащий информацию обо всех администраторах чата, кроме других ботов. Если чат является группой или супергруппой и не были назначены администраторы, будет возвращен только создатель.
   */
  getChatAdministrators(chat_id) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы или канала (в формате @channelusername)."
      );

    var payload = {
      chat_id: String(chat_id),
    };

    return console.log(
      JSON.stringify(this._request("getChatAdministrators", payload), null, 5)
    );
  }

  /**
   * @metod getChatMemberCount
   * @description Метод, для получения количества участников в чате.
   * @see https://core.telegram.org/bots/api#getchatmembercount
   * @param {(string|number)} chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы или канала (в формате \@channelusername).
   * @return {number} Возвращает Int в случае успеха.
   */
  getChatMemberCount(chat_id) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы или канала (в формате @channelusername)."
      );

    var payload = {
      chat_id: String(chat_id),
    };

    return this._request("getChatMemberCount", payload);
  }

  /**
   * @metod getChatMember
   * @description Метод, получения информации об участнике чата.
   * @see https://core.telegram.org/bots/api#getchatmember
   * @param {(string|number)} chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы или канала (в формате \@channelusername).
   * @param {number} user_id уникальный идентификатор идентификатор целевого пользователя
   * @return {ChatMember} Возвращает объект ChatMember в случае успеха.
   */
  getChatMember(chat_id, user_id) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы или канала (в формате @channelusername)."
      );
    if (!user_id)
      this._miss_parameter(
        "user_id уникальный идентификатор идентификатор целевого пользователя."
      );

    if (chat_id && user_id)
      var payload = {
        chat_id: String(chat_id),
        user_id: String(user_id),
      };

    return this._request("getChatMember", payload);
  }

  /**
   * @metod banChatMember
   * @description Метод, для блокировки пользователя в группе, супергруппе или канале.
   * В случае с супергруппами и каналами пользователь не сможет вернуться в чат самостоятельно по инвайт-ссылкам и т.п., если только его предварительно не разбанят.
   * Чтобы это работало, бот должен быть администратором в чате и иметь соответствующие права администратора.
   * @see https://core.telegram.org/bots/api#banchatmember
   * @param {(string|number)} chat_id уникальный идентификатор целевого чата или имя пользователя целевого канала (в формате \@channelusername).
   * @param {number} user_id уникальный идентификатор идентификатор целевого пользователя.
   * @param {number} [until_date] дата, когда пользователь будет разбанен, unix-время. Пользователь забанен > 366 дней или > 30 сек. текущего времени, забаненным навсегда. Применяется только для супергрупп и каналов.
   * @param {boolean} [revoke_messages] True, чтобы удалить все сообщения из чата для удаляемого пользователя. False, пользователь сможет видеть сообщения в группе, которые были отправлены до того, как пользователь был удален. Всегда верно для супергрупп и каналов.
   * @return {boolean} Возвращает True в случае успеха.
   */
  banChatMember(chat_id, user_id, until_date, revoke_messages = true) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевого чата или имя пользователя целевого канала (в формате @channelusername)."
      );
    if (!user_id)
      this._miss_parameter(
        "user_id уникальный идентификатор идентификатор целевого пользователя."
      );

    if (chat_id && user_id)
      var payload = {
        chat_id: String(chat_id),
        user_id: String(user_id),
        until_date: until_date ? Number(until_date) : null,
        revoke_messages: Boolean(revoke_messages),
      };

    return this._request("banChatMember", payload);
  }

  /**
   * @metod setChatPermissions
   * @description Метод, для установки разрешений чата по умолчанию для всех участников.
   * Чтобы это работало, бот должен быть администратором в группе или супергруппе и иметь права администратора can_restrict_members.
   * @see https://core.telegram.org/bots/api#setchatpermissions
   * @param {(string|number)} chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы (в формате \@supergroupusername).
   * @param {ChatPermissions} permissions JSON-сериализованный объект для новых разрешений чата по умолчанию.
   * @return {boolean} Возвращает True в случае успеха.
   */
  setChatPermissions(chat_id, permissions) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы (в формате @supergroupusername)."
      );
    if (!permissions || permissions === {})
      this._miss_parameter(
        "permissions JSON-сериализованный объект для новых разрешений чата по умолчанию."
      );

    if (chat_id && permissions)
      var payload = {
        chat_id: String(chat_id),
        permissions: JSON.stringify(permissions),
      };

    return this._request("setChatPermissions", payload);
  }

  /**
   * @metod restrictChatMember
   * @description Метод, чтобы ограничить пользователя в супергруппе.
   * Бот должен быть администратором в супергруппе и иметь соответствующие права администратора.
   * @see https://core.telegram.org/bots/api#restrictchatmember
   * @param {(string|number)} chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы (в формате @supergroupusername).
   * @param {number} user_id уникальный идентификатор целевого пользователя.
   * @param {ChatPermissions} permissions JSON-сериализованный объект для новых разрешений пользователя.
   * @param {number} [until_date] дата снятия ограничений для пользователя, время unix. Заблокирован > 366 дней или < 30 сек. с текущего времени, считается заблокированным навсегда.
   * @return {boolean} Возвращает True в случае успеха.
   */
  restrictChatMember(chat_id, user_id, permissions, until_date) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы (в формате @supergroupusername)."
      );
    if (!user_id)
      this._miss_parameter(
        "user_id уникальный идентификатор целевого пользователя."
      );
    if (!permissions || permissions === {})
      this._miss_parameter(
        "permissions JSON-сериализованный объект для новых разрешений чата по умолчанию."
      );

    if (chat_id && user_id && permissions)
      var payload = {
        chat_id: String(chat_id),
        user_id: Number(user_id),
        permissions: JSON.stringify(permissions),
        until_date: until_date ? Number(until_date) : null,
      };

    return this._request("restrictChatMember", payload);
  }

  /**
   * @metod leaveChat
   * @description Используйте этот метод чтобы ваш бот покинул группу, супергруппу или канал.
   * @see https://core.telegram.org/bots/api#leavechat
   * @param {(string|number)} chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы или канала (в формате \@channelusername).
   * @return {boolean} Возвращает True в случае успеха.
   */
  leaveChat(chat_id) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы или канала (в формате @channelusername)."
      );

    var payload = {
      chat_id: String(chat_id),
    };

    return console.log(
      JSON.stringify(this._request("leaveChat", payload), null, 5)
    );
  }

  // Message

  /**
   * @metod sendMessage
   * @description Метод, для отправки текстовых сообщений.
   * Чтобы использовать HTML, передайте HTML, использовать MarkdownV2, передайте MarkdownV2 в поле parse_mode.
   * Форматы @see https://core.telegram.org/bots/api#formatting-options.
   * @see https://core.telegram.org/bots/api#sendmessage
   * @param {Object} options
   * @param {(string|number)} options.chat_id уникальный идентификатор целевого чата или имя пользователя целевого канала (в формате \@channelusername).
   * @param {string} options.text текст сообщения, 1-4096 символов.
   * @param {(InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply)} options.reply_markup объект JSON для встроенной клавиатуры.
   * @param {string} [options.parse_mode] режим разбора сущностей "HTML" | "MarkdownV2".
   * @param {MessageEntity[]} [options.entities] JSON список специальных сущностей, которые появляются в новом заголовке, который можно указать вместо parse_mode.
   * @param {boolean} [options.disable_web_page_preview]
   * @param {boolean} [options.disable_notification] True, пользователи получат уведомление без звука.
   * @param {boolean} [options.protect_content] защищает содержимое отправленного сообщения от пересылки и сохранения.
   * @param {number} [options.reply_to_message_id] если сообщение является ответом, ID исходного сообщения.
   * @param {boolean} [options.allow_sending_without_reply] True, если сообщение должно быть отправлено, даже если указанное сообщение с ответом не найдено.
   * @return {Message} В случае успеха возвращается Message отправленное сообщение.
   */
  sendMessage({
    chat_id = "",
    text = "",
    reply_markup = "",
    parse_mode = "HTML",
    entities = "",
    disable_web_page_preview = false,
    disable_notification = false,
    protect_content = false,
    reply_to_message_id = "",
    allow_sending_without_reply = false,
  }) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевого чата или имя пользователя целевого канала (в формате @channelusername)."
      );
    if (!text)
      this._miss_parameter(
        "text текст отправляемого сообщения, 1-4096 символов."
      );

    if (chat_id && text)
      var payload = {
        chat_id: String(chat_id),
        text: String(text),
        reply_markup: reply_markup ? JSON.stringify(reply_markup) : null,
        parse_mode: String(parse_mode),
        entities: entities ? JSON.stringify(entities) : null,
        disable_web_page_preview: Boolean(disable_web_page_preview),
        disable_notification: Boolean(disable_notification),
        protect_content: Boolean(protect_content),
        reply_to_message_id: reply_to_message_id
          ? Number(reply_to_message_id)
          : null,
        allow_sending_without_reply: Boolean(allow_sending_without_reply),
      };

    return this._request("sendMessage", payload);
  }

  /**
   * @metod copyMessage
   * @description Метод, для копирования сообщения.
   * @see https://core.telegram.org/bots/api#copymessage
   * @param {Object} options
   * @param {(string|number)} options.chat_id уникальный идентификатор целевого чата или имя пользователя целевого канала (в формате \@channelusername).
   * @param {(string|number)} options.from_chat_id уникальный идентификатор чата, в который было отправлено исходное сообщение (или имя пользователя канала в формате \@channelusername).
   * @param {number} options.message_id идентификатор сообщения в чате указанный в from_chat_id.
   * @param {string} [options.caption] новая подпись для медиа, 0-1024 символов. Если не указано, исходная подпись сохраняется.
   * @param {(InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply)} [options.reply_markup] объект JSON для встроенной клавиатуры.
   * @param {string} [options.parse_mode] режим разбора сущностей в новой подписи "HTML" | "MarkdownV2".
   * @param {MessageEntity[]} [options.caption_entities] JSON список специальных сущностей, которые появляются в новом заголовке, который можно указать вместо parse_mode.
   * @param {boolean} [options.disable_notification] True, пользователи получат уведомление без звука.
   * @param {boolean} [options.protect_content] защищает содержимое отправленного сообщения от пересылки и сохранения.
   * @param {number} [options.reply_to_message_id] если сообщение является ответом, ID исходного сообщения.
   * @param {boolean} [options.allow_sending_without_reply] True, если сообщение должно быть отправлено, даже если указанное сообщение с ответом не найдено.
   * @return {MessageId} Возвращает MessageId отправленного сообщения в случае успеха.
   */
  copyMessage({
    chat_id = "",
    from_chat_id = "",
    message_id = "",
    caption = "",
    reply_markup = "",
    parse_mode = "HTML",
    caption_entities = "",
    disable_notification = false,
    protect_content = false,
    reply_to_message_id = "",
    allow_sending_without_reply = false,
  }) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевого чата или имя пользователя целевого канала (в формате @channelusername)."
      );
    if (!from_chat_id)
      this._miss_parameter(
        "from_chat_id уникальный идентификатор чата, в который было отправлено исходное сообщение (или имя пользователя канала в формате @channelusername)."
      );
    if (!message_id)
      this._miss_parameter(
        "message_id идентификатор сообщения в чате указанный в from_chat_id."
      );

    if (chat_id && from_chat_id && message_id)
      var payload = {
        chat_id: String(chat_id),
        from_chat_id: String(from_chat_id),
        message_id: Number(message_id),
        caption: caption ? String(caption) : null,
        reply_markup: reply_markup ? JSON.stringify(reply_markup) : null,
        parse_mode: String(parse_mode),
        caption_entities: caption_entities
          ? JSON.stringify(caption_entities)
          : null,
        disable_notification: Boolean(disable_notification),
        protect_content: Boolean(protect_content),
        reply_to_message_id: reply_to_message_id
          ? Number(reply_to_message_id)
          : null,
        allow_sending_without_reply: Boolean(allow_sending_without_reply),
      };

    return this._request("copyMessage", payload);
  }

  /**
  * @metod deleteMessage
  * @description Метод, для удаления сообщения, в том числе служебного, со следующими ограничениями:
   - Сообщение может быть удалено только в том случае, если оно было отправлено < 48 часов назад.
   - Сообщение с кубиками в приватном чате можно удалить только в том случае, если оно было отправлено > 24 часов назад.
   - Боты могут удалять исходящие сообщения в приватных чатах, группах и супергруппах.
   - Боты могут удалять входящие сообщения в приватных чатах.
   - Боты с разрешениями can_post_messages могут удалять исходящие сообщения в каналах.
   - Если бот является администратором группы, он может удалить там любое сообщение.
   - Если у бота есть разрешение can_delete_messages в супергруппе или канале, он может удалить там любое сообщение.
  * @see https://core.telegram.org/bots/api#deletemessage
  * @param {Object} options
  * @param {(string|number)} options.chat_id уникальный идентификатор целевого чата или имя пользователя целевого канала (в формате \@channelusername). 
  * @param {number} options.message_id идентификатор сообщения для удаления.
  * @return {boolean} Возвращает True в случае успеха.
 */
  deleteMessage({ chat_id, message_id }) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевого чата или имя пользователя целевого канала (в формате @channelusername)."
      );
    if (!message_id)
      this._miss_parameter("message_id идентификатор сообщения для удаления.");

    if (chat_id && message_id)
      var payload = {
        chat_id: String(chat_id),
        message_id: Number(message_id),
      };

    return this._request("deleteMessage", payload);
  }

  /**
   * @metod editMessageText
   * @description Метод, для редактирования текстовых и игровых сообщений.
   * @see https://core.telegram.org/bots/api#editmessagetext
   * @param {Object} options
   * @param {(string|number)} [options.chat_id] уникальный идентификатор целевого чата или имя пользователя целевого канала (в формате \@channelusername), если inline_message_id не указан.
   * @param {number} [options.message_id] идентификатор сообщения для редактирования, если inline_message_id не указан.
   * @param {string} [options.inline_message_id] идентификатор встроенного сообщения, если chat_id и message_id не указаны.
   * @param {string} options.text новый текст сообщения, 1-4096 символов.
   * @param {(InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply)} [options.reply_markup] объект JSON для новой встроенной клавиатуры.
   * @param {string} [options.parse_mode] режим разбора сущностей в новой подписи "HTML" | "MarkdownV2".
   * @param {MessageEntity[]} [options.entities] JSON список специальных сущностей, которые появляются в тексте сообщения, который можно указать вместо parse_mode.
   * @param {boolean} [options.disable_web_page_preview]
   * @return {Message | Boolean} В случае успеха, если отредактированное сообщение не является встроенным сообщением, возвращается Message отредактированное сообщение, в противном случае возвращается True.
   */
  editMessageText({
    chat_id = "",
    message_id = "",
    inline_message_id = "",
    text = "",
    parse_mode = "HTML",
    entities = "",
    disable_web_page_preview = false,
    reply_markup = "",
  }) {
    if (!text)
      this._miss_parameter("text новый текст сообщения, 1-4096 символов.");

    if ((chat_id && message_id && text) || (inline_message_id && text))
      var payload = {
        chat_id: chat_id ? String(chat_id) : null,
        message_id: message_id ? Number(message_id) : null,
        inline_message_id: inline_message_id ? String(inline_message_id) : null,
        text: String(text),
        reply_markup: reply_markup ? JSON.stringify(reply_markup) : null,
        parse_mode: String(parse_mode),
        entities: entities ? JSON.stringify(entities) : null,
        disable_web_page_preview: Boolean(disable_web_page_preview),
      };

    return this._request("editMessageText", payload);
  }

  /**
   * @metod editMessageCaption
   * @description Метод, для редактирования подписей к сообщениям.
   * @see https://core.telegram.org/bots/api#editmessagecaption
   * @param {Object} options
   * @param {(string|number)} [options.chat_id] уникальный идентификатор целевого чата или имя пользователя целевого канала (в формате \@channelusername), если inline_message_id не указан.
   * @param {number} [options.message_id] идентификатор сообщения для редактирования, если inline_message_id не указан.
   * @param {string} [options.inline_message_id] идентификатор встроенного сообщения, если chat_id и message_id не указаны.
   * @param {string} [options.caption] новый заголовок сообщения, 0-1024 символов.
   * @param {(InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply)} [options.reply_markup] объект JSON для новой встроенной клавиатуры.
   * @param {string} [options.parse_mode] режим разбора сущностей в новой подписи "HTML" | "MarkdownV2".
   * @param {MessageEntity[]} [options.caption_entities] JSON список специальных сущностей, которые появляются в новом заголовке, который можно указать вместо parse_mode.
   * @return {Message | Boolean} В случае успеха, если отредактированное сообщение не является встроенным сообщением, возвращается Message отредактированное сообщение, в противном случае возвращается True.
   */
  editMessageCaption({
    chat_id = "",
    message_id = "",
    inline_message_id = "",
    caption = "",
    parse_mode = "HTML",
    caption_entities = "",
    reply_markup = "",
  }) {
    if (!caption)
      this._miss_parameter(
        "caption новый заголовок сообщения, 0-1024 символов."
      );

    if ((chat_id && message_id && caption) || (inline_message_id && caption))
      var payload = {
        chat_id: chat_id ? String(chat_id) : null,
        message_id: message_id ? Number(message_id) : null,
        inline_message_id: inline_message_id ? String(inline_message_id) : null,
        caption: caption ? String(caption) : null,
        reply_markup: reply_markup ? JSON.stringify(reply_markup) : null,
        parse_mode: String(parse_mode),
        caption_entities: caption_entities
          ? JSON.stringify(caption_entities)
          : null,
      };

    return this._request("editMessageCaption", payload);
  }

  /**
   * @metod editMessageMedia
   * @description Метод, для редактирования анимации, аудио, документа, фото или видео сообщения.
   * @see https://core.telegram.org/bots/api#editmessagemedia
   * Если сообщение является частью альбома сообщений, его можно отредактировать только в аудио для аудиоальбомов, в документ для альбомов документов и в фото или видео в остальных случаях.
   * При редактировании встроенного сообщения новый файл не может быть загружен; использовать ранее загруженный файл через его file_id или указать URL-адрес.
   * @param {Object} options
   * @param {(string|number)} [options.chat_id] уникальный идентификатор целевого чата или имя пользователя целевого канала (в формате \@channelusername), если inline_message_id не указан.
   * @param {number} [options.message_id] идентификатор сообщения для редактирования, если inline_message_id не указан.
   * @param {string} [options.inline_message_id] идентификатор встроенного сообщения, если chat_id и message_id не указаны.
   * @param {InputMedia} options.media объект JSON для нового мультимедийного содержимого сообщения.
   * @param {InlineKeyboardMarkup} [options.reply_markup] объект JSON для новой встроенной клавиатуры.
   * @return {Message | Boolean} В случае успеха, если отредактированное сообщение не является встроенным сообщением, возвращается Message отредактированное сообщение, в противном случае возвращается True.
   */
  editMessageMedia({
    chat_id = "",
    message_id = "",
    inline_message_id = "",
    media = "",
    reply_markup = "",
  }) {
    if (!media)
      this._miss_parameter(
        "media объект JSON для нового мультимедийного содержимого сообщения."
      );

    if ((chat_id && message_id && media) || (inline_message_id && media))
      var payload = {
        chat_id: chat_id ? String(chat_id) : null,
        message_id: message_id ? Number(message_id) : null,
        inline_message_id: inline_message_id ? String(inline_message_id) : null,
        media: media,
        reply_markup: reply_markup ? JSON.stringify(reply_markup) : null,
      };

    return this._request("editMessageMedia", payload);
  }

  /**
   * @metod editMessageReplyMarkup
   * @description Метод, для редактирования разметки ответов сообщений.
   * @see https://core.telegram.org/bots/api#editmessagereplymarkup
   * @param {Object} options
   * @param {(string|number)} [options.chat_id] уникальный идентификатор целевого чата или имя пользователя целевого канала (в формате \@channelusername), если inline_message_id не указан.
   * @param {number} [options.message_id] идентификатор сообщения для редактирования, если inline_message_id не указан.
   * @param {string} [options.inline_message_id] идентификатор встроенного сообщения, если chat_id и message_id не указаны.
   * @param {(InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply)} [options.reply_markup] объект JSON для новой встроенной клавиатуры.
   * @return {Message | Boolean} В случае успеха, если отредактированное сообщение не является встроенным сообщением, возвращается отредактированное сообщение, в противном случае возвращается True.
   */
  editMessageReplyMarkup({
    chat_id = "",
    message_id = "",
    inline_message_id = "",
    reply_markup = "",
  }) {
    if (!reply_markup)
      this._miss_parameter(
        "reply_markup объект JSON для новой встроенной клавиатуры."
      );

    if (
      (chat_id && message_id && reply_markup) ||
      (inline_message_id && reply_markup)
    )
      var payload = {
        chat_id: chat_id ? String(chat_id) : null,
        message_id: message_id ? Number(message_id) : null,
        inline_message_id: inline_message_id ? String(inline_message_id) : null,
        reply_markup: reply_markup ? JSON.stringify(reply_markup) : null,
      };

    return this._request("editMessageReplyMarkup", payload);
  }

  // Other

  /**
   * @metod sendPhoto
   * @description Метод, для отправки фотографий.
   * @see https://core.telegram.org/bots/api#sendphoto
   * @param {Object} options
   * @param {(string|number)} options.chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы или канала (в формате \@channelusername).
   * @param {(InputFile|string)} options.photo фото для отправки.
   * Передайте file_id в виде строки, чтобы отправить фотографию, которая существует на серверах Telegram (рекомендуется).
   * Передайте URL-адрес HTTP в виде строки, чтобы Telegram мог получить фотографию из Интернета, или загрузите новую фотографию, используя multipart/form-data.
   * Фотография должна быть размером не более 10 МБ.
   * Суммарная ширина и высота фотографии не должны превышать 10000.
   * Соотношение ширины и высоты должно быть не более 20.
   * @param {string} [options.caption] подпись к фото (может использоваться при повторной отправке по file_id), 0-1024 символа.
   * @param {(InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply)} [options.reply_markup] объект JSON для новой встроенной клавиатуры.
   * @param {string} [options.parse_mode] режим разбора сущностей в новой подписи "HTML" | "MarkdownV2".
   * @param {MessageEntity[]} [options.caption_entities] SON список специальных сущностей, которые появляются в новом заголовке, который можно указать вместо parse_mode.
   * @param {boolean} [options.disable_notification] True, пользователи получат уведомление без звука.
   * @param {boolean} [options.protect_content] защищает содержимое отправленного сообщения от пересылки и сохранения.
   * @param {number} [options.reply_to_message_id] если сообщение является ответом, ID исходного сообщения.
   * @param {boolean} [options.allow_sending_without_reply] True, если сообщение должно быть отправлено, даже если указанное сообщение с ответом не найдено.
   * @param {string} [options.contentType] "multipart/form-data", по умолчанию "application/json".
   * @return {Message} В случае успеха возвращается Message отправленное сообщение.
   */
  sendPhoto({
    chat_id = "",
    photo = "",
    caption = "",
    reply_markup = "",
    parse_mode = "HTML",
    caption_entities = "",
    disable_notification = false,
    protect_content = false,
    reply_to_message_id = "",
    allow_sending_without_reply = false,
    contentType,
  }) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевой группы или имя пользователя целевой супергруппы или канала (в формате @channelusername)."
      );
    if (!photo) this._miss_parameter("photo фото для отправки.");

    if (chat_id && photo)
      var payload = {
        chat_id: String(chat_id),
        photo: photo,
        caption: caption ? String(caption) : null,
        parse_mode: String(parse_mode),
        caption_entities: caption_entities
          ? JSON.stringify(caption_entities)
          : null,
        disable_notification: Boolean(disable_notification),
        protect_content: Boolean(protect_content),
        reply_to_message_id: reply_to_message_id
          ? Number(reply_to_message_id)
          : null,
        allow_sending_without_reply: Boolean(allow_sending_without_reply),
        reply_markup: reply_markup ? JSON.stringify(reply_markup) : null,
      };

    if (contentType) return this._request("sendPhoto", payload, contentType);
    else return this._request("sendPhoto", payload);
  }

  /**
   * @metod sendDocument
   * @description Метод, для отправки общих файлов.
   * @see https://core.telegram.org/bots/api#senddocument
   * @param {Object} options
   * @param {(string|number)} options.chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы или канала (в формате \@channelusername).
   * @param {(InputFile|string)} options.document файл для отправки.
   * В настоящее время боты могут отправлять файлы любого типа размером до 50 МБ, может быть изменено в будущем.
   * Передайте file_id в виде строки, чтобы отправить файл, существующий на серверах Telegram (рекомендуется).
   * Передайте URL-адрес HTTP в виде строки, чтобы Telegram мог получить файл из Интернета, или загрузите новый, используя multipart/form-data.
   * @param {string} [options.caption] подпись к документу (также может использоваться при повторной отправке документа по file_id), 0-1024 символа.
   * @param {(InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply)} [options.reply_markup] объект JSON для новой встроенной клавиатуры.
   * @param {(InputFile|string)} [options.thumb] миниатюра отправленного файла, можно игнорировать, если генерация миниатюр для файла поддерживается на стороне сервера, формат JPEG и иметь размер не более 200К.
   * Ширина и высота эскиза не > 320, игнорируется, если файл загружен не с помощью multipart/form-data.
   * Миниатюры не могут быть повторно использованы и могут быть загружены только как новый файл.
   * Поэтому вы можете передать «attach://<file_attach_name>», если миниатюра была загружена с использованием multipart/form-data в <file_attach_name>
   * @param {string} [options.parse_mode] режим разбора сущностей в новой подписи "HTML" | "MarkdownV2".
   * @param {MessageEntity[]} [options.caption_entities] SON список специальных сущностей, которые появляются в новом заголовке, который можно указать вместо parse_mode.
   * @param {boolean} [options.disable_content_type_detection] отключает автоматическое определение типа контента на стороне сервера для файлов, загруженных с помощью multipart/form-data.
   * @param {boolean} [options.disable_notification] True, пользователи получат уведомление без звука.
   * @param {boolean} [options.protect_content] защищает содержимое отправленного сообщения от пересылки и сохранения.
   * @param {number} [options.reply_to_message_id] если сообщение является ответом, ID исходного сообщения.
   * @param {boolean} [options.allow_sending_without_reply] True, если сообщение должно быть отправлено, даже если указанное сообщение с ответом не найдено.
   * @param {string} [options.contentType] "multipart/form-data", по умолчанию "application/json".
   * @return {Message} В случае успеха возвращается Message отправленное сообщение.
   */
  sendDocument({
    chat_id = "",
    document = "",
    caption = "",
    reply_markup = "",
    thumb = "",
    parse_mode = "HTML",
    caption_entities = "",
    disable_content_type_detection = false,
    disable_notification = false,
    protect_content = false,
    reply_to_message_id = "",
    allow_sending_without_reply = false,
    contentType,
  }) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевого чата или имя пользователя целевого канала (в формате @channelusername)."
      );
    if (!document) this._miss_parameter("document файл для отправки");

    if (chat_id && document)
      var payload = {
        chat_id: String(chat_id),
        document: document,
        caption: caption ? String(caption) : null,
        thumb: thumb ? thumb : null,
        parse_mode: String(parse_mode),
        caption_entities: caption_entities
          ? JSON.stringify(caption_entities)
          : null,
        disable_content_type_detection: Boolean(disable_content_type_detection),
        disable_notification: Boolean(disable_notification),
        protect_content: Boolean(protect_content),
        reply_to_message_id: reply_to_message_id
          ? Number(reply_to_message_id)
          : null,
        allow_sending_without_reply: Boolean(allow_sending_without_reply),
        reply_markup: reply_markup ? JSON.stringify(reply_markup) : null,
      };

    if (contentType) return this._request("sendDocument", payload, contentType);
    else return this._request("sendDocument", payload);
  }

  /**
   * @metod sendVideo
   * @description Метод, для отправки видео.
   * @see https://core.telegram.org/bots/api#sendvideo
   * @param {Object} options
   * @param {(string|number)} options.chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы или канала (в формате \@channelusername).
   * @param {(InputFile|string)} options.video видео для отправки.
   * @param {(InputFile|string)} [options.thumb] миниатюра отправленного файла; можно игнорировать, если генерация миниатюр для файла поддерживается на стороне сервера. Миниатюра должна быть в формате JPEG и иметь размер не более 200 КБ. Ширина и высота эскиза не должны превышать 320. Игнорируется, если файл загружен не с помощью multipart/form-data. Миниатюры нельзя использовать повторно, их можно загружать только как новый файл, поэтому вы можете передать «attach://<file_attach_name>», если миниатюра была загружена с использованием multipart/form-data в <file_attach_name>.
   * @param {number} [options.width] ширина.
   * @param {number} [options.height] высота.
   * @param {number} [options.duration] продолжительность в секундах.
   * @param {boolean} [options.supports_streaming] True, если загруженное видео подходит для потоковой передачи.
   * @param {string} [options.caption] подпись к видео (может использоваться при повторной отправке по file_id), 0-1024 символа.
   * @param {(InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply)} [options.reply_markup] объект JSON для новой встроенной клавиатуры.
   * @param {string} [options.parse_mode] режим разбора сущностей в новой подписи "HTML" | "MarkdownV2".
   * @param {MessageEntity[]} [options.caption_entities] SON список специальных сущностей, которые появляются в новом заголовке, который можно указать вместо parse_mode.
   * @param {boolean} [options.disable_notification] True, пользователи получат уведомление без звука.
   * @param {boolean} [options.protect_content] защищает содержимое отправленного сообщения от пересылки и сохранения.
   * @param {number} [options.reply_to_message_id] если сообщение является ответом, ID исходного сообщения.
   * @param {boolean} [options.allow_sending_without_reply] True, если сообщение должно быть отправлено, даже если указанное сообщение с ответом не найдено.
   * @param {string} [options.contentType] "multipart/form-data", по умолчанию "application/json".
   * @return {Message} В случае успеха возвращается Message отправленное сообщение.
   */
  sendVideo({
    chat_id = "",
    video = "",
    thumb = "",
    width = "",
    height = "",
    duration = "",
    supports_streaming = false,
    caption = "",
    reply_markup,
    parse_mode = "HTML",
    caption_entities = "",
    disable_notification = false,
    protect_content = false,
    reply_to_message_id = "",
    allow_sending_without_reply = false,
    contentType,
  }) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевой группы или имя пользователя целевой супергруппы или канала (в формате @channelusername)."
      );
    if (!video) this._miss_parameter("video видео для отправки.");

    if (chat_id && video)
      var payload = {
        chat_id: String(chat_id),
        video: video,
        thumb: thumb ? thumb : null,
        width: width ? Number(width) : null,
        height: height ? Number(height) : null,
        duration: duration ? Number(duration) : null,
        supports_streaming: Boolean(supports_streaming),
        caption: caption ? String(caption) : null,
        parse_mode: String(parse_mode),
        caption_entities: caption_entities
          ? JSON.stringify(caption_entities)
          : null,
        disable_notification: Boolean(disable_notification),
        protect_content: Boolean(protect_content),
        reply_to_message_id: Number(reply_to_message_id),
        allow_sending_without_reply: Boolean(allow_sending_without_reply),
        reply_markup: reply_markup ? JSON.stringify(reply_markup) : null,
      };

    if (contentType) return this._request("sendVideo", payload, contentType);
    else return this._request("sendVideo", payload);
  }

  /**
   * @metod sendAudio
   * @description Метод, для отправки отправки аудиофайлов, если вы хотите, чтобы клиенты Telegram отображали их в музыкальном проигрывателе. Ваш звук должен быть в формате .MP3 или .M4A. В случае успеха возвращается отправленное сообщение.
   * @see https://core.telegram.org/bots/api#sendaudio
   * @param {Object} options
   * @param {(string|number)} options.chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы или канала (в формате \@channelusername).
   * @param {(InputFile|string)} options.audio видео для отправки.
   * @param {(InputFile|string)} [options.thumb] миниатюра отправленного файла; можно игнорировать, если генерация миниатюр для файла поддерживается на стороне сервера. Миниатюра должна быть в формате JPEG и иметь размер не более 200 КБ. Ширина и высота эскиза не должны превышать 320. Игнорируется, если файл загружен не с помощью multipart/form-data. Миниатюры нельзя использовать повторно, их можно загружать только как новый файл, поэтому вы можете передать «attach://<file_attach_name>», если миниатюра была загружена с использованием multipart/form-data в <file_attach_name>.
   * @param {number} [options.duration] продолжительность в секундах.
   * @param {String} [options.performer] исполнитель аудио.
   * @param {String} [options.title] название аудио.
   * @param {string} [options.caption] подпись к аудио, 0-1024 символа.
   * @param {(InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply)} [options.reply_markup] объект JSON для новой встроенной клавиатуры.
   * @param {string} [options.parse_mode] режим разбора сущностей в новой подписи "HTML" | "MarkdownV2".
   * @param {MessageEntity[]} [options.caption_entities] SON список специальных сущностей, которые появляются в новом заголовке, который можно указать вместо parse_mode.
   * @param {boolean} [options.disable_notification] True, пользователи получат уведомление без звука.
   * @param {boolean} [options.protect_content] защищает содержимое отправленного сообщения от пересылки и сохранения.
   * @param {number} [options.reply_to_message_id] если сообщение является ответом, ID исходного сообщения.
   * @param {boolean} [options.allow_sending_without_reply] True, если сообщение должно быть отправлено, даже если указанное сообщение с ответом не найдено.
   * @param {string} [options.contentType] "multipart/form-data", по умолчанию "application/json".
   * @return {Message} В случае успеха возвращается Message отправленное сообщение.
   */
  sendAudio({
    chat_id = "",
    audio = "",
    thumb = "",
    performer = "",
    title = "",
    duration = "",
    caption = "",
    reply_markup,
    parse_mode = "HTML",
    caption_entities = "",
    disable_notification = false,
    protect_content = false,
    reply_to_message_id = "",
    allow_sending_without_reply = false,
    contentType,
  }) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевой группы или имя пользователя целевой супергруппы или канала (в формате @channelusername)."
      );
    if (!audio) this._miss_parameter("audio аудио для отправки.");

    if (chat_id && audio)
      var payload = {
        chat_id: String(chat_id),
        audio: audio,
        thumb: thumb ? thumb : null,
        performer: performer ? String(performer) : null,
        title: title ? String(title) : null,
        duration: duration ? Number(duration) : null,
        caption: caption ? String(caption) : null,
        parse_mode: String(parse_mode),
        caption_entities: caption_entities
          ? JSON.stringify(caption_entities)
          : null,
        disable_notification: Boolean(disable_notification),
        protect_content: Boolean(protect_content),
        reply_to_message_id: Number(reply_to_message_id),
        allow_sending_without_reply: Boolean(allow_sending_without_reply),
        reply_markup: reply_markup ? JSON.stringify(reply_markup) : null,
      };

    if (contentType) return this._request("sendAudio", payload, contentType);
    else return this._request("sendAudio", payload);
  }

  /**
   * @metod sendMediaGroup
   * @description Метод, отправки группы фотографий, видео, документов или аудио в виде альбома.
   * Документы и аудиофайлы могут быть сгруппированы в альбом только с сообщениями одного типа.
   * @see https://core.telegram.org/bots/api#sendmediagroup
   * @param {Object} options
   * @param {(string|number)} options.chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы или канала (в формате \@channelusername).
   * @param {Array.<(InputMediaAudio|InputMediaDocument|InputMediaPhoto|InputMediaVideo)>} options.media объект JSON для нового мультимедийного содержимого сообщения.
   * @param {boolean} [options.disable_notification] True, пользователи получат уведомление без звука.
   * @param {boolean} [options.protect_content] защищает содержимое отправленного сообщения от пересылки и сохранения.
   * @param {number} [options.reply_to_message_id] если сообщение является ответом, ID исходного сообщения.
   * @param {boolean} [options.allow_sending_without_reply] True, если сообщение должно быть отправлено, даже если указанное сообщение с ответом не найдено.
   * @return {Message} В случае успеха возвращается Message отправленное сообщение.
   */
  sendMediaGroup({
    chat_id = "",
    media = "",
    disable_notification = false,
    protect_content = false,
    reply_to_message_id = "",
    allow_sending_without_reply = false,
  }) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы или канала (в формате @channelusername)."
      );
    if (!media)
      this._miss_parameter(
        "media объект JSON для нового мультимедийного содержимого сообщения."
      );

    if (chat_id && media)
      var payload = {
        chat_id: String(chat_id),
        media: media,
        disable_notification: Boolean(disable_notification),
        protect_content: Boolean(protect_content),
        reply_to_message_id: reply_to_message_id
          ? Number(reply_to_message_id)
          : null,
        allow_sending_without_reply: Boolean(allow_sending_without_reply),
      };

    return this._request("sendMediaGroup", payload);
  }

  /**
   * @metod sendSticker
   * @description Метод, отправки статических стикеров .WEBP, анимированных .TGS или видео .WEBM.
   * @see https://core.telegram.org/bots/api#sendsticker
   * @param {Object} options
   * @param {(string|number)} options.chat_id уникальный идентификатор целевого чата или имя пользователя целевой супергруппы или канала (в формате \@channelusername).
   * @param {(InputFile|string)} options.sticker наклейка для отправки.
   * Передайте file_id в виде строки, чтобы отправить файл, существующий на серверах Telegram (рекомендуется).
   * Передайте URL-адрес HTTP в виде строки, чтобы Telegram мог получить файл .WEBP из Интернета, или загрузите новый, используя multipart/form-data.
   * @param {(InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply)} [options.reply_markup] объект JSON для новой встроенной клавиатуры.
   * @param {boolean} [options.disable_notification] True, пользователи получат уведомление без звука.
   * @param {boolean} [options.protect_content] защищает содержимое отправленного сообщения от пересылки и сохранения.
   * @param {number} [options.reply_to_message_id] если сообщение является ответом, ID исходного сообщения.
   * @param {boolean} [options.allow_sending_without_reply] True, если сообщение должно быть отправлено, даже если указанное сообщение с ответом не найдено.
   * @param {string} [options.contentType] "multipart/form-data", по умолчанию "application/json".
   * @return {Message} В случае успеха возвращается Message отправленное сообщение.
   */
  sendSticker({
    chat_id = "",
    sticker = "",
    reply_markup = "",
    disable_notification = false,
    protect_content = false,
    reply_to_message_id = "",
    allow_sending_without_reply = false,
    contentType,
  }) {
    if (!chat_id)
      this._miss_parameter(
        "chat_id уникальный идентификатор целевой группы или имя пользователя целевой супергруппы или канала (в формате @channelusername)."
      );
    if (!sticker) this._miss_parameter("sticker наклейка для отправки.");

    if (chat_id && sticker)
      var payload = {
        chat_id: String(chat_id),
        sticker: sticker,
        reply_markup: reply_markup ? JSON.stringify(reply_markup) : null,
        disable_notification: Boolean(disable_notification),
        protect_content: Boolean(protect_content),
        reply_to_message_id: reply_to_message_id
          ? Number(reply_to_message_id)
          : null,
        allow_sending_without_reply: Boolean(allow_sending_without_reply),
      };

    if (contentType) return this._request("sendSticker", payload, contentType);
    else return this._request("sendSticker", payload);
  }

  /**
   * @metod getStickerSet
   * @description Метод, для получения набора наклеек по названию набора.
   * @see https://core.telegram.org/bots/api#getstickerset
   * @param {string} name название набора наклеек.
   * @return {StickerSet} В случае успеха возвращается объект StickerSet.
   */
  getStickerSet(name) {
    if (!name) this._miss_parameter("name название набора наклеек.)");

    var payload = {
      name: String(name),
    };

    return this._request("getStickerSet", payload);
  }

  /**
   * @metod answerCallbackQuery
   * @description Метод, для отправки ответов на запросы обратного вызова, отправленные со встроенной клавиатуры.
   * Ответ будет отображаться пользователю в виде уведомления в верхней части экрана чата или в виде предупреждения.
   * @see https://core.telegram.org/bots/api#answercallbackquery
   * @param {string} callback_query_id уникальный идентификатор запроса, на который нужно ответить.
   * @param {string} [text] текст уведомления. Если не указано, пользователю ничего не будет показано, 0-200 символов.
   * @param {boolean} [show_alert] True, оповещение вместо уведомления в верхней части экрана чата. По умолчанию false.
   * @param {string} [url] URL-адрес, который будет открыт клиентом пользователя. Если вы создали игру и приняли условия через @Botfather, укажите URL-адрес, который открывает вашу игру — обратите внимание, что это будет работать, только если запрос исходит от кнопки callback_game.
   * @param {number} [cache_time] max время в секундах, в течение которого результат запроса обратного вызова может кэшироваться на стороне клиента.
   * @return {boolean} Возвращает True в случае успеха.
   */
  answerCallbackQuery(
    callback_query_id = "",
    text = "",
    show_alert = false,
    url = "",
    cache_time = ""
  ) {
    if (!callback_query_id)
      this._miss_parameter(
        "callback_query_id уникальный идентификатор запроса, на который нужно ответить."
      );

    var payload = {
      callback_query_id: String(callback_query_id),
      text: text ? String(text) : null,
      show_alert: Boolean(show_alert),
      url: url ? String(url) : null,
      cache_time: cache_time ? Number(cache_time) : null,
    };

    return this._request("answerCallbackQuery", payload);
  }

  /**
   * @metod answerInlineQuery
   * @description Метод, для отправки ответов на встроенный запрос.
   * Допускается не более 50 результатов на запрос.
   * @see https://core.telegram.org/bots/api#answerinlinequery
   * @param {Object} options
   * @param {string} options.inline_query_id уникальный идентификатор ответа на запрос.
   * @param {InlineQueryResult[]} options.results сериализованный в формате JSON массив результатов для встроенного запроса.
   * @param {number} [options.cache_time] max время в секундах, в течение которого результат встроенного запроса может кэшироваться на сервере. По умолчанию 300.
   * @param {boolean} [options.is_personal] True, если результаты могут кэшироваться на стороне сервера только для пользователя, отправившего запрос. По умолчанию результаты могут быть возвращены любому пользователю, отправившему тот же запрос.
   * @param {string} [options.next_offset] смещение, которое клиент должен отправить в следующем запросе с тем же текстом, чтобы получить больше результатов. Передайте пустую строку, если результатов больше нет или если вы не поддерживаете нумерацию страниц. Длина смещения не может превышать 64 байта.
   * @param {string} [options.switch_pm_text] если передано, клиенты будут отображать кнопку с указанным текстом, которая переключает пользователя в приватный чат с ботом и отправляет боту стартовое сообщение с параметром switch_pm_parameter.
   * @param {string} [options.switch_pm_parameter] параметр глубокой ссылки для сообщения /start, отправляемого боту, когда пользователь нажимает кнопку переключения. 1-64 символа, разрешены только A-Z, a-z, 0-9, _ и -.
   * Пример. Встроенный бот, который отправляет видео на YouTube, может попросить пользователя подключить бота к своей учетной записи YouTube, чтобы соответствующим образом адаптировать результаты поиска.
   * Для этого он отображает кнопку «Подключить свою учетную запись YouTube» над результатами или даже до их отображения. Пользователь нажимает кнопку, переключается на приватный чат с ботом и при этом передает начальный параметр, который указывает боту вернуть ссылку OAuth.
   * После этого бот может предложить кнопку switch_inline, чтобы пользователь мог легко вернуться в чат, где он хотел использовать встроенные возможности бота.
   * @return {boolean} В случае успеха возвращается True.
   */
  answerInlineQuery({
    inline_query_id = "",
    results = "",
    cache_time = "",
    is_personal = true,
    next_offset = "",
    switch_pm_text = "",
    switch_pm_parameter = "",
  }) {
    if (!inline_query_id)
      this._miss_parameter(
        "inline_query_id уникальный идентификатор ответа на запрос."
      );

    var payload = {
      inline_query_id: String(inline_query_id),
      results: results ? JSON.stringify(results) : null,
      cache_time: cache_time ? Number(cache_time) : null,
      is_personal: Boolean(is_personal),
      next_offset: next_offset ? String(next_offset) : null,
      switch_pm_text: switch_pm_text ? String(switch_pm_text) : null,
      switch_pm_parameter: switch_pm_parameter
        ? String(switch_pm_parameter)
        : null,
    };

    return this._request("answerInlineQuery", payload);
  }

  /**
   * @metod getFile
   * @description Метод, для получения основной информации о файле и подготовки его к загрузке.
   * На данный момент боты могут загружать файлы размером до 20 МБ.
   * Файл можно скачать https://api.telegram.org/file/bot<token>/<file_path>, где <file_path> берется из ответа.
   * Гарантируется, что ссылка будет действительна не менее 1 часа.
   * Когда срок действия ссылки истекает, можно запросить новую, снова вызвав getFile.
   * @see https://core.telegram.org/bots/api#getfile
   * @param {string} file_id идентификатор файла для получения информации.
   * @return {File} В случае успеха возвращается объект File.
   */
  getFile(file_id) {
    if (!file_id)
      this._miss_parameter(
        "file_id идентификатор файла для получения информации."
      );
    return `https://api.telegram.org/file/bot${this._botToken}/${
      JSON.parse(
        UrlFetchApp.fetch(
          `https://api.telegram.org/bot${this._botToken}/getFile?file_id=${file_id}`
        ).getContentText()
      ).result
    }`;
  }

  /**
   * @metod getPath
   * @description Метод, для получения пути к файлу.
   * @param {string} file_id идентификатор файла для получения информации.
   * @return {string} В случае успеха возвращается file_path.
   */
  getPath(file_id) {
    if (!file_id)
      this._miss_parameter(
        "file_id идентификатор файла для получения информации."
      );
    return JSON.parse(
      UrlFetchApp.fetch(
        `https://api.telegram.org/file/bot${this._botToken}/getFile?file_id=${file_id}`
      )
    ).result.file_path;
  }

  /**
   * @metod getFileDownloadUrl
   * @description Метод, для получения ссылки на скачивание файла.
   * @param {string} path путь до папки.
   * @return {string} В случае успеха возвращается url.
   */
  getFileDownloadUrl(path) {
    if (!path) this._miss_parameter("path путь до папки.");
    return `https://api.telegram.org/file/bot${this._botToken}/${path}`;
  }
}

/**
 * @description Вызываете методы конструктора class TGbot.
 * @param {string} botToken токен Telegram бота от \@BotFather.
 * @param {string} webAppUrl ссылка на WebApp Google, для работы с ответами doGet(e).
 * @param {boolean} log_request показывать строку URL, OPTIONS запроса при выполнении, по умочанию false.
 * @return {TGbot} Экземпляр class TGbot.
 */
function bot(botToken, webAppUrl, log_request) {
  return new TGbot({ botToken, webAppUrl, log_request });
}

// Не официальные методы API
/**
 * @metod answerMessage
 * @description ответ по from.id на получнное сообщение.
 * Чтобы использовать HTML, передайте HTML, использовать MarkdownV2, передайте MarkdownV2 в поле parse_mode.
 * Форматы @see https://core.telegram.org/bots/api#formatting-options.
 * @see https://core.telegram.org/bots/api#sendmessage
 * @param {Object} options
 * @param {JSON} options.message полученное сообщение.
 * @param {string} options.text текст сообщения, 1-4096 символов.
 * @param {(InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply)} options.reply_markup объект JSON для встроенной клавиатуры.
 * @param {string} options.parse_mode режим разбора сущностей "HTML" | "MarkdownV2".
 * @param {MessageEntity[]} options.entities JSON список специальных сущностей, которые появляются в новом заголовке, который можно указать вместо parse_mode.
 * @param {boolean} options.disable_web_page_preview
 * @param {boolean} options.disable_notification True, пользователи получат уведомление без звука.
 * @param {boolean} options.protect_content защищает содержимое отправленного сообщения от пересылки и сохранения.
 * @param {number} options.reply_to_message_id если сообщение является ответом, ID исходного сообщения.
 * @param {boolean} options.allow_sending_without_reply True, если сообщение должно быть отправлено, даже если указанное сообщение с ответом не найдено.
 * @return {Message} В случае успеха возвращается Message отправленное сообщение.
 */
TGbot.prototype.answerMessage = function ({
  message = "",
  text = "",
  reply_markup = "",
  parse_mode = "HTML",
  entities = "",
  disable_web_page_preview = false,
  disable_notification = false,
  protect_content = false,
  allow_sending_without_reply = false,
}) {
  if (!message) this._miss_parameter("message");
  if (!text)
    this._miss_parameter(
      "text текст отправляемого сообщения, 1-4096 символов."
    );

  if (message && text)
    var payload = {
      chat_id: message.from.id,
      text: String(text),
      reply_markup: reply_markup ? JSON.stringify(reply_markup) : null,
      parse_mode: String(parse_mode),
      entities: entities ? JSON.stringify(entities) : null,
      disable_web_page_preview: Boolean(disable_web_page_preview),
      disable_notification: Boolean(disable_notification),
      protect_content: Boolean(protect_content),
      allow_sending_without_reply: Boolean(allow_sending_without_reply),
    };

  return this._request("sendMessage", payload);
};

/**
 * @metod replyMessage
 * @description ответ по message_id на получнное сообщение.
 * Чтобы использовать HTML, передайте HTML, использовать MarkdownV2, передайте MarkdownV2 в поле parse_mode.
 * Форматы @see https://core.telegram.org/bots/api#formatting-options.
 * @see https://core.telegram.org/bots/api#sendmessage
 * @param {Object} options
 * @param {JSON} options.message полученное сообщение.
 * @param {string} options.text текст сообщения, 1-4096 символов.
 * @param {(InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply)} options.reply_markup объект JSON для встроенной клавиатуры.
 * @param {string} options.parse_mode режим разбора сущностей "HTML" | "MarkdownV2".
 * @param {MessageEntity[]} options.entities JSON список специальных сущностей, которые появляются в новом заголовке, который можно указать вместо parse_mode.
 * @param {boolean} options.disable_web_page_preview
 * @param {boolean} options.disable_notification True, пользователи получат уведомление без звука.
 * @param {boolean} options.protect_content защищает содержимое отправленного сообщения от пересылки и сохранения.
 * @param {boolean} options.allow_sending_without_reply True, если сообщение должно быть отправлено, даже если указанное сообщение с ответом не найдено.
 * @return {Message} В случае успеха возвращается Message отправленное сообщение.
 */
TGbot.prototype.replyMessage = function ({
  message = "",
  text = "",
  reply_markup = "",
  parse_mode = "HTML",
  entities = "",
  disable_web_page_preview = false,
  disable_notification = false,
  protect_content = false,
  allow_sending_without_reply = false,
}) {
  if (!message) this._miss_parameter("message");
  if (!text)
    this._miss_parameter(
      "text текст отправляемого сообщения, 1-4096 символов."
    );

  if (message && text)
    var payload = {
      chat_id: message.from.id,
      text: String(text),
      reply_markup: reply_markup ? JSON.stringify(reply_markup) : null,
      parse_mode: String(parse_mode),
      entities: entities ? JSON.stringify(entities) : null,
      disable_web_page_preview: Boolean(disable_web_page_preview),
      disable_notification: Boolean(disable_notification),
      protect_content: Boolean(protect_content),
      reply_to_message_id: Number(message.message_id),
      allow_sending_without_reply: Boolean(allow_sending_without_reply),
    };

  return this._request("sendMessage", payload);
};
