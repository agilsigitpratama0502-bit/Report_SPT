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