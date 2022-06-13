// подборка скриптов для Google Таблиц.

/**
 * Получить ключ по значению
 * @param {JSON} object объект
 * @param {string} serch значение по которому ищем ключ
 * @return {string} значение
 */
function getKeyByValue(object, serch) {
  if (serch in object) {
    let value = object[serch] + 1;
    return Object.keys(object).find((key) => object[key] === value);
  }
}

/**
 * Упаковать в zip архив
 * @param {Blob} blobs файлы для упаковки
 * @param {string} filename название архива
 * @return {Blob} zip архив
 */
function zipBlob(blobs, filename) {
  return Utilities.zip(blobs, `${filename}.zip`);
}

/**
 * Получить номер текущей недели ISO 8601
 * @return {number} номер текущей недели
 */
function getCurrWeekNumber() {
  Date.prototype.getWeek = function () {
    // Create a copy of this date object.
    var target = new Date(this.valueOf());

    // ISO week date weeks start on monday, so correct the day number.
    var dayNr = (this.getDay() + 6) % 7;

    // ISO 8601 states that week 1 is the week with the first thursday of that year.
    // Set the target date to the thursday in the target week.
    target.setDate(target.getDate() - dayNr + 3);

    // Store the millisecond value of the target date.
    var firstThursday = target.valueOf();

    // Set the target to the first thursday of the year.
    // First set the target to january first.
    target.setMonth(0, 1);
    // Not a thursday? Correct the date to the next thursday.
    if (target.getDay() != 4)
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));

    // The weeknumber is the number of weeks between the first thursday of the year and the thursday in the target week.
    return 1 + Math.ceil((firstThursday - target) / 604800000);
  };

  return new Date().getWeek();
}

/**
 * Текущая неделя
 * @return {string} диапазон с - по
 */
function week(today) {
  const options = { year: "2-digit", month: "numeric", day: "numeric" };
  const mondayOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay() + 1
  );
  const sundayOfWeek = new Date(
    mondayOfWeek.getFullYear(),
    mondayOfWeek.getMonth(),
    mondayOfWeek.getDate() + mondayOfWeek.getDay() + 5
  );
  return `${mondayOfWeek.toLocaleString(
    "ru-RU",
    options
  )}-${sundayOfWeek.toLocaleString("ru-RU", options)}`;
}

/**
 * Hеделя по текущий день
 * @return {string} диапазон с - по
 */
function weekByToday(today) {
  const options = { year: "2-digit", month: "numeric", day: "numeric" };
  const mondayOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay() + 1
  );
  return `${mondayOfWeek.toLocaleString(
    "ru-RU",
    options
  )}-${today.toLocaleString("ru-RU", options)}`;
}

/**
 * Логирование времени начала и окончания скрипта
 */
timeLog = {
  start: () => {
    return new Date().getTime();
  },

  endInMilliseconds: (start, log = true) => {
    const end = new Date().getTime();
    if (log) console.log(`SecondWay: ${e - s}ms`);
    return end - start;
  },

  endInMinutes: (milliseconds) => {
    let minutes = 1000 * Math.round(milliseconds / 1000); // округление до ближайшей секунды
    const d = new Date(milliseconds);
    minutes = `${d.getUTCMinutes()}:${d.getUTCSeconds()}`;
    console.log(`MinutesWay: ${minutes}m`);
  },
};

/**
 * Заснуть на n секунд
 * @param {number} seconds количество секунд сна, по умолчанию 1
 */
function sleep(seconds = 1) {
  Utilities.sleep(seconds * 1000);
}

/**
 * Преобразовать все формулы в значения на активном листе
 */
function formulasToValuesActiveSheet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getDataRange();
  range.copyValuesToRange(
    sheet,
    1,
    range.getLastColumn(),
    1,
    range.getLastRow()
  );
}

/**
 * Преобразовать все формулы в значения на каждом листе книги
 */
function formulasToValuesInBook() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  sheet.forEach(function (sheet) {
    var range = sheet.getDataRange();
    range.copyValuesToRange(
      sheet,
      1,
      range.getLastColumn(),
      1,
      range.getLastRow()
    );
  });
}

/**
 * Скрыть, показать или удалить листы из книги кроме указанных
 * @param {SpreadsheetApp.ActiveSpreadsheet} ss книга
 * @param {string[]} sharr массив исключаемых листов
 * @param {string} type "hide", "show", "delete"
 */
function hideOrShowOrDeleteAllSheetsExcept(ss, sharr, type) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    console.log(sheets[i].getName());
    if (!sharr.includes(sheets[i].getName())) {
      if (type === "hide") sheets[i].hideSheet();
      if (type === "show") sheets[i].showSheet();
      if (type === "delete") ss.deleteSheet(sheets[i]);
    }
  }
}

/**
 * Проверка квот MailApp
 */
function checkEmailQuotaRemaining() {
  const emailQuotaRemaining = MailApp.getRemainingDailyQuota();
  console.log(`Оставшаяся квота электронной почты: ${emailQuotaRemaining}`);
}

/**
 * Переводит сообщение с языка оригинала на выбранный язык
 * @param {Object} options JSON
 * @param {string} options.message сообщение, которое необходимо перевести
 * @param {string} options.transferLanguage язык сообщния, по умолчанию "ru"
 * @param {string} options.sourceLanguage язык на который нужно превести сообщние, по умолчанию "en"
 * @return {string} переведенное сообщение
 */
function translateMessage({
  message,
  transferLanguage = "ru",
  sourceLanguage = "en",
}) {
  return LanguageApp.translate(
    LanguageApp.translate(message, sourceLanguage, transferLanguage),
    transferLanguage,
    sourceLanguage
  );
}

/**
 * Конвертирует xlsx в формат Google Spreadsheet и сохраняет его на Google Диск
 * @param {Blob} f blob
 * @return {string} newfileId
 */
function convertXlsxToSpreadsheet(f) {
  const fileBlob = f.getBlob().setContentType(MimeType.MICROSOFT_EXCEL);
  const resource = {
    title: `Tmp ${
      fileBlob.getName().split(".")[0]
    } ${new Date().toDateString()}`,
    mimeType: MimeType.GOOGLE_SHEETS,
  };

  const newfileId = Drive.Files.insert(resource, fileBlob, {
    convert: "true",
  }).getId();
  console.log(newfileId);
  // Drive.Files.remove(newfileId);
  return newfileId;
}

/**
 * Конвертирует csv в формат Google Spreadsheet и сохраняет его на Google Диск
 * @param {Blob} f blob
 * @return {Blob} blob
 */
function convertCsvToSpreadsheet(f, delemiter = ";") {
  const fileBlob = Utilities.parseCsv(
    f.getBlob().setContentType(MimeType.CSV).getDataAsString(),
    delemiter
  );
  // const resource = {
  //   title: fileBlob.getName().split(".")[0],
  //   mimeType: MimeType.GOOGLE_SHEETS
  // };

  // const newfileId = Drive.Files.insert(resource, fileBlob, { "convert": "true" }).getId();
  // console.log(newfileId);
  // Drive.Files.remove(newfileId);

  return fileBlob;
}

/**
 * Создает лист, если он отсутствует в книге и возвращет его
 * @param {string} name название листа
 * @param {string} color цвет ярлыка
 * @return {SpreadsheetApp.Sheet} sheet
 */
function setSheet(name, color = null) {
  return ss.getSheetByName(name) || ss.insertSheet(name).setTabColor(color);
}

/**
 * Проверяет явлеяется переданное значение числом
 * @param {(string|number)} n проверяемое значение
 * @return {boolean} true или false
 */
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Добавляет данные в таблицу по API
 * @param {object.<string>} sheet объект: id книги, название листа, диапазон
 * @param {Array.<string,number>} data массив данных
 */
function appendData(sheet, data) {
  try {
    const result = Sheets.Spreadsheets.Values.append(
      {
        range: `${sheet.sheetName}${sheet.range}`,
        majorDimension: "ROWS", // || "COLUMNS",
        values: data,
      },
      sheet.spreadsheetId,
      `${sheet.sheetName}${sheet.range}`,
      {
        valueInputOption: "USER_ENTERED", //"RAW"
        // responseValueRenderOption: "UNFORMATTED_VALUE" // "FORMULA", // UNFORMATTED_VALUE // FORMATTED_VALUE
        // insertDataOption: "OVERWRITE" //INSERT_ROWS
      }
    );

    return result;
  } catch (e) {
    console.log(e.stack);
  }
}

/**
 * Возвращает сглаженный объект
 * @see https://gist.github.com/penguinboy/762197#gistcomment-3448642
 * @param {object} object объект
 * @return {object}
 */
function flatten(object, path = null, separator = ".") {
  return Object.keys(object).reduce((acc, key) => {
    const value = object[key];
    const newPath = Array.isArray(object)
      ? `${path ? path : ""}[${key}]`
      : [path, key].filter(Boolean).join(separator);
    const isObject = [
      typeof value === "object",
      value !== null,
      !(value instanceof Date),
      !(value instanceof RegExp),
      !(Array.isArray(value) && value.length === 0),
    ].every(Boolean);

    return isObject
      ? { ...acc, ...flatten(value, newPath, separator) }
      : { ...acc, [newPath]: value };
  }, {});
}

/**
 * Преобразует многомерный массив в одномерный
 * @param {*[][]} arrayOfArrays многомерный массив данных
 * @return {array} одноменрынй массив
 */
function flattenArrayOfArrays(arrayOfArrays) {
  return [].concat.apply([], arrayOfArrays);
}

/**
 * Парсит csv
 * @param {string} csvString csv в строковом формате
 * @param {string} delimiter разделитель
 * @return {Array.<string,number>} массив данных
 */
function parseCsv(csvString, delimiter) {
  var sanitizedString = csvString.replace(
    /(["'])(?:(?=(\\?))\2[\s\S])*?\1/g,
    function (e) {
      return e.replace(/\r?\n|\r/g, " ");
    }
  );
  return Utilities.parseCsv(sanitizedString, delimiter);
}

/**
 * Возвращает уникальные значения из одномерного массива
 * @param {array} arr массив
 * @return {array} массив уникальных значений
 */
function uniqueFromArrayUseSet(arr) {
  return Array.from(new Set(arr));
}

/**
 * Возвращает уникальные значения из одномерного массива
 * @param {array} arr массив
 * @return {array} массив уникальных значений
 */
function uniqueFromArrayUsePush(arr) {
  let result = [];
  for (let str of arr[0]) {
    if (!result.includes(str[1])) {
      result.push(str);
    }
  }
  return result;
}

/**
 * Возвращает уникальные значения из любого массива
 * @param {array} arr массив
 * @param {object} key ключ, по умолчанию JSON.stringify (для многомерного массива)
 * @return {array} массив уникальных значений
 */
function uniqueByKeyFromAnyArray(arr, key = JSON.stringify) {
  var seen = {};
  return arr.filter(function (item) {
    var k = key(item);
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  });
}

/**
 * Удаляет дубликаты на листе
 * @param {SpreadsheetApp.Sheet} sh ссылка на лист
 */
function removeDuplicates(sh) {
  sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).removeDuplicates();
}

/**
 * Удаляет дубликаты на листе с заданного столбца
 * @param {SpreadsheetApp.Sheet} sh ссылка на лист
 * @param {number} col стартовый столбец
 */
function removeDuplicatesByColNative(sh, col) {
  if (col === 1)
    sh.getRange(1, col, sh.getMaxRows(), sh.getMaxColumns()).removeDuplicates();
  else
    sh.getRange(
      1,
      col,
      sh.getMaxRows(),
      sh.getMaxColumns() - (col - 1)
    ).removeDuplicates();
}

/**
 * Возвращает список уникальных занчений по выбранному столбцу
 * @param {*[][]} originalArray исходный массив
 * @param {number} col столбец по которому идет отбор
 * @return {*[][]} массив уникальных значений
 */
function deleteDuplicatesByCol(originalArray, col) {
  originalArray = originalArray.sort((x, y) => x[col] - y[col]);

  let checkArray = [],
    newArray = [],
    checkValue;
  for (let i = 0; i < originalArray.length; i++) {
    checkValue = Number(originalArray[i][col]); // а если значение в столбце String???
    if (!checkArray.includes(checkValue) && checkValue != "") {
      checkArray.push(checkValue);
      newArray.push(originalArray[i]);
    }
  }

  return uniqueFromArrayUsePush(newArray, JSON.stringify);
}

/**
 * Получить название текущего месяца прописью
 * @return {string} возвращает навзание текущего месяца прописью: Январь
 */
function textCurrentMonth() {
  var month = new Date().toLocaleString("RU", { month: "long" });
  return month[0].toUpperCase() + month.slice(1);
}

/**
 * Получить название прошедшего месяца прописью
 * @return {string} возвращает навзание прошедшего месяца прописью: Январь
 */
function textLastMonth() {
  let date = new Date();
  date = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  var month = date.toLocaleString("ru", { month: "long" });
  return month[0].toUpperCase() + month.slice(1);
}

/**
 * Устанавливает сетку для всех ячеек таблицы
 * @param {SpreadsheetApp.Sheet} sh лист книги
 * @param {number} row стартовая строка
 */
function setBorders(sh, row) {
  sh.getRange(row, 1, sh.getMaxRows(), sh.getMaxColumns()).setBorder(
    true,
    true,
    true,
    true,
    true,
    true,
    "#000000",
    SpreadsheetApp.BorderStyle.SOLID
  );
}

/**
 * Устанавливает сетку для ячеек таблицы по указанному диапазону
 * @param {SpreadsheetApp.Sheet} sh лист книги
 * @param {number} row стартовая строка
 * @param {number} col стартовый столбец
 * @param {number} rows количество строк
 * @param {number} columns количество столбцов
 */
function setBordersByRange(sh, row, col, rows, columns) {
  sh.getRange(row, col, rows, columns).setBorder(
    true,
    true,
    true,
    true,
    true,
    true,
    "#000000",
    SpreadsheetApp.BorderStyle.SOLID
  );
}

/**
 * Получает ID книги SpreadsheetApp по URL
 * @param {string} url ссылка на книгу
 * @return {(string|null)} id книги или ничего
 */
function getIdFromUrl(url) {
  if (!url) return "";
  return url.match(/[-\w]{25,}/);
}

/**
 * Разделяет массив на равные части
 * @param {*[]} arr массив данных
 * @param {number} chunk число, на которое нужно нарезать массив
 * @return {[[*]]} массив разделенный на chunk частей
 */
function chunkArrayFor(arr, chunk) {
  const newArray = [];
  for (let i = 0; i < arr.length; i += chunk) {
    newArray.push(arr.slice(i, i + chunk));
  }
  return newArray;
}

/**
 * Разделяет массив на равные части
 * @param {*[]} arr массив данных
 * @param {number} chunk число, на которое нужно нарезать массив
 * @return {[[*]]} массив разделенный на chunk частей
 */
function chunkArrayForRound(arr, chunk) {
  const result = [];
  for (let i = 0; i < Math.ceil(arr.length / chunk); i++) {
    result.push(arr.slice(i * chunk, i * chunk + chunk));
  }
  return result;
}

/**
 * Разделяет массив на равные части
 * @param {*[]} arr массив данных
 * @param {number} len число, на которое нужно нарезать массив
 * @return {[[*]]} массив разделенный на chunk частей
 */
const chunkArrayWile = (arr, chunk) => {
  if (!arr.length) return [arr];

  const chunks = [];
  while (arr.length > 0) {
    chunks.push(arr.splice(0, chunk));
  }

  return chunks;
};

/**
 * Ищет последнюю заполненную строку в выбранном столбце
 * @param {SpreadsheetApp.Sheet} sh ссылка на лист
 * @param {string} col столбец для поиска, пример: "A"
 * @return {number} номер последней заполненной строки
 */
function lastRow(sh, col) {
  var values = sh.getRange(col + ":" + col).getValues();
  var lr;
  for (var i = values.length - 1; i >= 0; i--) {
    if (values[i][0]) {
      lr = i + 1;
      break;
    }
  }
  return lr;
}

/**
 * Удаляет пустые столбцы на листе
 * @param {SpreadsheetApp.Sheet} sh ссылка на лист
 */
function removeEmptyColumns(sh) {
  var maxColumns = sh.getMaxColumns();
  var lastColumn = sh.getLastColumn();
  if (maxColumns - lastColumn != 0) {
    sh.deleteColumns(lastColumn + 1, maxColumns - lastColumn);
  }
}

/**
 * Удаляет пустые строки на листе
 * @param {SpreadsheetApp.Sheet} sh ссылка на лист
 * @param {number} shlr с какой строки нужно удлаять
 */
function removeEmptyRows(sh, wr = 0) {
  var maxRows = sh.getMaxRows();
  let lastRow;
  if (wr === 0) lastRow = sh.getLastRow();
  else lastRow = wr;
  if (maxRows - lastRow != 0) {
    sh.deleteRows(lastRow + 1, maxRows - lastRow);
  }
}

/**
 * Устанавливает формат строки заголовка на листе
 * @param {SpreadsheetApp.Sheet} sh ссылка на лист
 */
function setHead(sh) {
  // sh.clear();
  // sh.clear({ contentsOnly: true, skipFilteredRows: false });
  // sh.clearContent();
  sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).clear({
    contentsOnly: true,
    skipFilteredRows: false,
  });
  sh.getRange("1:1")
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("center")
    .setBackground("#434343")
    .setFontSize(9)
    .setFontColor("BACKGROUND")
    .setFontWeight("bold")
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      "#ffffff",
      SpreadsheetApp.BorderStyle.SOLID
    )
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sh.setFrozenRows(1);
}

/**
 * Удаляет пробелы слева и справа trim
 * @param {SpreadsheetApp.Sheet} sh ссылка на лист
 */
function trimWhitespace(sh) {
  sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).trimWhitespace();
}

/**
 * Логирование ошибок в консоле при выполнении скрипта
 * @param {Error} err ошибка
 */
function logerError(err) {
  console.log(err.stack);
  ss.toast(err.stack, "⚠️ОШИБКА", 10);
}

/**
 * Переворот массива (столбец в строку переворот)
 * @param {*[][]} arr массив данных
 * @return перевернутый массив
 */
function transposeArray(arr) {
  return Object.keys(arr[0]).map((c) => arr.map((r) => r[c]));
}

/**
 * Копирует активный лист в выбранную книгу по ID книги
 * @param {string} id книги в которую копируем лист
 */
function copyActiveSheet() {
  const sh = SpreadsheetApp.getActiveSheet();
  const name = sh.getName();
  const ui = SpreadsheetApp.getUi();
  const copyInSheetId = ui
    .prompt("Введите ID книги в которую копируем лист", ui.ButtonSet.OK)
    .getResponseText();

  if (copyInSheetId) {
    const ssPaste = SpreadsheetApp.openById(copyInSheetId); // ID листа куда копируем
    sh.copyTo(ssPaste).setName(name);
  } else ui.alert(`ID не введён!!!`);
}

/**
 * Ищет строку по значению
 * @param {*[][]} arr массив данных
 * @param {number} col столбец для поиска, пример: 5
 * @param {string} serch значение для поиска
 * @return {number} номер строки для первого найденного значения
 */
function serchRow(arr, column, serch) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][column] === serch) {
      var row = i + 1;
      break;
    }
  }
  return row;
}

/**
 * Формирует RichText ссылку на лист
 * @param {SpreadsheetApp.Sheet} sh ссылка на лист
 * @param {string} name навзание
 * @param {string} id номер листа
 * @param {number} row строка для вставки
 * @param {number} col столбец для вставки
 */
function setRichText(sh, name, id, row, col) {
  const link = SpreadsheetApp.newRichTextValue()
    .setText(name)
    .setLinkUrl(`#gid=${id}`)
    .build();

  sh.getRange(row, col).setRichTextValue(link);
}

/**
 * Возвращает список листов в книге
 * @param {SpreadsheetApp} ss ссылка на книгу
 * @param {[*]} stopList список запрещенных листов
 * @return {[*]}
 */
function sheetsList(ss, stopList) {
  const allsheets = ss.getSheets();

  var list = [];
  for (var s in allsheets) {
    let name = allsheets[s].getName();

    if (stopList && !stopList.includes(name)) {
      list.push(name);
    }

    if (!stopList) {
      list.push(name);
    }
  }

  return list;
}

/**
 * Возвращает список листов в книге используя for
 */
function sheetNamesFor() {
  let out = [];
  const sh = SpreadsheetApp.getActive().getSheets();
  for (var s in sh) out.push([sh[s].getName()]);
  return out;
}

/**
 * Возвращает список листов в книге используя map
 */
function sheetNamesMap() {
  return SpreadsheetApp.getActiveSpreadsheet()
    .getSheets()
    .map((s) => [s.getName()]);
}

/**
 * Возвращает название текущего листа
 */
function sheetName() {
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName();
}

/**
 * Convert a cell reference from A1Notation to 0-based indices (for arrays)
 * or 1-based indices (for Spreadsheet Service methods).
 * @param {string}    cellA1   Cell reference to be converted.
 * @param {number}    index    (optional, default 0) Indicate 0 or 1 indexing
 * @return {object}            {row,col}, both 0-based array indices.
 * @throws                     Error if invalid parameter
 */
function cellA1ToIndex(cellA1, index) {
  // Ensure index is (default) 0 or 1, no other values accepted.
  index = index || 0;
  index = index == 0 ? 0 : 1;

  // Use regex match to find column & row references.
  // Must start with letters, end with numbers.
  // This regex still allows induhviduals to provide illegal strings like "AB.#%123"
  var match = cellA1.match(/(^[A-Z]+)|([0-9]+$)/gm);

  if (match.length != 2) throw new Error("Invalid cell reference");

  var colA1 = match[0];
  var rowA1 = match[1];

  return [rowA1ToIndex(rowA1, index), colA1ToIndex(colA1, index)];
}

/**
 * Return a 0-based array index corresponding to a spreadsheet column
 * label, as in A1 notation.
 * @param {string}    colA1    Column label to be converted.
 * @param {number}    index    (optional, default 0) Indicate 0 or 1 indexing
 * @return {number}            0-based array index.
 * @throws                     Error if invalid parameter
 */
function colA1ToIndex(colA1, index) {
  if (typeof colA1 !== "string" || colA1.length > 2)
    throw new Error("Expected column label.");

  // Ensure index is (default) 0 or 1, no other values accepted.
  index = index || 0;
  index = index == 0 ? 0 : 1;

  var A = "A".charCodeAt(0);

  var number = colA1.charCodeAt(colA1.length - 1) - A;
  if (colA1.length == 2) {
    number += 26 * (colA1.charCodeAt(0) - A + 1);
  }
  return number + index;
}

/**
 * Return a 0-based array index corresponding to a spreadsheet row
 * number, as in A1 notation. Almost pointless, really, but maintains
 * symmetry with colA1ToIndex().
 * @param {number}    rowA1    Row number to be converted.
 * @param {number}    index    (optional, default 0) Indicate 0 or 1 indexing
 * @return {number}            0-based array index.
 */
function rowA1ToIndex(rowA1, index) {
  // Ensure index is (default) 0 or 1, no other values accepted.
  index = index || 0;
  index = index == 0 ? 0 : 1;

  return rowA1 - 1 + index;
}

/**
 * Преобразует таблицу в PDF по заданному диапазону
 * @param {SpreadsheetApp} spreadsheet книга
 * @param {SpreadsheetApp.Sheet} sheet лист книги
 * @param {string} filename название файла
 * @param {string} range диапазон, например "A1:C10"
 * @param {number} scale масштаб: Обычный 100% - 1,Выровнять по ширине - 2, Выровнять по высоте - 3, По размеру страницы - 4
 */
function toPdfRange(ss, sh, range, filename, scale) {
  let rangeLink;
  if (range) {
    range = range.split(":");
    const [r1, c1] = cellA1ToIndex(range[0]);
    const [r2, c2] = cellA1ToIndex(range[1]);
    rangeLink = `&r1=${r1}&c1=${c1}&r2=${r2}&c2=${c2 + 1}`;
  }

  var url =
    "https://docs.google.com/spreadsheets/export?id=" +
    ss.getId() +
    "&gid=" +
    sh.getSheetId() +
    "&exportFormat=pdf" +
    (scale ? `&scale=${scale}` : "&scale=4") + // 1= Normal 100% / 2= Fit to width / 3= Fit to height / 4= Fit to Page
    (range ? rangeLink : "") +
    "&fitw=true" +
    "&size=A4" + //A3/A4/A5/B4/B5/letter/tabloid/legal/statement/executive/folio
    "&portrait=true" + //true=Potrait / false=Landscape
    "&gridlines=false" +
    "&vertical_alignment=TOP";

  // другие параметры превращение в PDF смотрите здесь: https://stackoverflow.com/questions/46088042/margins-parameters-for-spreadsheet-export/46312255#46312255

  return UrlFetchApp.fetch(url, {
    method: "POST",
    muteHttpExceptions: true,
    headers: { Authorization: `Bearer ${ScriptApp.getOAuthToken()}` },
  })
    .getBlob()
    .setName(filename + ".pdf"); //.getAs(MimeType.PDF)
}

/**
 * Преобразует диапазон в таблицу в PNG
 * @param {SpreadsheetApp.Sheet} sheet лист книги
 * @param {string} filename название файла
 * @param {string} range диапазон, например "A1:C10"
 */
function toPhotoRange(sh, range, filename, type = "png") {
  const [header, ...values] = sh.getRange(range).getDisplayValues();
  const table = Charts.newDataTable();
  header.forEach((e) => table.addColumn(Charts.ColumnType.STRING, e));
  values.forEach((e) => table.addRow(e));
  return Charts.newTableChart()
    .setDataTable(table.build())
    .setDimensions(500, 500)
    .setOption("alternatingRowStyle", false)
    .build()
    .getBlob()
    .setName(`${filename}.${type}`);
}

/**
 * Преобразует таблицу в PDF
 * @param {SpreadsheetApp} spreadsheet книга
 * @param {SpreadsheetApp.Sheet} sheet лист книги
 * @param {string} filename название файла
 * @param {string} size размер бумаги: A3/A4/A5/B4/B5/letter/tabloid/legal/statement/executive/folio
 * @param {boolean} portrait ориентация страницы: горизонтальная true, вртикальная - false
 * @param {number} scale масштаб: Обычный 100% - 1,Выровнять по ширине - 2, Выровнять по высоте - 3, По размеру страницы - 4
 * @param {boolean} margin отступы по краям
 */
function toPdfOptions({
  spreadsheet,
  sheet,
  filename,
  scale,
  margin = false,
  size,
  portrait,
}) {
  var url =
    "https://docs.google.com/spreadsheets/export?id=" +
    spreadsheet.getId() +
    "&gid=" +
    sheet.getSheetId() +
    "&exportFormat=pdf" + // export format
    "&fitw=true" +
    (size ? `&size=${size}` : "&size=A4") + // A3/A4/A5/B4/B5/letter/tabloid/legal/statement/executive/folio
    (portrait ? `&portrait=${portrait}` : "&portrait=true") + // true=Potrait / false=Landscape
    (scale ? `&scale=${scale}` : "") + // 1= Normal 100% / 2= Fit to width / 3= Fit to height / 4= Fit to Page
    (margin
      ? "&top_margin=0.1&left_margin=0.1&right_margin=0.1&bottom_margin=0.1"
      : "") + // All four margins must be set!
    // + "&vertical_alignment=TOP" // TOP/MIDDLE/BOTTOM
    "&horizontal_alignment=CENTER" + // LEFT/CENTER/RIGHT
    "&gridlines=false" + // true/false
    "&printnotes=false"; // true/false
  // + "&pageorder=2" // 1= Down, then over / 2= Over, then down
  // + "&printtitle=false" // true/false
  // + "&sheetnames=false" // true/false c
  // + "&fzr=false" // true/false
  // + "&fzc=false" // true/false
  // + "&attachment=false" // true/false

  return UrlFetchApp.fetch(url, {
    method: "POST",
    muteHttpExceptions: true,
    headers: { Authorization: `Bearer ${ScriptApp.getOAuthToken()}` },
  })
    .getBlob()
    .setName(filename + ".pdf"); //.getAs(MimeType.PDF)
}

/**
 * Конвертирует в изображение PNG, JPG или документ PDF
 * @param {string} img_url ссылка на файл
 * @param {string} filename название файла
 * @param {string} type расширение файла
 * @return {Blob} blob
 */
function convertPhotoTo(img_url, filename, type = "png") {
  return UrlFetchApp.fetch(img_url)
    .getBlob()
    .getAs(`MimeType.${type.toLocaleUpperCase()}`)
    .setName(`${filename}.${type}`);
}

/**
 * Выполняет транслитерацию переданного текста
 * @param {string} word текст для транслитерации
 * @return {string} новый текст
 */
function translit(word) {
  var answer = "";
  var converter = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ь: "",
    ы: "y",
    ъ: "",
    э: "e",
    ю: "yu",
    я: "ya",
    А: "A",
    Б: "B",
    В: "V",
    Г: "G",
    Д: "D",
    Е: "E",
    Ё: "E",
    Ж: "Zh",
    З: "Z",
    И: "I",
    Й: "Y",
    К: "K",
    Л: "L",
    М: "M",
    Н: "N",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    У: "U",
    Ф: "F",
    Х: "H",
    Ц: "C",
    Ч: "Ch",
    Ш: "Sh",
    Щ: "Sch",
    Ь: "",
    Ы: "Y",
    Ъ: "",
    Э: "E",
    Ю: "Yu",
    Я: "Ya",
  };

  for (var i = 0; i < word.length; ++i) {
    if (converter[word[i]] == undefined) answer += word[i];
    else answer += converter[word[i]];
  }

  return answer;
}

/**
 * Рандомизатор с проверкой
 * @param {[*]} arr одномерный массив данных
 * @param {number} n количество элементов на выходе
 * @return {[*]} n рандомных элементов из массива
 */
function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: взято больше элементов, чем доступно");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result.sort(() => 0.5 - Math.random());
}

/**
 * Рандомизатор без проверки
 * @param {[*]} arr одномерный массив данных
 * @param {number} n количество элементов на выходе
 * @return {[*]} n рандомных элементов из массива
 */
function getRandomLite(array, n) {
  return array.sort(() => 0.5 - Math.random()).slice(0, n);
}

/**
 * Рандомизатор без проверки
 * @param {[*]} arr одномерный массив данных
 * @return {string} рандомный элемент из массива
 */
function getRandomArrayElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Парсинг объекта по типу
 * @param {object} data объект
 * @return {object|JSON} data
 */
function parseDataByType(data) {
  if (!data) return {};
  if (typeof data === "object") {
    console.log("object");
    return data;
  }

  if (typeof data === "string") {
    console.log("string");
    return JSON.parse(data);
  }
  return {};
}

/**
 * Получить содержимое файла JSON сохраненного на oogle Диске
 * @param {string} fileId id файла на Google Диске
 * @return {JSON} объект JSON
 */
function getFileJsonContentById(fileId) {
  return JSON.parse(DriveApp.getFileById(fileId).getBlob().getDataAsString());
}

/**
 * Получить содержимое файла JSON сохраненного на oogle Диске
 * @param {string} fileName название файла на Google Диске
 * @return {JSON} объект JSON
 */
function getFileJsonContentByFileName(fileName) {
  var files = DriveApp.getFilesByName(fileName);
  if (files.hasNext()) {
    var file = files.next();
    return JSON.parse(file.getBlob().getDataAsString());
  }
}

/**
 * Преобразует формат даты в переданном массиве
 * @param {*[][]} arr массив данных
 * @param {string} timeZone пример "GMT+03:00"
 * @param {string} format пример "dd.MM.yy"
 * @return {*[][]} массив с преобразованными датами
 */
function dateFormat(arr, timeZone, format = "dd.MM.yy") {
  return arr.map((r) =>
    r.map((c) =>
      c && c.getTime
        ? Utilities.formatDate(
            c,
            timeZone | Session.getScriptTimeZone(),
            format
          )
        : c
    )
  );
}

/**
 * Активировать лист
 * @param {SpreadsheetApp.ActiveSpreadsheet} ss книга
 * @param {string} name имя листа
 */
function activateSheet(name) {
  if (ss.getSheetByName(name).activate()) {
    SpreadsheetApp.setActiveSheet(ss.getSheetByName(name));
  }
}
