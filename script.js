let siswaList = [];

// Menambahkan siswa (otomatis ada di semua bulan)
function tambahSiswa() {
    let namaInput = document.getElementById("namaSiswa");
    let nama = namaInput.value.trim();
    if (nama !== "") {
        // Cek apakah siswa sudah ada
        let siswaSudahAda = siswaList.some(s => s.nama === nama);
        if (!siswaSudahAda) {
            siswaList.push({
                nama: nama,
                nominal: 0,
                lunas: false,
                bulan: {} // Data pembayaran per bulan
            });
        }
        namaInput.value = "";
        renderSiswa();
    }
}

// Mengubah status lunas
function toggleLunas(index, bulan) {
    siswaList[index].bulan[bulan].lunas = !siswaList[index].bulan[bulan].lunas;
    updatePemasukan();
}

// Menghapus siswa dari daftar
function hapusSiswa(index) {
    siswaList.splice(index, 1);
    updatePemasukan();
    renderSiswa();
}

// Mengupdate nominal pembayaran siswa
function updateNominal(index, bulan, value) {
    let nominal = parseInt(value) || 0;
    
    // Jika bulan belum ada, buatkan entri baru
    if (!siswaList[index].bulan[bulan]) {
        siswaList[index].bulan[bulan] = { nominal: 0, lunas: false };
    }

    siswaList[index].bulan[bulan].nominal = nominal;
    updatePemasukan();
}

// Menghitung total pemasukan berdasarkan bulan
function updatePemasukan() {
    let bulanSekarang = document.getElementById("bulan").value;
    let pemasukan = siswaList.reduce((total, siswa) => {
        let dataBulan = siswa.bulan[bulanSekarang];
        return dataBulan && dataBulan.lunas ? total + dataBulan.nominal : total;
    }, 0);

    document.getElementById("pemasukan").textContent = pemasukan;
    updateKeuangan();
}

// Menghitung sisa uang setelah dikurangi pengeluaran
function updateKeuangan() {
    let pemasukan = parseInt(document.getElementById("pemasukan").textContent) || 0;
    let pengeluaran = parseInt(document.getElementById("pengeluaran").value) || 0;
    let sisa = pemasukan - pengeluaran;
    document.getElementById("sisa").textContent = sisa;
}

// Menampilkan daftar siswa dalam tabel
function renderSiswa() {
    let daftarSiswa = document.getElementById("daftarSiswa");
    daftarSiswa.innerHTML = "";
    let bulanTerpilih = document.getElementById("bulan").value;

    siswaList.forEach((siswa, index) => {
        // Jika bulan belum ada, buat entri default
        if (!siswa.bulan[bulanTerpilih]) {
            siswa.bulan[bulanTerpilih] = { nominal: 0, lunas: false };
        }

        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${siswa.nama}</td>
            <td><input type="number" class="nominal" placeholder="Nominal" value="${siswa.bulan[bulanTerpilih].nominal}" oninput="updateNominal(${index}, '${bulanTerpilih}', this.value)"></td>
            <td><input type="checkbox" ${siswa.bulan[bulanTerpilih].lunas ? "checked" : ""} onchange="toggleLunas(${index}, '${bulanTerpilih}')"></td>
            <td><button onclick="hapusSiswa(${index})">Hapus</button></td>
        `;
        daftarSiswa.appendChild(tr);
    });

    // Perbarui tampilan nama bulan di bagian keuangan
    document.getElementById("bulanTitle").textContent = document.getElementById("bulan").selectedOptions[0].text;
    updatePemasukan();
}

// Menjalankan update tabel saat halaman dimuat
function updateTabel() {
    renderSiswa();
    updatePemasukan();
}

// Inisialisasi tampilan saat pertama kali dijalankan
updateTabel();
