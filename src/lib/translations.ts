import { useStore } from "@/store/useStore";

const en = {
  common: {
    cancel: "Cancel",
  },
  doorprize: {
    noActiveSessionTitle: "No Active Session",
    noActiveSessionBody: "Please add prizes in the Prize Manager below.",
    potentialWinnersLeft: (n: number) => `${n} potential winners left`,
    items: "Items",
    runningDraw: "Running Draw...",
    draw: "DRAW",
    drawComplete: "Draw Complete",
    notEnoughParticipants: (need: number, have: number) =>
      `Not enough participants! Need ${need}, but only have ${have}.`,
    noCandidatesToReshuffle: "No available candidates to reshuffle!",
    reshuffleWinnerTitle: "Reshuffle Winner?",
    reshuffleWinnerDesc:
      "Are you sure you want to reshuffle this prize? The current winner will be replaced by a new random candidate. This action cannot be undone.",
    confirmReshuffle: "Confirm Reshuffle",
    noWinner: "No Winner",
    reshuffle: "Reshuffle",
    reshuffleWinnerAction: "Reshuffle Winner",
  },
  participants: {
    title: "Participants",
    total: "total",
    reset: "Reset",
    resetAllTitle: "Reset all participants",
    resetTitle: "Reset Participants?",
    resetDesc:
      "This action cannot be undone. This will permanently remove all non-winning participants from the list. Winners will remain.",
    resetConfirm: "Yes, Reset All",
    inputPlaceholder: "Enter participant name... and then press Enter to entry",
    duplicateAlert: "The input participant name was duplicate.",
    empty: "No participants yet",
    removeTitle: "Remove participant",
  },
  prizes: {
    title: "Prize Pool",
    items: "items",
    resetWinner: "Reset Winner",
    resetWinnerDesc:
      "This will clear all winners for ALL sessions. This action cannot be undone.",
    confirmReset: "Confirm Reset",
    resetAllTitle: "Reset all prizes",
    resetAllHeading: "Reset All Prizes?",
    resetAllDesc:
      "This action cannot be undone. This will permanently remove all sessions and prizes.",
    resetAllConfirm: "Yes, Reset All",
    sessionName: "Session Name",
    sessionPlaceholder: "Session (e.g. Session 1)",
    prizeName: "Prize Name",
    quantity: "Quantity",
    quantityPlaceholder: "Qty",
    allowReshuffle: "Allow Reshuffle",
    allowReshuffleTooltip:
      "Allows redrawing a winner for this prize during the draw session.",
    groupWinners: "Group Winners",
    groupWinnersTooltip:
      "Groups winners of the same prize into a single visual box instead of creating a separate box for each item.",
    addPrize: "Add Prize",
    noPreviousSessions: "No previous sessions",
    noMatchingSession: "No matching session found",
    empty: "No prizes configured",
  },
  importer: {
    importExcel: "Import Excel",
    importFromExcelTitle: "Import from Excel",
    importParticipantsHeading: "Import Participants",
    acceptedFormat: "Accepted Data Format",
    participantsGuide:
      "The file must be .xlsx or .xls with a header row on the first line. Column names can be anything — you'll pick which column holds the names in step 2. A column named Name or Nama is auto-selected. Empty cells are skipped and values are trimmed.",
    selectFile: "1. Select Excel File",
    noValidHeaders: "No valid headers found in the Excel file.",
    emptyFile: "The Excel file appears to be empty.",
    parseFail:
      "Failed to parse the Excel file. Please ensure it is a valid .xlsx file.",
    selectNameColumn: "2. Select Name Column",
    preview: "Preview",
    noValidNames: "No valid names found in the selected column.",
    importFail: "Failed to import data.",
    importParticipantsButton: "Import Participants",

    importPrizesTitle: "Import Prizes from Excel",
    importPrizesDesc:
      "Map your spreadsheet columns to sessions, prize names, and quantities, then review the preview before applying.",
    prizesGuide:
      "The file must be .xlsx or .xls with a header row on the first line. Column names can be anything — you'll map them to Session, Prize Name, and Quantity in step 2. Rows sharing the same Session value are grouped into that session. Quantity is optional; it defaults to 1 if left unmapped or isn't a valid positive number.",
    session: "Session",
    prizeName: "Prize Name",
    quantity: "Quantity",
    qty: "Qty",
    mapColumns: "2. Map Columns",
    sessionGroupName: "Session / Group Name",
    quantityOptional: "Quantity (optional)",
    selectColumn: "Select column",
    noneDefault: "None (default 1)",
    previewSelectRows: "3. Preview & Select Rows",
    missing: "missing",
    rowsSelected: (selected: number, total: number, sessions: number) =>
      `${selected} of ${total} valid rows selected across ${sessions} session${sessions === 1 ? "" : "s"}.`,
    allowReshuffleImportTooltip:
      "Allows redrawing a winner during the draw session for all imported sessions.",
    groupWinnersImportTooltip:
      "Groups winners of the same prize into a single visual box for all imported sessions.",
    noRowsSelected: "No rows selected to import.",
    importPrizesButton: (n: number) =>
      `Import ${n > 0 ? n : ""} Prize${n === 1 ? "" : "s"}`,
  },
  setup: {
    title: "Event Setup",
    subtitle: "Prepare the draw in three steps — everything is saved in this browser automatically.",
    step1: "Add prizes & sessions",
    step2: "Add participants",
    step3: "Scroll up and press DRAW",
    storageHint:
      "Data is stored in this browser only (localStorage). Opening the app on another browser or device starts empty, and clearing browser data erases it.",
  },
  help: {
    eventName: "Click the title to rename your event. Changes are saved automatically.",
    potentialWinners:
      "Participants who haven't won yet. Each person can win only once across all sessions.",
    sessions:
      "Each session is drawn separately. Pick one here; a ✓ means every prize in it has a winner. Switching is locked while a draw is running.",
    draw: "Draws winners for every empty prize slot in this session at once. Takes about 14 seconds with sound and confetti.",
    drawNoParticipants: "No eligible participants left. Add participants below first.",
    reshuffle:
      "Replace this winner (e.g. not present) with a new random participant who hasn't won yet.",
    sessionName:
      "Type a new name to create a session, or pick an existing one to add more prizes to it. Prizes in the same session are drawn together.",
    prizeName: "What the winner receives, e.g. \"Smart TV 43 inch\".",
    quantity: "How many units of this prize. Each unit gets its own winner.",
    sessionSettings:
      "These options apply to the whole session. Adding a prize to an existing session overwrites its previous options.",
    importPrizes:
      "Bulk-add sessions and prizes from an .xlsx / .xls file. A format guide is shown inside.",
    resetWinner:
      "Clears draw results in ALL sessions so you can draw again. Prizes and participants are kept.",
    resetPrizes: "Deletes every session and prize (and their winners). Participants are kept.",
    removePrize: "Remove this prize. Its recorded winners are cleared too.",
    participantInput: "Type a name and press Enter. Duplicate names are rejected.",
    importParticipants:
      "Bulk-add names from an .xlsx / .xls file. Names already in the list are skipped.",
    resetParticipants:
      "Removes everyone who hasn't won. Winners stay so draw results remain valid.",
    winnerMark:
      "👑 marks a winner. Winners can't be removed — use \"Reset Winner\" in the Prize Pool first.",
    audio: "Toggle the drumroll and applause sound played during a draw.",
    language: "Switch the interface language.",
  },
  audio: {
    label: "Audio Play",
    mute: "Mute Audio",
    unmute: "Unmute Audio",
  },
  language: {
    trigger: "Languages",
    changeTitle: "Change language",
  },
};

const id: typeof en = {
  common: {
    cancel: "Batal",
  },
  doorprize: {
    noActiveSessionTitle: "Tidak Ada Sesi Aktif",
    noActiveSessionBody: "Silakan tambahkan hadiah di Pengelola Hadiah di bawah ini.",
    potentialWinnersLeft: (n: number) => `${n} calon pemenang tersisa`,
    items: "Item",
    runningDraw: "Sedang Mengundi...",
    draw: "UNDI",
    drawComplete: "Undian Selesai",
    notEnoughParticipants: (need: number, have: number) =>
      `Peserta tidak cukup! Butuh ${need}, tapi hanya ada ${have}.`,
    noCandidatesToReshuffle: "Tidak ada kandidat yang tersedia untuk diundi ulang!",
    reshuffleWinnerTitle: "Undi Ulang Pemenang?",
    reshuffleWinnerDesc:
      "Apakah Anda yakin ingin mengundi ulang hadiah ini? Pemenang saat ini akan digantikan oleh kandidat acak baru. Tindakan ini tidak dapat dibatalkan.",
    confirmReshuffle: "Konfirmasi Undi Ulang",
    noWinner: "Belum Ada Pemenang",
    reshuffle: "Undi Ulang",
    reshuffleWinnerAction: "Undi Ulang Pemenang",
  },
  participants: {
    title: "Peserta",
    total: "total",
    reset: "Reset",
    resetAllTitle: "Reset semua peserta",
    resetTitle: "Reset Peserta?",
    resetDesc:
      "Tindakan ini tidak dapat dibatalkan. Ini akan menghapus permanen semua peserta yang belum menang dari daftar. Pemenang akan tetap ada.",
    resetConfirm: "Ya, Reset Semua",
    inputPlaceholder: "Masukkan nama peserta... lalu tekan Enter untuk menambahkan",
    duplicateAlert: "Nama peserta yang dimasukkan sudah ada (duplikat).",
    empty: "Belum ada peserta",
    removeTitle: "Hapus peserta",
  },
  prizes: {
    title: "Kumpulan Hadiah",
    items: "item",
    resetWinner: "Reset Pemenang",
    resetWinnerDesc:
      "Ini akan menghapus semua pemenang untuk SEMUA sesi. Tindakan ini tidak dapat dibatalkan.",
    confirmReset: "Konfirmasi Reset",
    resetAllTitle: "Reset semua hadiah",
    resetAllHeading: "Reset Semua Hadiah?",
    resetAllDesc:
      "Tindakan ini tidak dapat dibatalkan. Ini akan menghapus permanen semua sesi dan hadiah.",
    resetAllConfirm: "Ya, Reset Semua",
    sessionName: "Nama Sesi",
    sessionPlaceholder: "Sesi (cth. Sesi 1)",
    prizeName: "Nama Hadiah",
    quantity: "Jumlah",
    quantityPlaceholder: "Jml",
    allowReshuffle: "Izinkan Undi Ulang",
    allowReshuffleTooltip:
      "Mengizinkan pengundian ulang pemenang untuk hadiah ini selama sesi undian.",
    groupWinners: "Kelompokkan Pemenang",
    groupWinnersTooltip:
      "Mengelompokkan pemenang hadiah yang sama ke dalam satu kotak visual, alih-alih membuat kotak terpisah untuk setiap item.",
    addPrize: "Tambah Hadiah",
    noPreviousSessions: "Belum ada sesi sebelumnya",
    noMatchingSession: "Sesi yang cocok tidak ditemukan",
    empty: "Belum ada hadiah yang diatur",
  },
  importer: {
    importExcel: "Import Excel",
    importFromExcelTitle: "Impor dari Excel",
    importParticipantsHeading: "Impor Peserta",
    acceptedFormat: "Format Data yang Diterima",
    participantsGuide:
      "File harus berformat .xlsx atau .xls dengan baris judul (header) di baris pertama. Nama kolom bisa apa saja — Anda akan memilih kolom mana yang berisi nama pada langkah 2. Kolom bernama Name atau Nama akan terpilih otomatis. Sel kosong akan dilewati dan nilai akan dirapikan.",
    selectFile: "1. Pilih File Excel",
    noValidHeaders: "Tidak ditemukan judul kolom yang valid pada file Excel.",
    emptyFile: "File Excel tampak kosong.",
    parseFail:
      "Gagal membaca file Excel. Pastikan file tersebut adalah file .xlsx yang valid.",
    selectNameColumn: "2. Pilih Kolom Nama",
    preview: "Pratinjau",
    noValidNames: "Tidak ditemukan nama yang valid pada kolom yang dipilih.",
    importFail: "Gagal mengimpor data.",
    importParticipantsButton: "Impor Peserta",

    importPrizesTitle: "Impor Hadiah dari Excel",
    importPrizesDesc:
      "Petakan kolom spreadsheet Anda ke sesi, nama hadiah, dan jumlah, lalu tinjau pratinjau sebelum menerapkannya.",
    prizesGuide:
      "File harus berformat .xlsx atau .xls dengan baris judul (header) di baris pertama. Nama kolom bisa apa saja — Anda akan memetakannya ke Sesi, Nama Hadiah, dan Jumlah pada langkah 2. Baris dengan nilai Sesi yang sama akan dikelompokkan ke dalam sesi tersebut. Jumlah bersifat opsional; nilainya akan menjadi 1 jika tidak dipetakan atau bukan angka positif yang valid.",
    session: "Sesi",
    prizeName: "Nama Hadiah",
    quantity: "Jumlah",
    qty: "Jml",
    mapColumns: "2. Petakan Kolom",
    sessionGroupName: "Sesi / Nama Grup",
    quantityOptional: "Jumlah (opsional)",
    selectColumn: "Pilih kolom",
    noneDefault: "Tidak ada (default 1)",
    previewSelectRows: "3. Pratinjau & Pilih Baris",
    missing: "kosong",
    rowsSelected: (selected: number, total: number, sessions: number) =>
      `${selected} dari ${total} baris valid dipilih di ${sessions} sesi.`,
    allowReshuffleImportTooltip:
      "Mengizinkan pengundian ulang pemenang selama sesi undian untuk semua sesi yang diimpor.",
    groupWinnersImportTooltip:
      "Mengelompokkan pemenang hadiah yang sama ke dalam satu kotak visual untuk semua sesi yang diimpor.",
    noRowsSelected: "Tidak ada baris yang dipilih untuk diimpor.",
    importPrizesButton: (n: number) => `Impor ${n > 0 ? n : ""} Hadiah`,
  },
  setup: {
    title: "Persiapan Acara",
    subtitle: "Siapkan undian dalam tiga langkah — semua data tersimpan otomatis di browser ini.",
    step1: "Tambah hadiah & sesi",
    step2: "Tambah peserta",
    step3: "Gulir ke atas lalu tekan UNDI",
    storageHint:
      "Data hanya tersimpan di browser ini (localStorage). Membuka aplikasi di browser atau perangkat lain akan mulai kosong, dan menghapus data browser akan menghapusnya.",
  },
  help: {
    eventName: "Klik judul untuk mengganti nama acara. Perubahan tersimpan otomatis.",
    potentialWinners:
      "Peserta yang belum menang. Setiap orang hanya bisa menang satu kali di semua sesi.",
    sessions:
      "Setiap sesi diundi terpisah. Pilih sesi di sini; tanda ✓ berarti semua hadiahnya sudah punya pemenang. Tidak bisa berpindah sesi saat undian berjalan.",
    draw: "Mengundi pemenang untuk semua slot hadiah yang masih kosong di sesi ini sekaligus. Berlangsung sekitar 14 detik dengan suara dan konfeti.",
    drawNoParticipants: "Tidak ada peserta yang tersisa. Tambahkan peserta di bawah terlebih dahulu.",
    reshuffle:
      "Ganti pemenang ini (mis. tidak hadir) dengan peserta acak baru yang belum menang.",
    sessionName:
      "Ketik nama baru untuk membuat sesi, atau pilih sesi yang ada untuk menambah hadiah. Hadiah dalam sesi yang sama diundi bersamaan.",
    prizeName: "Hadiah yang diterima pemenang, mis. \"Smart TV 43 inch\".",
    quantity: "Jumlah unit hadiah ini. Setiap unit mendapat satu pemenang.",
    sessionSettings:
      "Opsi ini berlaku untuk seluruh sesi. Menambah hadiah ke sesi yang sudah ada akan menimpa opsi sebelumnya.",
    importPrizes:
      "Tambah banyak sesi dan hadiah sekaligus dari file .xlsx / .xls. Panduan format tersedia di dalamnya.",
    resetWinner:
      "Menghapus hasil undian di SEMUA sesi agar bisa diundi ulang. Hadiah dan peserta tetap ada.",
    resetPrizes: "Menghapus semua sesi dan hadiah (beserta pemenangnya). Peserta tetap ada.",
    removePrize: "Hapus hadiah ini. Pemenang yang tercatat juga ikut terhapus.",
    participantInput: "Ketik nama lalu tekan Enter. Nama duplikat akan ditolak.",
    importParticipants:
      "Tambah banyak nama sekaligus dari file .xlsx / .xls. Nama yang sudah ada akan dilewati.",
    resetParticipants:
      "Menghapus semua peserta yang belum menang. Pemenang tetap ada agar hasil undian tetap valid.",
    winnerMark:
      "👑 menandakan pemenang. Pemenang tidak bisa dihapus — gunakan \"Reset Pemenang\" di Kumpulan Hadiah terlebih dahulu.",
    audio: "Nyalakan/matikan suara drumroll dan tepuk tangan saat undian.",
    language: "Ganti bahasa antarmuka.",
  },
  audio: {
    label: "Audio Play",
    mute: "Matikan Audio",
    unmute: "Aktifkan Audio",
  },
  language: {
    trigger: "Languages",
    changeTitle: "Ganti bahasa",
  },
};

const translations = { en, id };

export function useTranslation() {
  const language = useStore((state) => state.language);
  return translations[language];
}
