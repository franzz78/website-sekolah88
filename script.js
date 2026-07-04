// Konfigurasi Firebase Realtime Database Anda
const firebaseConfig = {
  apiKey: "AIzaSyD9BmV4XKXuMWa4PZHpb7Bbt-rHs61m3lE",
  databaseURL: "https://absensi-polri-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "absensi-polri",
  storageBucket: "absensi-polri.firebasestorage.app",
  messagingSenderId: "19006760644",
  appId: "1:19006760644:web:b980f54aea123e92ed4b91"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultBox = document.getElementById('resultBox');

// Fungsi Pencarian Data Absensi dari Firebase
function searchData() {
    const keyword = searchInput.value.trim().toLowerCase();
    if (keyword === "") {
        resultBox.classList.add('hidden');
        return;
    }

    resultBox.innerHTML = "Memuat data...";
    resultBox.classList.remove('hidden');

    // Mengambil referensi dari node utama database (misal node 'absensi')
    database.ref('absensi').once('value').then((snapshot) => {
        const data = snapshot.val();
        resultBox.innerHTML = ""; // bersihkan loader

        if (!data) {
            resultBox.innerHTML = "<p style='color:#ff4d4d;'>Database kosong atau belum ada data absensi.</p>";
            return;
        }

        let found = false;
        let htmlContent = "<h3>Hasil Pencarian:</h3><ul style='list-style:none; margin-top:10px;'>";

        // Iterasi pencarian data berdasarkan nama atau ID
        for (let key in data) {
            const item = data[key];
            const nama = item.nama ? item.nama.toLowerCase() : "";
            const id = item.id ? item.id.toString().toLowerCase() : "";

            if (nama.includes(keyword) || id.includes(keyword)) {
                found = true;
                htmlContent += `
                    <li style="margin-bottom: 10px; border-bottom: 1px solid #444; padding-bottom: 5px;">
                        <strong>Nama:</strong> ${item.nama} <br>
                        <strong>ID/NRP:</strong> ${item.id || '-'} <br>
                        <strong>Status:</strong> <span style="color:${item.status === 'Hadir' ? '#4edf7a' : '#ff4d4d'}">${item.status || 'Tanpa Keterangan'}</span> <br>
                        <small>Waktu: ${item.waktu || '-'}</small>
                    </li>
                `;
            }
        }

        htmlContent += "</ul>";

        if (found) {
            resultBox.innerHTML = htmlContent;
        } else {
            resultBox.innerHTML = "<p>Data tidak ditemukan. Coba kata kunci lain.</p>";
        }
    }).catch((error) => {
        console.error(error);
        resultBox.innerHTML = "<p style='color:#ff4d4d;'>Gagal memuat data dari server.</p>";
    });
}

// Event Listeners
searchBtn.addEventListener('click', searchData);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchData();
});

// Registrasi Service Worker untuk PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker terdaftar!', reg))
            .catch(err => console.log('Gagal mendaftarkan Service Worker', err));
    });
}
  
