document.addEventListener("DOMContentLoaded", () => {

    const greetingEl = document.getElementById("greetingText");
    if (greetingEl) {
        greetingEl.innerHTML = getGreetingMessage();
    }

    const stokContainer = document.getElementById("stokContainer");
    if (stokContainer) {
        renderStokCards();
        renderStokTable();
    }
});

//==================================
//  FITUR LOGIN (index.html)
//==================================
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = dataPengguna.find(u => u.email === email && u.password === password);

    if (user) {
// Simpan nama pengguna ke localStorage
        localStorage.setItem("userSession", JSON.stringify(user));
        window.location.href = "dashboard.html";
    } else {
        alert("Email atau Password yang Anda masukkan salah!");
    }
}
//==========================================
// FITUR MODAL BOX (Lupa Password & Daftar)
//==========================================
function openModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}
//==============================
//  FITUR GREETING WAKTU LOKAL 
//==============================
function getGreetingMessage() {
    const hour = new Date().getHours();
    let user = JSON.parse(localStorage.getItem("userSession"));
    let userName = user ? user.nama : "Rekan Mahasiswa";
    
    let timeGreeting = "";
    if (hour >= 4 && hour < 11) {
        timeGreeting = "Selamat Pagi";
    } else if (hour >= 11 && hour < 15) {
        timeGreeting = "Selamat Siang";
    } else if (hour >= 15 && hour < 18) {
        timeGreeting = "Selamat Sore";
    } else {
        timeGreeting = "Selamat Malam";
    }

    return `${timeGreeting}, <strong>${userName}</strong>! Selamat datang di Aplikasi SITTA UT.`;
}

//====================================
// FITUR STOK BAHAN AJAR (stok.html)
//====================================
function renderStokCards() {
    const container = document.getElementById("stokContainer");
    container.innerHTML = "";

    dataBahanAjar.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${item.cover}" alt="${item.namaBarang}" onerror="this.src='https://via.placeholder.com/200x260?text=No+Cover'">
            <div class="card-body">
                <h4>${item.namaBarang}</h4>
                <p><strong>Kode Lokasi:</strong> ${item.kodeLokasi}</p>
                <p><strong>Kode Barang:</strong> ${item.kodeBarang}</p>
                <p><strong>Jenis:</strong> ${item.jenisBarang} | <strong>Edisi:</strong> ${item.edisi}</p>
                <p><strong>Stok:</strong> ${item.stok}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderStokTable() {
    const tableBody = document.getElementById("stokTableBody");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    dataBahanAjar.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.kodeLokasi}</td>
            <td>${item.kodeBarang}</td>
            <td>${item.namaBarang}</td>
            <td>${item.jenisBarang}</td>
            <td>${item.edisi}</td>
            <td>${item.stok}</td>
        `;
        tableBody.appendChild(row);
    });
}
//=====================================================
// Tambah Stok Bahan Ajar menggunakan Manipulasi DOM
//=====================================================
let selectedCoverUrl = "";
function handleCoverUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedCoverUrl = e.target.result;
        };
        reader.readAsDataURL(file);
        
    }
}
function handleAddStok(event) {
    event.preventDefault();
    
    const kodeLokasi = document.getElementById("kodeLokasi").value;
    const kodeBarang = document.getElementById("kodeBarang").value;
    const namaBarang = document.getElementById("namaBarang").value;
    const jenisBarang = document.getElementById("jenisBarang").value;
    const edisi = document.getElementById("edisi").value;
    const stok = parseInt(document.getElementById("stok").value);

    const coverPath = selectedCoverUrl !== "" ? selectedCoverUrl : "https://via.placeholder.com/200x260?text=No+Cover";

    const newBahanAjar = {
        kodeLokasi,
        kodeBarang,
        namaBarang,
        jenisBarang,
        edisi,
        stok,
        cover: coverPath
    };

    dataBahanAjar.unshift(newBahanAjar);
    renderStokCards();
    renderStokTable();
    closeModal('modalTambahStok');
    document.getElementById("formTambahStok").reset(); selectedCoverUrl = "";
    alert("Data stok bahan ajar berhasil ditambahkan!");
}
//====================
//Fitur Tracking DO
//====================
function handleTracking(event) {
    event.preventDefault();
    const nomorDO = document.getElementById("nomorDO").value.trim();
    const resultDiv = document.getElementById("trackingResult");

    const trackData = dataTracking[nomorDO];

    if (trackData) {
        let timelineHTML = trackData.perjalanan.map(p => `
            <li class="timeline-item">
                <strong>${p.keterangan}</strong>
                <small>${p.waktu}</small>
            </li>
        `).join("");

        resultDiv.innerHTML = `
            <div class="tracking-card">
                <h3>${trackData.nama} (${trackData.nomorDO})</h3>
                <p>Status: <strong>${trackData.status}</strong></p>
                <p>Ekspedisi: ${trackData.ekspedisi} | Tanggal Kirim: ${trackData.tanggalKirim}</p>
                <p>Total: ${trackData.total}</p>
            </div>
            <h4 style="margin-top:20px;">Perjalanan Paket</h4>
            <ul class="timeline">
                ${timelineHTML}
            </ul>
        `;
    } else {
        resultDiv.innerHTML = `<p style="color:red; margin-top:15px;">Nomor DO/Billing tidak ditemukan. Silahkan periksa kembali nomor yang dimasukkan.</p>`;
    }
}
//=============================================================
// Fungsi untuk input password (Lihat/Sembunyikan Password)
//=============================================================
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.getElementById("togglePassword");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye"); 
    }
}