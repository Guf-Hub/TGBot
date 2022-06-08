/**
 * @class InputMediaPhoto
 * @description Объект представляет фото для отправки.
 * @see https://core.telegram.org/bots/api#inputmediaphoto
 */
class InputMediaPhoto {
  /**
   * @constructor создает объект для отправки фото через метод sendMediaGroup.
   * @param {Object} options
   * @param {string} options.media файл для отправки.
   * @param {string} options.caption заголовок отправляемого фото, 0-1024 символа.
   * @param {string} options.parse_mode "HTML" | "MarkdownV2".
   * @param {MessageEntity[]} options.caption_entities список специальных сущностей, появляющихся в заголовке, которые можно указать вместо parse_mode.
   */
  constructor({ media, caption, parse_mode = "HTML", caption_entities }) {
    this.type = "photo";
    this.media = String(media);
    this.caption = String(caption);
    this.parse_mode = String(parse_mode);
    this.caption_entities = JSON.stringify(caption_entities);
  }
}

/**
 * @class InputMediaVideo
 * @description Объект представляет видео для отправки.
 * @see https://core.telegram.org/bots/api#inputmediavideo
 */
class InputMediaVideo {
  /**
   * @constructor создает объект для отправки видео через метод sendMediaGroup.
   * @param {Object} options
   * @param {string} options.media файл для отправки.
   * @param {(InputFile|string)} options.thumb миниатюра отправленного файла; можно игнорировать, если генерация миниатюр для файла поддерживается на стороне сервера. Миниатюра должна быть в формате JPEG и иметь размер не более 200 КБ. Ширина и высота эскиза не должны превышать 320. Игнорируется, если файл загружен не с помощью multipart/form-data. Миниатюры нельзя использовать повторно, их можно загружать только как новый файл, поэтому вы можете передать «attach://<file_attach_name>», если миниатюра была загружена с использованием multipart/form-data в <file_attach_name>.
   * @param {string} options.caption заголовок отправляемого видео, 0-1024 символа.
   * @param {string} options.parse_mode "HTML" | "MarkdownV2".
   * @param {MessageEntity[]} options.caption_entities список специальных сущностей, появляющихся в заголовке, которые можно указать вместо parse_mode.
   * @param {number} options.width ширина.
   * @param {number} options.height высота.
   * @param {number} options.duration продолжительность в секундах.
   * @param {boolean} options.supports_streaming True, если загруженное видео подходит для потоковой передачи.
   */
  constructor({
    media,
    thumb,
    caption,
    parse_mode = "HTML",
    caption_entities,
    width,
    height,
    duration,
    supports_streaming = false,
  }) {
    this.type = "video";
    this.media = String(media);
    this.thumb = String(thumb);
    this.caption = String(caption);
    this.parse_mode = String(parse_mode);
    this.caption_entities = JSON.stringify(caption_entities);
    this.width = Number(width);
    this.height = Number(height);
    this.duration = Number(duration);
    this.supports_streaming = Boolean(supports_streaming);
  }
}

/**
 * @class InputMediaAnimation
 * @description Объект представляет файл анимации (видео GIF или H.264/MPEG-4 AVC без звука) для отправки.
 * @see https://core.telegram.org/bots/api#inputmediaanimation
 */
class InputMediaAnimation {
  /**
   * @constructor создает объект для отправки анимации через метод sendMediaGroup.
   * @param {Object} options
   * @param {string} options.media файл для отправки.
   * @param {(InputFile|string)} options.thumb миниатюра отправленного файла; можно игнорировать, если генерация миниатюр для файла поддерживается на стороне сервера. Миниатюра должна быть в формате JPEG и иметь размер не более 200 КБ. Ширина и высота эскиза не должны превышать 320. Игнорируется, если файл загружен не с помощью multipart/form-data. Миниатюры нельзя использовать повторно, их можно загружать только как новый файл, поэтому вы можете передать «attach://<file_attach_name>», если миниатюра была загружена с использованием multipart/form-data в <file_attach_name>.
   * @param {string} options.caption заголовок отправляемой анимации, 0-1024 символа.
   * @param {string} options.parse_mode "HTML" | "MarkdownV2".
   * @param {MessageEntity[]} options.caption_entities список специальных сущностей, появляющихся в заголовке, которые можно указать вместо parse_mode.
   * @param {number} options.width ширина.
   * @param {number} options.height высота.
   * @param {number} options.duration продолжительность в секундах.
   */
  constructor({
    media,
    thumb,
    caption,
    parse_mode = "HTML",
    caption_entities,
    width,
    height,
    duration,
  }) {
    this.type = "animation";
    this.media = String(media);
    this.thumb = String(thumb);
    this.caption = String(caption);
    this.parse_mode = String(parse_mode);
    this.caption_entities = JSON.stringify(caption_entities);
    this.width = Number(width);
    this.height = Number(height);
    this.duration = Number(duration);
  }
}

/**
 * @class InputMediaAudio
 * @description Объект представляет аудиофайл, который следует рассматривать как музыку для отправки.
 * @see https://core.telegram.org/bots/api#inputmediaaudio
 */
class InputMediaAudio {
  /**
   * @constructor создает объект для отправки аудио через метод sendMediaGroup.
   * @param {Object} options
   * @param {string} options.media файл для отправки.
   * @param {(InputFile|string)} options.thumb миниатюра отправленного файла; можно игнорировать, если генерация миниатюр для файла поддерживается на стороне сервера. Миниатюра должна быть в формате JPEG и иметь размер не более 200 КБ. Ширина и высота эскиза не должны превышать 320. Игнорируется, если файл загружен не с помощью multipart/form-data. Миниатюры нельзя использовать повторно, их можно загружать только как новый файл, поэтому вы можете передать «attach://<file_attach_name>», если миниатюра была загружена с использованием multipart/form-data в <file_attach_name>.
   * @param {string} options.caption заголовок к аудио, 0-1024 символа.
   * @param {string} options.parse_mode "HTML" | "MarkdownV2".
   * @param {MessageEntity[]} options.caption_entities список специальных сущностей, появляющихся в заголовке, которые можно указать вместо parse_mode.
   * @param {number} options.duration продолжительность в секундах.
   * @param {string} options.performer исполнитель аудио.
   * @param {string} options.title название аудио.
   */
  constructor({
    media,
    thumb,
    caption,
    parse_mode = "HTML",
    caption_entities,
    duration,
    performer,
    title,
  }) {
    this.type = "audio";
    this.media = String(media);
    this.thumb = String(thumb);
    this.caption = String(caption);
    this.parse_mode = String(parse_mode);
    this.caption_entities = JSON.stringify(caption_entities);
    this.duration = Number(duration);
    this.performer = String(performer);
    this.title = String(title);
  }
}

/**
 * @class InputMediaDocument
 * @description Объектпредставляет содержимое отправляемого мультимедийного сообщения.
 * Этот объект представляет содержимое загружаемого файла.
 * Должны быть опубликованы с использованием multipart/form-data обычным способом загрузки файлов через браузер.
 * @see https://core.telegram.org/bots/api#inputmediadocument
 */
class InputMediaDocument {
  /**
   * @constructor создает объект для отправки документов через метод sendMediaGroup.
   * @param {Object} options
   * @param {string} options.media файл для отправки.
   * @param {string} options.caption заголовок отправляемого документа, 0-1024 символа.
   * @param {string} options.parse_mode "HTML" | "MarkdownV2".
   * @param {MessageEntity[]} options.caption_entities список специальных сущностей, появляющихся в заголовке, которые можно указать вместо parse_mode
   * @param {boolean} options.disable_content_type_detection
   */
  constructor({
    media,
    caption,
    parse_mode = "HTML",
    caption_entities,
    disable_content_type_detection = true,
  }) {
    this.type = "document";
    this.media = String(media); //.getDataAsString(); Utilities.base64Encode(media.getDataAsString())
    this.caption = String(caption);
    this.parse_mode = String(parse_mode);
    this.caption_entities = JSON.stringify(caption_entities);
    this.disable_content_type_detection = Boolean(
      disable_content_type_detection
    );
  }
}

/**
 * @description Вызываете конструктор class InputMediaPhoto.
 * @param {Object} options
 * @param {string} options.media файл для отправки.
 * @param {string} options.caption заголовок отправляемого фото, 0-1024 символа.
 * @param {string} options.parse_mode "HTML" | "MarkdownV2".
 * @param {MessageEntity[]} options.caption_entities список специальных сущностей, появляющихся в заголовке, которые можно указать вместо parse_mode.
 */
function inputMediaPhoto({ media, caption, parse_mode, caption_entities }) {
  return new InputMediaPhoto({
    media,
    caption,
    parse_mode,
    caption_entities,
  });
}

/**
 * @description Вызываете конструктор class InputMediaVideo.
 * @param {Object} options
 * @param {string} options.media файл для отправки.
 * @param {(InputFile|string)} options.thumb миниатюра отправленного файла; можно игнорировать, если генерация миниатюр для файла поддерживается на стороне сервера. Миниатюра должна быть в формате JPEG и иметь размер не более 200 КБ. Ширина и высота эскиза не должны превышать 320. Игнорируется, если файл загружен не с помощью multipart/form-data. Миниатюры нельзя использовать повторно, их можно загружать только как новый файл, поэтому вы можете передать «attach://<file_attach_name>», если миниатюра была загружена с использованием multipart/form-data в <file_attach_name>.
 * @param {string} options.caption заголовок отправляемого видео, 0-1024 символа.
 * @param {string} options.parse_mode "HTML" | "MarkdownV2".
 * @param {MessageEntity[]} options.caption_entities список специальных сущностей, появляющихся в заголовке, которые можно указать вместо parse_mode.
 * @param {number} options.width ширина.
 * @param {number} options.height высота.
 * @param {number} options.duration продолжительность в секундах.
 * @param {boolean} options.supports_streaming True, если загруженное видео подходит для потоковой передачи.
 */
function inputMediaVideo({
  media,
  thumb,
  caption,
  parse_mode,
  caption_entities,
  width,
  height,
  duration,
  supports_streaming,
}) {
  return new InputMediaVideo({
    media,
    thumb,
    caption,
    parse_mode,
    caption_entities,
    width,
    height,
    duration,
    supports_streaming,
  });
}

/**
 * @description Вызываете конструктор class InputMediaAnimation.
 * @param {Object} options
 * @param {string} options.media файл для отправки.
 * @param {(InputFile|string)} options.thumb миниатюра отправленного файла; можно игнорировать, если генерация миниатюр для файла поддерживается на стороне сервера. Миниатюра должна быть в формате JPEG и иметь размер не более 200 КБ. Ширина и высота эскиза не должны превышать 320. Игнорируется, если файл загружен не с помощью multipart/form-data. Миниатюры нельзя использовать повторно, их можно загружать только как новый файл, поэтому вы можете передать «attach://<file_attach_name>», если миниатюра была загружена с использованием multipart/form-data в <file_attach_name>.
 * @param {string} options.caption заголовок отправляемой анимации, 0-1024 символа.
 * @param {string} options.parse_mode "HTML" | "MarkdownV2".
 * @param {MessageEntity[]} options.caption_entities список специальных сущностей, появляющихся в заголовке, которые можно указать вместо parse_mode.
 * @param {number} options.width ширина.
 * @param {number} options.height высота.
 * @param {number} options.duration продолжительность в секундах.
 */
function inputMediaAnimation({
  media,
  thumb,
  caption,
  parse_mode,
  caption_entities,
  width,
  height,
  duration,
}) {
  return new InputMediaAnimation({
    media,
    thumb,
    caption,
    parse_mode,
    caption_entities,
    width,
    height,
    duration,
  });
}

/**
 * @description Вызываете конструктор class InputMediaAudio.
 * @param {Object} options
 * @param {string} options.media файл для отправки.
 * @param {(InputFile|string)} options.thumb миниатюра отправленного файла; можно игнорировать, если генерация миниатюр для файла поддерживается на стороне сервера. Миниатюра должна быть в формате JPEG и иметь размер не более 200 КБ. Ширина и высота эскиза не должны превышать 320. Игнорируется, если файл загружен не с помощью multipart/form-data. Миниатюры нельзя использовать повторно, их можно загружать только как новый файл, поэтому вы можете передать «attach://<file_attach_name>», если миниатюра была загружена с использованием multipart/form-data в <file_attach_name>.
 * @param {string} options.caption заголовок к аудио, 0-1024 символа.
 * @param {string} options.parse_mode "HTML" | "MarkdownV2".
 * @param {MessageEntity[]} options.caption_entities список специальных сущностей, появляющихся в заголовке, которые можно указать вместо parse_mode.
 * @param {number} options.duration продолжительность в секундах.
 * @param {string} options.performer исполнитель аудио.
 * @param {string} options.title название аудио.
 */
function inputMediaAudio({
  media,
  thumb,
  caption,
  parse_mode,
  caption_entities,
  duration,
  performer,
  title,
}) {
  return new InputMediaAudio({
    media,
    thumb,
    caption,
    parse_mode,
    caption_entities,
    duration,
    performer,
    title,
  });
}

/**
 * @description Вызываете конструктор class InputMediaDocument.
 * @param {Object} options
 * @param {string} options.media файл для отправки.
 * @param {string} options.caption заголовок отправляемого документа, 0-1024 символа.
 * @param {string} options.parse_mode "HTML" | "MarkdownV2".
 * @param {MessageEntity[]} options.caption_entities список специальных сущностей, появляющихся в заголовке, которые можно указать вместо parse_mode
 * @param {boolean} options.disable_content_type_detection
 */
function inputMediaDocument({
  media,
  caption,
  parse_mode,
  caption_entities,
  disable_content_type_detection,
}) {
  return new InputMediaDocument({
    media,
    caption,
    parse_mode,
    caption_entities,
    disable_content_type_detection,
  });
}
// inputMediaDocument = ({ media, caption }) => new InputMediaDocument({ media, caption });
