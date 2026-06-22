export type Lang = 'id' | 'en';

const translations = {
  // ===== AppShell / Navigation =====
  'nav.home': { id: 'Beranda', en: 'Home' },
  'nav.calendar': { id: 'Kalender', en: 'Calendar' },
  'nav.log': { id: 'Catatan', en: 'Log' },
  'nav.predictions': { id: 'Prediksi', en: 'Predictions' },
  'nav.profile': { id: 'Profil', en: 'Profile' },
  'nav.greeting': { id: 'Hai', en: 'Hey' },
  'nav.there': { id: 'teman', en: 'there' },

  // ===== Home / Dashboard =====
  'home.good_morning': { id: 'Selamat pagi', en: 'Good morning' },
  'home.good_afternoon': { id: 'Selamat siang', en: 'Good afternoon' },
  'home.good_evening': { id: 'Selamat sore', en: 'Good evening' },
  'home.log_first_period': { id: 'Catat menstruasi pertama Anda untuk mulai melacak siklus dan dapatkan wawasan personal.', en: 'Log your first period to start tracking your cycle and get personalized insights.' },
  'home.log_period': { id: 'Catat menstruasi', en: 'Log period' },
  'home.daily_status': { id: 'Status harian', en: 'Daily status' },
  'home.your_cycle': { id: 'Siklus Anda', en: 'Your cycle' },
  'home.today': { id: 'Hari ini', en: 'Today' },
  'home.update_today': { id: 'Perbarui catatan hari ini', en: "Update today's entry" },
  'home.upcoming': { id: 'Akan datang', en: 'Upcoming' },
  'home.periods_tracked': { id: 'Menstruasi tercatat', en: 'Periods tracked' },
  'home.avg_cycle': { id: 'Rata-rata siklus', en: 'Avg cycle' },
  'home.daily_logs': { id: 'Catatan harian', en: 'Daily logs' },

  // ===== Calendar =====
  'calendar.legend': { id: 'Keterangan', en: 'Legend' },
  'calendar.period': { id: 'Menstruasi', en: 'Period' },
  'calendar.predicted': { id: 'Prediksi', en: 'Predicted' },
  'calendar.ovulation': { id: 'Ovulasi', en: 'Ovulation' },
  'calendar.fertile_window': { id: 'Jendela subur', en: 'Fertile window' },
  'calendar.add_log': { id: 'Tambah catatan', en: 'Add log entry' },

  // ===== History =====
  'history.title': { id: 'Riwayat', en: 'History' },
  'history.subtitle': { id: 'Gambaran siklus Anda', en: 'Your cycle overview' },
  'history.period_log': { id: 'Catatan menstruasi', en: 'Period log' },
  'history.no_periods': { id: 'Belum ada menstruasi tercatat', en: 'No periods logged' },
  'history.no_periods_desc': { id: 'Mulai catat menstruasi Anda untuk melihat riwayat dan lacak pola.', en: 'Start logging your periods to see your history and track patterns.' },
  'history.days': { id: 'hari', en: 'days' },

  // ===== Log =====
  'log.edit_entry': { id: 'Edit catatan', en: 'Edit entry' },
  'log.new_entry': { id: 'Catatan baru', en: 'New entry' },
  'log.daily_status_tab': { id: 'Status harian', en: 'Daily status' },
  'log.period_tab': { id: 'Menstruasi', en: 'Period' },
  'log.date': { id: 'Tanggal', en: 'Date' },
  'log.bleeding_status': { id: 'Status pendarahan', en: 'Bleeding status' },
  'log.select_bleeding': { id: 'Pilih status pendarahan', en: 'Select bleeding status' },
  'log.spotting': { id: 'Bercak', en: 'Spotting' },
  'log.light': { id: 'Ringan', en: 'Light' },
  'log.medium': { id: 'Sedang', en: 'Medium' },
  'log.heavy': { id: 'Berat', en: 'Heavy' },
  'log.pain_level': { id: 'Tingkat nyeri', en: 'Pain level' },
  'log.select_pain': { id: 'Pilih tingkat nyeri', en: 'Select pain level' },
  'log.no_pain': { id: 'Tidak nyeri', en: 'No pain' },
  'log.mild': { id: 'Ringan', en: 'Mild' },
  'log.moderate': { id: 'Sedang', en: 'Moderate' },
  'log.severe': { id: 'Parah', en: 'Severe' },
  'log.very_severe': { id: 'Sangat parah', en: 'Very severe' },
  'log.pain_help': { id: '0 = tidak nyeri, 10 = nyeri terbayangkan', en: '0 = no pain, 10 = worst pain imaginable' },
  'log.mood': { id: 'Suasana hati', en: 'Mood' },
  'log.select_mood': { id: 'Pilih suasana hati', en: 'Select mood' },
  'log.happy': { id: 'Senang', en: 'Happy' },
  'log.calm': { id: 'Tenang', en: 'Calm' },
  'log.neutral': { id: 'Netral', en: 'Neutral' },
  'log.sad': { id: 'Sedih', en: 'Sad' },
  'log.anxious': { id: 'Cemas', en: 'Anxious' },
  'log.irritable': { id: 'Mudah marah', en: 'Irritable' },
  'log.energetic': { id: 'Berenergi', en: 'Energetic' },
  'log.tired': { id: 'Lelah', en: 'Tired' },
  'log.stressed': { id: 'Stres', en: 'Stressed' },
  'log.content': { id: 'Puas', en: 'Content' },
  'log.frustrated': { id: 'Frustrasi', en: 'Frustrated' },
  'log.hopeful': { id: 'Berharap', en: 'Hopeful' },
  'log.energy_level': { id: 'Tingkat energi', en: 'Energy level' },
  'log.select_energy': { id: 'Pilih tingkat energi', en: 'Select energy level' },
  'log.exhausted': { id: 'Kelelahan', en: 'Exhausted' },
  'log.low': { id: 'Rendah', en: 'Low' },
  'log.high': { id: 'Tinggi', en: 'High' },
  'log.very_high': { id: 'Sangat tinggi', en: 'Very high' },
  'log.energy_help': { id: '0 = benar-benar kelelahan, 10 = penuh energi', en: '0 = completely exhausted, 10 = full of energy' },
  'log.notes': { id: 'Catatan (opsional)', en: 'Notes (optional)' },
  'log.notes_placeholder': { id: 'Catatan tambahan...', en: 'Any additional notes...' },
  'log.cancel': { id: 'Batal', en: 'Cancel' },
  'log.update': { id: 'Perbarui', en: 'Update' },
  'log.save': { id: 'Simpan', en: 'Save' },
  'log.start_date': { id: 'Tanggal mulai', en: 'Start date' },
  'log.end_date': { id: 'Tanggal selesai', en: 'End date' },
  'log.flow_intensity': { id: 'Intensitas aliran', en: 'Flow intensity' },
  'log.select_intensity': { id: 'Pilih intensitas', en: 'Select intensity' },
  'log.period_updated': { id: 'Catatan menstruasi diperbarui', en: 'Period entry updated' },
  'log.period_saved': { id: 'Catatan menstruasi disimpan', en: 'Period entry saved' },
  'log.daily_updated': { id: 'Status harian diperbarui', en: 'Daily status updated' },
  'log.daily_saved': { id: 'Status harian disimpan', en: 'Daily status saved' },
  'log.fix_errors': { id: 'Perbaiki kesalahan di bawah', en: 'Please fix the errors below' },
  'log.something_wrong': { id: 'Terjadi kesalahan. Silakan coba lagi.', en: 'Something went wrong. Please try again.' },

  // ===== Predictions =====
  'predictions.based_on': { id: 'Berdasarkan riwayat catatan Anda', en: 'Based on your logged history' },
  'predictions.no_data': { id: 'Belum ada data', en: 'No data yet' },
  'predictions.no_data_desc': { id: 'Catat setidaknya satu menstruasi untuk membuat estimasi. Semakin banyak data, semakin baik prediksinya.', en: 'Log at least one period to generate an estimate. The more data you add, the better the prediction.' },
  'predictions.limited_data': { id: 'Data terbatas', en: 'Limited data' },
  'predictions.limited_data_desc': { id: 'Tambahkan setidaknya 3 tanggal mulai menstruasi untuk estimasi yang lebih andal. Saat ini menggunakan %d menstruasi.', en: 'Add at least 3 period start dates for a more reliable estimate. Currently using %d period(s).' },
  'predictions.no_prediction': { id: 'Belum ada prediksi', en: 'No prediction yet' },
  'predictions.log_to_start': { id: 'Catat riwayat menstruasi dan hitung ulang untuk memulai.', en: 'Log your period history and recompute to get started.' },
  'predictions.disclaimer': { id: 'Setiap prediksi adalah estimasi berdasarkan riwayat catatan Anda. Metode kalender saja kurang andal dibandingkan metode kesadaran kesuburan multi-indikator. Jangan gunakan tanggal ini sebagai konfirmasi medis atau panduan kontrasepsi.', en: 'Every prediction is an estimate based on your logged history. Calendar-only methods are less reliable than multi-indicator fertility-awareness methods. Avoid using these dates as medical confirmation or contraception guidance.' },
  'predictions.recompute': { id: 'Hitung ulang estimasi', en: 'Recompute estimate' },

  // ===== Profile =====
  'profile.manage_account': { id: 'Kelola akun Anda', en: 'Manage your account' },
  'profile.member_since': { id: 'Bergabung sejak', en: 'Member since' },
  'profile.personal_info': { id: 'Info pribadi', en: 'Personal info' },
  'profile.display_name': { id: 'Nama tampilan', en: 'Display name' },
  'profile.display_name_placeholder': { id: 'Bagaimana kami harus memanggil Anda?', en: 'How should we call you?' },
  'profile.timezone': { id: 'Zona waktu', en: 'Timezone' },
  'profile.save_profile': { id: 'Simpan profil', en: 'Save profile' },
  'profile.change_password': { id: 'Ubah kata sandi', en: 'Change password' },
  'profile.current_password': { id: 'Kata sandi saat ini', en: 'Current password' },
  'profile.new_password': { id: 'Kata sandi baru', en: 'New password' },
  'profile.update_password': { id: 'Perbarui kata sandi', en: 'Update password' },
  'profile.profile_updated': { id: 'Profil diperbarui', en: 'Profile updated' },
  'profile.password_updated': { id: 'Kata sandi diperbarui', en: 'Password updated' },
  'profile.sign_out': { id: 'Keluar', en: 'Sign out' },

  // ===== Cycle Ring =====
  'ring.cycle_day': { id: 'Hari siklus', en: 'Cycle day' },
  'ring.of_days': { id: 'dari ~%d hari', en: 'of ~%d days' },
  'ring.follicular': { id: 'Fase folikular', en: 'Follicular phase' },
  'ring.period_day': { id: 'Hari menstruasi %d', en: 'Period day %d' },
  'ring.late_luteal': { id: 'Fase luteal akhir', en: 'Late luteal phase' },
  'ring.ovulation_approaching': { id: 'Ovulasi mendekat', en: 'Ovulation approaching' },
  'ring.next_period_in': { id: 'Menstruasi berikutnya dalam %d hari', en: 'Next period in %d day(s)' },
  'ring.expected_today': { id: 'Diperkirakan mulai hari ini', en: 'Expected to start today' },

  // ===== Quick Log Card =====
  'quick_log.logged_today': { id: 'Tercatat hari ini', en: 'Logged today' },
  'quick_log.tap_to_update': { id: 'Ketuk untuk memperbarui catatan', en: 'Tap to update your entry' },
  'quick_log.havent_logged': { id: 'Belum tercatat hari ini', en: "Haven't logged today" },
  'quick_log.track_feeling': { id: 'Lacak perasaan Anda', en: "Track how you're feeling" },
  'quick_log.pain': { id: 'Nyeri %d/10', en: 'Pain %d/10' },
  'quick_log.energy': { id: 'Energi %d/10', en: 'Energy %d/10' },

  // ===== Upcoming Events =====
  'upcoming.next_period': { id: 'Menstruasi berikutnya', en: 'Next period' },
  'upcoming.ovulation': { id: 'Ovulasi', en: 'Ovulation' },
  'upcoming.fertile_window': { id: 'Jendela subur', en: 'Fertile window' },
  'upcoming.no_events': { id: 'Tidak ada acara mendatang', en: 'No upcoming events' },
  'upcoming.log_more': { id: 'Catat lebih banyak menstruasi untuk mendapatkan prediksi', en: 'Log more periods to get predictions' },
  'upcoming.today': { id: 'Hari ini', en: 'Today' },
  'upcoming.tomorrow': { id: 'Besok', en: 'tomorrow' },
  'upcoming.away': { id: 'lagi', en: 'away' },
  'upcoming.low_confidence': { id: 'Keyakinan rendah — catat lebih banyak menstruasi untuk akurasi lebih baik', en: 'Low confidence -- log more periods for better accuracy' },

  // ===== Phase Timeline =====
  'timeline.period_start': { id: 'Mulai menstruasi', en: 'Period start' },
  'timeline.cycle_length': { id: 'Panjang siklus: %d hari', en: 'Cycle length: %dd' },
  'timeline.period': { id: 'Menstruasi', en: 'Period' },
  'timeline.fertile_window': { id: 'Jendela subur', en: 'Fertile window' },
  'timeline.ovulation': { id: 'Ovulasi', en: 'Ovulation' },
  'timeline.today': { id: 'Hari ini', en: 'Today' },

  // ===== Prediction Explainer =====
  'explainer.how_calculated': { id: 'Bagaimana estimasi ini dihitung', en: 'How this estimate is calculated' },
  'explainer.next_period': { id: 'Estimasi menstruasi berikutnya', en: 'Next estimated period' },
  'explainer.ovulation': { id: 'Estimasi ovulasi', en: 'Estimated ovulation' },
  'explainer.fertile_range': { id: 'Estimasi rentang subur', en: 'Estimated fertile-style range' },
  'explainer.avg_cycle_used': { id: 'Rata-rata siklus yang digunakan', en: 'Average cycle length used' },
  'explainer.avg_period_used': { id: 'Rata-rata menstruasi yang digunakan', en: 'Average period length used' },
  'explainer.cycles_considered': { id: 'Siklus yang dipertimbangkan', en: 'Cycles considered' },
  'explainer.confidence': { id: 'Keyakinan', en: 'Confidence' },
  'explainer.algorithm': { id: 'Algoritma: v1-calendar-rhythm', en: 'Algorithm: v1-calendar-rhythm' },

  // ===== Privacy Card =====
  'privacy.title': { id: 'Privasi & data Anda', en: 'Privacy & your data' },
  'privacy.description': { id: 'Hayd hanya menyimpan data yang Anda masukkan: catatan menstruasi, status harian, dan pengaturan akun. Tidak ada pelacakan, tidak ada iklan, tidak ada penjualan data. Data Anda tetap milik Anda.', en: 'Hayd stores only the data you enter: period logs, daily status, and account settings. No tracking, no ads, no data selling. Your data stays yours.' },
  'privacy.admin_note': { id: 'Admin dapat melihat metadata akun Anda (email, peran, tanggal pembuatan) untuk tujuan dukungan. Catatan kesehatan tidak dapat dilihat oleh admin.', en: 'Admins can see your account metadata (email, role, creation date) for support purposes. Health notes cannot be viewed by admins.' },
  'privacy.export': { id: 'Ekspor catatan saya', en: 'Export my records' },
  'privacy.delete': { id: 'Minta penghapusan', en: 'Request deletion' },

  // ===== Cycle Stats =====
  'stats.avg_cycle': { id: 'Rata-rata siklus', en: 'Avg cycle' },
  'stats.avg_period': { id: 'Rata-rata menstruasi', en: 'Avg period' },
  'stats.cycles_tracked': { id: 'Siklus tercatat', en: 'Cycles tracked' },
  'stats.trend': { id: 'Tren', en: 'Trend' },

  // ===== Calendar Grid =====
  'calendar_grid.prev_month': { id: 'Bulan sebelumnya', en: 'Previous month' },
  'calendar_grid.next_month': { id: 'Bulan berikutnya', en: 'Next month' },
  'calendar.january': { id: 'Januari', en: 'January' },
  'calendar.february': { id: 'Februari', en: 'February' },
  'calendar.march': { id: 'Maret', en: 'March' },
  'calendar.april': { id: 'April', en: 'April' },
  'calendar.may': { id: 'Mei', en: 'May' },
  'calendar.june': { id: 'Juni', en: 'June' },
  'calendar.july': { id: 'Juli', en: 'July' },
  'calendar.august': { id: 'Agustus', en: 'August' },
  'calendar.september': { id: 'September', en: 'September' },
  'calendar.october': { id: 'Oktober', en: 'October' },
  'calendar.november': { id: 'November', en: 'November' },
  'calendar.december': { id: 'Desember', en: 'December' },

  // ===== Confirmation Dialog =====
  'dialog.confirm': { id: 'Konfirmasi', en: 'Confirm' },
  'dialog.cancel': { id: 'Batal', en: 'Cancel' },

  // ===== Theme Toggle =====
  'theme.switch_light': { id: 'Beralih ke mode terang', en: 'Switch to light mode' },
  'theme.switch_dark': { id: 'Beralih ke mode gelap', en: 'Switch to dark mode' },

  // ===== Language =====
  'lang.switch': { id: 'Bahasa', en: 'Language' },

  // ===== PWA Install Prompt =====
  'pwa.title': { id: 'Pasang Hayd', en: 'Install Hayd' },
  'pwa.ios_desc': { id: 'Tambahkan Hayd ke Layar Beranda Anda untuk pengalaman yang lebih baik. Ketuk tombol Bagikan, lalu "Tambahkan ke Layar Beranda".', en: 'Add Hayd to your Home Screen for a better experience. Tap the Share button, then "Add to Home Screen".' },
  'pwa.android_desc': { id: 'Pasang Hayd sebagai aplikasi untuk akses lebih cepat, dukungan offline, dan pengalaman native.', en: 'Install Hayd as an app for faster access, offline support, and a native experience.' },
  'pwa.later': { id: 'Nanti', en: 'Later' },
  'pwa.install': { id: 'Pasang', en: 'Install' },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang, ...args: (string | number)[]): string {
  const entry = translations[key];
  if (!entry) return key;
  let text = entry[lang];
  // Simple %d / %s replacement
  if (args.length > 0) {
    let argIndex = 0;
    text = text.replace(/%[ds]/g, () => {
      const arg = args[argIndex++];
      return arg !== undefined ? String(arg) : '';
    });
  }
  return text;
}

export const defaultLang: Lang = 'id';
