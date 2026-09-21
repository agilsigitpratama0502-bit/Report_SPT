const API_URL =
  "https://script.google.com/macros/s/AKfycbwYd1NcgOO8xsTQZpkX8Kip9aWuZ6AkTpuzRsvFeHpBXjIxS5wIDRaCZd9P0WKgDYBR/exec";


const container =
  document.getElementById("sheet-container");

const loading =
  document.getElementById("loading");

const errorBox =
  document.getElementById("error");


// =========================================
// LOAD DATA
// =========================================

async function loadSheet() {

  try {

    const response =
      await fetch(API_URL);


    if (!response.ok) {

      throw new Error(
        "Gagal mengambil data dari Apps Script."
      );

    }


    const result =
      await response.json();


    if (result.error) {

      throw new Error(
        result.error
      );

    }


    buildSheet(result);


    loading.style.display =
      "none";


  } catch (error) {

    loading.style.display =
      "none";


    errorBox.style.display =
      "block";


    errorBox.textContent =
      "Gagal memuat Report SPT: " +
      error.message;


    console.error(error);

  }

}


// =========================================
// BUILD SHEET
// =========================================

function buildSheet(result) {

  const data =
    result.data || [];


  const backgrounds =
    result.backgrounds || [];


  const fontColors =
    result.fontColors || [];


  const fontFamilies =
    result.fontFamilies || [];


  const fontSizes =
    result.fontSizes || [];


  const fontWeights =
    result.fontWeights || [];


  const fontStyles =
    result.fontStyles || [];


  const horizontalAlignments =
    result.horizontalAlignments || [];


  const verticalAlignments =
    result.verticalAlignments || [];


  const wrapStrategies =
    result.wrapStrategies || [];


  const columnWidths =
    result.columnWidths || [];


  const rowHeights =
    result.rowHeights || [];


  const mergedRanges =
    result.mergedRanges || [];


  const borders =
    result.borders || [];


  // =====================================
  // CEK DATA
  // =====================================

  if (!data.length) {

    throw new Error(
      "Data Spreadsheet kosong."
    );

  }


  const columnCount =
    Math.max(
      ...data.map(
        row => row.length
      )
    );


  // =====================================
  // BUAT SHEET
  // =====================================

  const sheet =
    document.createElement("div");


  sheet.className =
    "sheet";


  // =====================================
  // KOLOM
  // =====================================

  sheet.style.gridTemplateColumns =
    columnWidths.length

      ? columnWidths
          .map(
            width =>
              `${width}px`
          )
          .join(" ")

      : `repeat(${columnCount}, 100px)`;


  // =====================================
  // BARIS
  // =====================================

  sheet.style.gridTemplateRows =
    rowHeights.length

      ? rowHeights
          .map(
            height =>
              `${height}px`
          )
          .join(" ")

      : `repeat(${data.length}, 25px)`;


  // =====================================
  // RESET CONTAINER
  // =====================================

  container.innerHTML = "";


  container.appendChild(
    sheet
  );


  // =====================================
  // MERGE MAP
  // =====================================

  const mergeMap = {};


  mergedRanges.forEach(
    merge => {

      const startRow =
        merge.row - 1;


      const startCol =
        merge.column - 1;


      for (
        let r = startRow;
        r <
        startRow +
        merge.numRows;
        r++
      ) {

        for (
          let c = startCol;
          c <
          startCol +
          merge.numColumns;
          c++
        ) {

          const key =
            `${r}-${c}`;


          // =============================
          // MASTER CELL
          // =============================

          if (
            r === startRow &&
            c === startCol
          ) {

            mergeMap[key] = {

              master: true,

              rowSpan:
                merge.numRows,

              colSpan:
                merge.numColumns

            };


          } else {

            // ===========================
            // CELL TERGABUNG
            // ===========================

            mergeMap[key] = {

              master: false

            };

          }

        }

      }

    }
  );


  // =====================================
  // BUAT CELL
  // =====================================

  data.forEach(
    (row, rowIndex) => {

      for (
        let colIndex = 0;
        colIndex < columnCount;
        colIndex++
      ) {

        const key =
          `${rowIndex}-${colIndex}`;


        const merge =
          mergeMap[key];


        // =================================
        // SKIP CELL HASIL MERGE
        // =================================

        if (
          merge &&
          !merge.master
        ) {

          continue;

        }


        // =================================
        // BUAT CELL
        // =================================

        const cell =
          document.createElement(
            "div"
          );


        cell.className =
          "cell";


        // =================================
        // POSISI GRID
        // =================================

        cell.style.gridRow =
          rowIndex + 1;


        cell.style.gridColumn =
          colIndex + 1;


        // =================================
        // MERGE
        // =================================

        if (
          merge &&
          merge.master
        ) {

          if (
            merge.rowSpan > 1
          ) {

            cell.style.gridRow =
              `${rowIndex + 1} / span ${merge.rowSpan}`;

          }


          if (
            merge.colSpan > 1
          ) {

            cell.style.gridColumn =
              `${colIndex + 1} / span ${merge.colSpan}`;

          }


          cell.classList.add(
            "merged"
          );

        }


        // =================================
        // VALUE
        // =================================

        const value =
          data[rowIndex]?.[
            colIndex
          ] ?? "";


        // =================================
        // TEXT
        // =================================

        const text =
          document.createElement(
            "span"
          );


        text.className =
          "cell-text";


        text.textContent =
          value;


        text.style.display =
          "block";


        text.style.width =
          "100%";


        text.style.minWidth =
          "0";


        text.style.boxSizing =
          "border-box";


        cell.appendChild(
          text
        );


        // =================================
        // VALUE CLASS
        // =================================

        if (
          value !== ""
        ) {

          cell.classList.add(
            "has-value"
          );

        }


        // =================================
        // BACKGROUND
        // =================================

        if (
          backgrounds[rowIndex] &&
          backgrounds[rowIndex][colIndex]
        ) {

          cell.style.background =
            backgrounds[
              rowIndex
            ][
              colIndex
            ];

        }


        // =================================
        // FONT COLOR
        // =================================

        if (
          fontColors[rowIndex] &&
          fontColors[rowIndex][colIndex]
        ) {

          cell.style.color =
            fontColors[
              rowIndex
            ][
              colIndex
            ];

        }


        // =================================
        // FONT FAMILY
        // =================================

        if (
          fontFamilies[rowIndex] &&
          fontFamilies[rowIndex][colIndex]
        ) {

          cell.style.fontFamily =
            fontFamilies[
              rowIndex
            ][
              colIndex
            ];

        }


        // =================================
        // FONT SIZE
        // =================================

        if (
          fontSizes[rowIndex] &&
          fontSizes[rowIndex][colIndex]
        ) {

          cell.style.fontSize =
            fontSizes[
              rowIndex
            ][
              colIndex
            ] + "px";

        }


        // =================================
        // FONT WEIGHT
        // =================================

        if (
          fontWeights[rowIndex] &&
          fontWeights[rowIndex][colIndex]
        ) {

          cell.style.fontWeight =
            fontWeights[
              rowIndex
            ][
              colIndex
            ];

        }


        // =================================
        // FONT STYLE
        // =================================

        if (
          fontStyles[rowIndex] &&
          fontStyles[rowIndex][colIndex]
        ) {

          cell.style.fontStyle =
            fontStyles[
              rowIndex
            ][
              colIndex
            ];

        }


        // =====================================
        // HORIZONTAL ALIGNMENT
        // =====================================

        let alignment = "";


        if (
          horizontalAlignments[rowIndex] &&
          horizontalAlignments[rowIndex][colIndex]
        ) {

          alignment =
            horizontalAlignments[
              rowIndex
            ][
              colIndex
            ];

        }


        // =====================================
        // NORMALISASI ALIGNMENT
        // =====================================

        alignment =
          normalizeAlignment(
            alignment
          );


        // =====================================
        // FALLBACK MERGED CELL
        // =====================================

        /*
          Jika cell merupakan merge beberapa
          kolom dan alignment dari API kosong,
          gunakan CENTER.

          Ini membantu heading seperti:

          PT. SINAR EMAS KAHURIPAN
          ALL MODUL
          TERAKHIR DI INPUT
          MODUL BORONG
          MODUL TRAINING
        */

        if (
          !alignment &&
          merge &&
          merge.master &&
          merge.colSpan > 1
        ) {

          alignment =
            "CENTER";

        }


        // =====================================
        // TERAPKAN HORIZONTAL ALIGNMENT
        // =====================================

        if (alignment) {

          cell.style.justifyContent =
            convertHorizontalAlignment(
              alignment
            );


          text.style.textAlign =
            convertTextAlignment(
              alignment
            );

        }


        // =====================================
        // VERTICAL ALIGNMENT
        // =====================================

        if (
          verticalAlignments[rowIndex] &&
          verticalAlignments[rowIndex][colIndex]
        ) {

          const vertical =
            verticalAlignments[
              rowIndex
            ][
              colIndex
            ];


          cell.style.alignItems =
            convertVerticalAlignment(
              vertical
            );

        }


        // =====================================
        // WRAP
        // =====================================

        if (
          wrapStrategies[rowIndex] &&
          wrapStrategies[rowIndex][colIndex]
        ) {

          const wrap =
            wrapStrategies[
              rowIndex
            ][
              colIndex
            ];


          switch (wrap) {

            // ===============================
            // WRAP
            // ===============================

            case "WRAP":

              cell.style.whiteSpace =
                "normal";


              cell.style.wordBreak =
                "break-word";


              cell.style.overflow =
                "hidden";


              text.style.whiteSpace =
                "normal";


              text.style.wordBreak =
                "break-word";


              break;


            // ===============================
            // CLIP
            // ===============================

            case "CLIP":

              cell.style.whiteSpace =
                "nowrap";


              cell.style.overflow =
                "hidden";


              text.style.whiteSpace =
                "nowrap";


              break;


            // ===============================
            // OVERFLOW
            // ===============================

            case "OVERFLOW":

              cell.style.whiteSpace =
                "nowrap";


              cell.style.overflow =
                "visible";


              text.style.whiteSpace =
                "nowrap";


              break;


            // ===============================
            // DEFAULT
            // ===============================

            default:

              cell.style.whiteSpace =
                "pre-wrap";


              text.style.whiteSpace =
                "pre-wrap";

          }

        }


        // =====================================
        // BORDER
        // =====================================

        if (
          borders[rowIndex] &&
          borders[rowIndex][colIndex]
        ) {

          const border =
            borders[
              rowIndex
            ][
              colIndex
            ];


          applyBorder(
            cell,
            border
          );

        }


        // =====================================
        // MASUKKAN CELL
        // =====================================

        sheet.appendChild(
          cell
        );

      }

    }
  );

  // =====================================
  // FIT KE LAYAR
  // =====================================

  setTimeout(
    fitSheetToScreen,
    100
  );

}

// =========================================
// AUTO FIT SHEET KE LAYAR
// =========================================



// =========================================
// NORMALISASI ALIGNMENT
// =========================================

function normalizeAlignment(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  const alignment =
    String(value)
      .trim()
      .toUpperCase();


  switch (alignment) {

    case "LEFT":
      return "LEFT";


    case "CENTER":
      return "CENTER";


    case "RIGHT":
      return "RIGHT";


    case "JUSTIFY":
      return "JUSTIFY";


    case "NORMAL":
      return "NORMAL";


    case "GENERAL":
      return "GENERAL";


    default:
      return "";

  }

}


// =========================================
// HORIZONTAL ALIGNMENT - FLEX
// =========================================

function convertHorizontalAlignment(
  value
) {

  const alignment =
    normalizeAlignment(
      value
    );


  switch (alignment) {

    case "LEFT":

      return "flex-start";


    case "CENTER":

      return "center";


    case "RIGHT":

      return "flex-end";


    case "JUSTIFY":

      return "flex-start";


    case "NORMAL":
    case "GENERAL":

      return "flex-start";


    default:

      return "flex-start";

  }

}


// =========================================
// HORIZONTAL ALIGNMENT - TEXT
// =========================================

function convertTextAlignment(
  value
) {

  const alignment =
    normalizeAlignment(
      value
    );


  switch (alignment) {

    case "LEFT":

      return "left";


    case "CENTER":

      return "center";


    case "RIGHT":

      return "right";


    case "JUSTIFY":

      return "justify";


    case "NORMAL":
    case "GENERAL":

      return "left";


    default:

      return "left";

  }

}


// =========================================
// VERTICAL ALIGNMENT
// =========================================

function convertVerticalAlignment(
  value
) {

  const alignment =
    String(value || "")
      .trim()
      .toUpperCase();


  switch (alignment) {

    case "TOP":

      return "flex-start";


    case "MIDDLE":

      return "center";


    case "BOTTOM":

      return "flex-end";


    default:

      return "center";

  }

}


// =========================================
// APPLY BORDER
// =========================================

function applyBorder(
  cell,
  border
) {

  if (!border) {

    return;

  }


  // =====================================
  // TOP
  // =====================================

  if (border.top) {

    cell.style.borderTop =
      convertBorderCSS(
        border.top
      );

  }


  // =====================================
  // BOTTOM
  // =====================================

  if (border.bottom) {

    cell.style.borderBottom =
      convertBorderCSS(
        border.bottom
      );

  }


  // =====================================
  // LEFT
  // =====================================

  if (border.left) {

    cell.style.borderLeft =
      convertBorderCSS(
        border.left
      );

  }


  // =====================================
  // RIGHT
  // =====================================

  if (border.right) {

    cell.style.borderRight =
      convertBorderCSS(
        border.right
      );

  }

}


// =========================================
// KONVERSI BORDER
// =========================================

function convertBorderCSS(
  border
) {

  if (
    !border ||
    !border.style ||
    border.style === "NONE"
  ) {

    return "none";

  }


  let width =
    "1px";


  let style =
    "solid";


  switch (
    border.style
  ) {

    case "DOTTED":

      width =
        "1px";

      style =
        "dotted";

      break;


    case "DASHED":

      width =
        "1px";

      style =
        "dashed";

      break;


    case "SOLID":

      width =
        "1px";

      style =
        "solid";

      break;


    case "SOLID_MEDIUM":

      width =
        "2px";

      style =
        "solid";

      break;


    case "SOLID_THICK":

      width =
        "3px";

      style =
        "solid";

      break;


    case "DOUBLE":

      width =
        "3px";

      style =
        "double";

      break;


    default:

      width =
        "1px";

      style =
        "solid";

  }


  const color =
    border.color ||
    "#000000";


  return (
    width +
    " " +
    style +
    " " +
    color
  );

}


// =========================================
// AUTO FIT SHEET KE LAYAR
// =========================================




// =========================================
// FIT VIEW KE SELURUH PANEL
// =========================================

function fitSheetToScreen() {

  const sheet =
    document.querySelector(".sheet");

  if (!sheet) {
    return;
  }

  // Reset transform supaya ukuran asli
  // Spreadsheet bisa dihitung dengan benar.
  sheet.style.transform = "scale(1, 1)";

  const sheetWidth =
    sheet.scrollWidth;

  const sheetHeight =
    sheet.scrollHeight;

  // Ukuran PANEL VIEW di dalam iframe.
  // Jangan gunakan ukuran window browser utama.
  const panelWidth =
    container.clientWidth;

  const panelHeight =
    container.clientHeight;

  if (
    !sheetWidth ||
    !sheetHeight ||
    !panelWidth ||
    !panelHeight
  ) {
    return;
  }

  // =========================================
  // ISI SELURUH AREA PANEL
  // =========================================
  //
  // X dan Y dihitung terpisah supaya dashboard
  // benar-benar memenuhi panel VIEW.
  //
  // Ini memang dapat sedikit meregangkan proporsi
  // Spreadsheet, tetapi tidak membuat ruang kosong
  // di bawah atau di samping dashboard.

  const scaleX =
    panelWidth / sheetWidth;

  const scaleY =
    panelHeight / sheetHeight;

  sheet.style.transform =
    `scale(${scaleX}, ${scaleY})`;

  sheet.style.transformOrigin =
    "top left";

  // Container tetap mengikuti ukuran panel.
  // Jangan mengubah width/height container
  // menjadi ukuran sheet hasil scale.
  container.style.width =
    "100%";

  container.style.height =
    "100%";
}


// =========================================
// JALANKAN SETELAH SHEET SELESAI
// =========================================

window.addEventListener(
  "resize",
  () => {

    fitSheetToScreen();

  }
);

loadSheet();