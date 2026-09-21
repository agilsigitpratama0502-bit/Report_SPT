// =========================================
// VIEW
// =========================================

(() => {

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
      await fetch(
        API_URL + "?t=" + Date.now()
      );


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


    // Loading hanya disembunyikan,
    // tidak pernah ditampilkan lagi
    loading.style.display =
      "none";


    // Hilangkan error jika update berhasil
    errorBox.style.display =
      "none";


  } catch (error) {

    // Jangan membuat dashboard menjadi loading lagi
    loading.style.display =
      "none";


    // Error tetap dicatat di console
    console.error(
      "Gagal update Report SPT:",
      error
    );

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
  500
);

setTimeout(
  fitSheetToScreen,
  1000
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

  const panelWidth =
    container.clientWidth;

  const panelHeight =
    container.clientHeight;

  if (!panelWidth || !panelHeight) {
    return;
  }

  // =========================================
  // KEMBALIKAN KE UKURAN ASLI
  // =========================================

  sheet.style.transform = "none";

  // =========================================
  // UKURAN ASLI DASHBOARD
  // =========================================

  const sheetWidth =
    sheet.getBoundingClientRect().width;

  const sheetHeight =
    sheet.getBoundingClientRect().height;

  if (!sheetWidth || !sheetHeight) {
    return;
  }

  // =========================================
  // HITUNG SKALA
  // =========================================

  const scaleX =
    panelWidth / sheetWidth;

  const scaleY =
    panelHeight / sheetHeight;

  // =========================================
  // PERBESAR VIEW
  // =========================================

  sheet.style.transformOrigin =
    "top left";

  sheet.style.transform =
    `scale(${scaleX}, ${scaleY})`;

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

setInterval(() => {

  loadSheet();

}, 10000);
})();



// =========================================
// LIST
// =========================================
const API_URL =
  "https://script.google.com/macros/s/AKfycbxt4bQ6qYB77kuh2CgmTBSR-VT4-IV9zFMagFX1SzwE79Xkus9KhYKhl0GPl4F_K8M/exec";


const container =
  document.getElementById("list-container");


/* =========================================================
   SAFE VALUE
========================================================= */

function safeValue(value) {

  if (
    value === undefined ||
    value === null
  ) {

    return "";

  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   TANGGAL + JAM
========================================================= */

function formatTanggal() {

  const sekarang =
    new Date();

  return {

    tanggal:
      sekarang.toLocaleDateString(
        "id-ID",
        {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric"
        }
      ),

    jam:
      sekarang.toLocaleTimeString(
        "id-ID",
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }
      )

  };

}


/* =========================================================
   LOAD DATA
========================================================= */

async function loadData() {

  container.innerHTML = `
    <div class="list-loading">
      Memuat data LIST...
    </div>
  `;


  try {

    const response =
      await fetch(
        API_URL +
        "?t=" +
        Date.now()
      );


    if (!response.ok) {

      throw new Error(
        "HTTP " +
        response.status
      );

    }


    const result =
      await response.json();


    if (result.error) {

      throw new Error(
        result.error
      );

    }


    renderList(result);

  }
  catch (error) {

    console.error(error);


    container.innerHTML = `

      <div class="list-error">

        <div>
          Gagal memuat data LIST.
        </div>

        <div class="error-detail">
          ${safeValue(error.message)}
        </div>

      </div>

    `;

  }

}


/* =========================================================
   CARI KOLOM MODUL
   Kita hanya tampilkan kolom utama
   sampai "Modul"
========================================================= */

function getMainColumnCount(headers) {

  const indexModul =
    headers.findIndex(
      header =>
        String(header)
          .trim()
          .toLowerCase() ===
        "modul"
    );


  if (indexModul !== -1) {

    return indexModul + 1;

  }


  /*
   * Jika Modul tidak ditemukan,
   * gunakan 15 kolom utama.
   */

  return Math.min(
    15,
    headers.length
  );

}


/* =========================================================
   RENDER LIST
========================================================= */

function renderList(result) {

  const data =
    result.data || [];


  if (!data.length) {

    container.innerHTML = `
      <div class="list-error">
        Tidak ada data.
      </div>
    `;

    return;

  }


  /*
   * HEADER DARI SPREADSHEET
   */

  const allHeaders =
    data[0];


  /*
   * Hanya sampai MODUL
   */

  const columnCount =
    getMainColumnCount(
      allHeaders
    );


  const headers =
    allHeaders.slice(
      0,
      columnCount
    );


  /*
   * DATA
   */

  const rows =
    data
      .slice(1)
      .filter(row => {

        return row.some(
          value =>
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
        );

      });


  const waktu =
    formatTanggal();


  /*
   * Total data
   */

  const totalData =
    rows.length;


  /* =====================================================
     HEADER WEBSITE
  ===================================================== */

  container.innerHTML = `

    <div class="list-header">

      <div class="list-title-area">

        <div class="list-title">
          List Reject SPT
        </div>

        <div class="list-count">
          ${totalData} data berhasil dimuat
        </div>

      </div>


      <div class="list-date-area">

        <div class="list-date">
          ${waktu.tanggal}
        </div>

        <div
          class="list-clock"
          id="list-clock"
        >
          ${waktu.jam}
        </div>

      </div>


      <button
        class="refresh-button"
        onclick="loadData()"
      >
        ↻ Refresh
      </button>

    </div>


    <div
      class="list-table-wrapper"
      id="list-table-wrapper"
    >

      <div
        class="list-table-scale"
        id="list-table-scale"
      >

        <table
          class="reject-table"
          id="reject-table"
        >

          <colgroup>

            ${headers.map(
              (_, columnIndex) => {

                const width =
                  Number(
                    result.columnWidths?.[
                      columnIndex
                    ]
                  ) || 80;


                return `

                  <col
                    style="
                      width:${width}px;
                      min-width:${width}px;
                    "
                  >

                `;

              }
            ).join("")}

          </colgroup>


          <!-- =========================================
               HEADER
          ========================================== -->

          <thead>

            <tr>

              ${headers.map(
                (header, columnIndex) => {

                  const background =
                    result.backgrounds?.[
                      0
                    ]?.[
                      columnIndex
                    ] ||
                    "#0000ff";


                  const fontColor =
                    result.fontColors?.[
                      0
                    ]?.[
                      columnIndex
                    ] ||
                    "#ffffff";


                  const fontFamily =
                    result.fontFamilies?.[
                      0
                    ]?.[
                      columnIndex
                    ] ||
                    "Arial";


                  const fontSize =
                    Number(
                      result.fontSizes?.[
                        0
                      ]?.[
                        columnIndex
                      ]
                    ) || 10;


                  const fontWeight =
                    result.fontWeights?.[
                      0
                    ]?.[
                      columnIndex
                    ] ||
                    "bold";


                  const fontStyle =
                    result.fontStyles?.[
                      0
                    ]?.[
                      columnIndex
                    ] ||
                    "normal";


                  const horizontal =
                    result.horizontalAlignments?.[
                      0
                    ]?.[
                      columnIndex
                    ] ||
                    "center";


                  const vertical =
                    result.verticalAlignments?.[
                      0
                    ]?.[
                      columnIndex
                    ] ||
                    "middle";


                  const rowHeight =
                    Number(
                      result.rowHeights?.[0]
                    ) || 30;


                  return `

                    <th
                      style="
                        width:${Number(result.columnWidths?.[columnIndex]) || 80}px;
                        min-width:${Number(result.columnWidths?.[columnIndex]) || 80}px;
                        height:${rowHeight}px;
                        background:${background};
                        color:${fontColor};
                        font-family:${fontFamily};
                        font-size:${fontSize}px;
                        font-weight:${fontWeight};
                        font-style:${fontStyle};
                        text-align:${horizontal};
                        vertical-align:${vertical};
                      "
                    >

                      ${safeValue(header)}

                    </th>

                  `;

                }
              ).join("")}

            </tr>

          </thead>


          <!-- =========================================
               BODY
          ========================================== -->

          <tbody>

            ${rows.map(
              (row, rowIndex) => {

                /*
                 * Karena data asli dimulai
                 * dari baris ke-2 Spreadsheet,
                 * maka +1.
                 */

                const sourceRow =
                  rowIndex + 1;


                const rowHeight =
                  Number(
                    result.rowHeights?.[
                      sourceRow
                    ]
                  ) || 30;


                return `

                  <tr>

                    ${headers.map(
                      (_, columnIndex) => {

                        const value =
                          row[
                            columnIndex
                          ] ?? "";


                        const background =
                          result.backgrounds?.[
                            sourceRow
                          ]?.[
                            columnIndex
                          ] ||
                          "#ffffff";


                        const fontColor =
                          result.fontColors?.[
                            sourceRow
                          ]?.[
                            columnIndex
                          ] ||
                          "#000000";


                        const fontFamily =
                          result.fontFamilies?.[
                            sourceRow
                          ]?.[
                            columnIndex
                          ] ||
                          "Arial";


                        const fontSize =
                          Number(
                            result.fontSizes?.[
                              sourceRow
                            ]?.[
                              columnIndex
                            ]
                          ) || 10;


                        const fontWeight =
                          result.fontWeights?.[
                            sourceRow
                          ]?.[
                            columnIndex
                          ] ||
                          "normal";


                        const fontStyle =
                          result.fontStyles?.[
                            sourceRow
                          ]?.[
                            columnIndex
                          ] ||
                          "normal";


                        const horizontal =
                          result.horizontalAlignments?.[
                            sourceRow
                          ]?.[
                            columnIndex
                          ] ||
                          "center";


                        const vertical =
                          result.verticalAlignments?.[
                            sourceRow
                          ]?.[
                            columnIndex
                          ] ||
                          "middle";


                        const width =
                          Number(
                            result.columnWidths?.[
                              columnIndex
                            ]
                          ) || 80;


                        return `

                          <td

                            style="
                              width:${width}px;
                              min-width:${width}px;
                              height:${rowHeight}px;

                              background:${background};
                              color:${fontColor};

                              font-family:${fontFamily};
                              font-size:${fontSize}px;
                              font-weight:${fontWeight};
                              font-style:${fontStyle};

                              text-align:${horizontal};
                              vertical-align:${vertical};
                            "

                          >

                            ${safeValue(value)}

                          </td>

                        `;

                      }
                    ).join("")}

                  </tr>

                `;

              }
            ).join("")}

          </tbody>

        </table>

      </div>

    </div>

  `;


  /*
   * Setelah tabel dibuat,
   * sesuaikan dengan area LIST.
   */

  requestAnimationFrame(
    fitListTable
  );

}


/* =========================================================
   FIT TABEL KE AREA LIST
========================================================= */

function fitListTable() {

  const wrapper =
    document.getElementById(
      "list-table-wrapper"
    );


  const scaleBox =
    document.getElementById(
      "list-table-scale"
    );


  const table =
    document.getElementById(
      "reject-table"
    );


  if (
    !wrapper ||
    !scaleBox ||
    !table
  ) {

    return;

  }


  /*
   * Reset terlebih dahulu
   */

  scaleBox.style.transform =
    "scale(1)";


  scaleBox.style.width =
    "max-content";


  scaleBox.style.height =
    "auto";


  /*
   * Ambil ukuran asli tabel
   */

  const originalWidth =
    table.scrollWidth;


  const originalHeight =
    table.scrollHeight;


  /*
   * Ruang yang tersedia
   */

  const availableWidth =
    wrapper.clientWidth - 4;


  const availableHeight =
    wrapper.clientHeight - 4;


  if (
    originalWidth <= 0 ||
    originalHeight <= 0
  ) {

    return;

  }


  /*
   * Skala berdasarkan lebar.
   *
   * Kita prioritaskan seluruh kolom
   * agar semuanya terlihat.
   */

  let scale =
    availableWidth /
    originalWidth;


  /*
   * Jangan diperbesar melebihi
   * ukuran asli Spreadsheet.
   */

  scale =
    Math.min(
      1,
      scale
    );


  /*
   * Jangan terlalu kecil.
   */

  scale =
    Math.max(
      0.45,
      scale
    );


  /*
   * Terapkan scale
   */

  scaleBox.style.width =
    originalWidth + "px";


  scaleBox.style.height =
    (
      originalHeight *
      scale
    ) + "px";


  scaleBox.style.transform =
    `scale(${scale})`;


  scaleBox.style.transformOrigin =
    "top left";

}


/* =========================================================
   UPDATE JAM
========================================================= */

function updateClock() {

  const clock =
    document.getElementById(
      "list-clock"
    );


  if (!clock) {

    return;

  }


  clock.textContent =
    new Date().toLocaleTimeString(
      "id-ID",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    );

}


setInterval(
  updateClock,
  1000
);


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
  "resize",
  () => {

    requestAnimationFrame(
      fitListTable
    );

  }
);


/* =========================================================
   START
========================================================= */

loadData();