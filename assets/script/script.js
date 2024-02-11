const daftarBuku = [];
const dataSearch = [];
const RENDER_EVENT = 'render-buku';
const SAVED_EVENT = 'saved-buku';
const DELETE_EVENT = 'delete-buku';
const EDIT_EVENT = 'edited-buku';
const STORAGE_KEY = 'Fikri-Bookshelf-Apps';
const container = document.getElementById('container');
const input = document.getElementById('input');
const add = document.getElementById('btn-add');
const form = document.getElementById('form');
const cancel = document.getElementById('cancel');
const count = document.getElementById('count');
const editBtn = document.getElementById('edit');
const search = document.getElementById('btn-cari');
const inputCari = document.getElementById('cari');
const submit = document.getElementById('submit');
const tampilBuku = document.getElementById('tampil-search');
function cariIndexBuku(idBuku) {
    for (const index in daftarBuku) {
        if (daftarBuku[index].id === idBuku) {
            return index;
        }
    }
    return -1;
}
function cariIndexBukuByJudul(judulBuku) {
    for (const index in daftarBuku) {
        if (daftarBuku[index].title === judulBuku) {
            return index;
        }
    }
    return -1;
}
function dataBuku(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    }
}
function cariBuku(idBuku) {
    for (const buku of daftarBuku) {
        if (buku.id === idBuku) {
            return buku;
        }
    }
    return null;
}
function cekLayananStorage() {
    if (typeof (Storage) === undefined) {
        alert('Web Browser Anda Tidak Support Web Storage!');
        return false;
    }
    return true;
}
function buatId() {
    return +new Date();
}
function saveBuku() {
    if (cekLayananStorage()) {
        const parsed = JSON.stringify(daftarBuku);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}
function editBuku(idBuku) {
    const indexTarget = cariIndexBuku(idBuku);
    input.style.display = "block";
    document.getElementById('judul-buku').value = daftarBuku[indexTarget].title;
    document.getElementById('author-buku').value = daftarBuku[indexTarget].author;
    document.getElementById('tahun-buku').value = daftarBuku[indexTarget].year;
    const iscompleted = document.getElementById('iscompleted');
    if (daftarBuku[indexTarget].isComplete === true) {
        iscompleted.checked = true;
    } else {
        iscompleted.checked = false;
    }
    submit.style.display = "none";
    editBtn.style.display = "inline";
    editBtn.addEventListener('click', function () {
        daftarBuku[indexTarget].id = idBuku;
        daftarBuku[indexTarget].title = document.getElementById('judul-buku').value;
        daftarBuku[indexTarget].author = document.getElementById('author-buku').value;
        daftarBuku[indexTarget].year = document.getElementById('tahun-buku').value;
        daftarBuku[indexTarget].isComplete = document.getElementById('iscompleted');
        let nilai;
        if (iscompleted.checked === true) {
            nilai = true;
        } else {
            nilai = false;
        }
        const bukuBaru = dataBuku(daftarBuku[indexTarget].id, daftarBuku[indexTarget].title, daftarBuku[indexTarget].author, daftarBuku[indexTarget].year, nilai);


        daftarBuku.pop();
        daftarBuku[indexTarget] = bukuBaru;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveBuku();
        document.dispatchEvent(new Event(EDIT_EVENT));
    });
}
function ambilDataBuku() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
        for (const buku of data) {
            daftarBuku.push(buku);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}
function inputBuku(objekBuku) {
    const { id, title, author, year, isComplete } = objekBuku;
    const artikel = document.createElement('article');
    artikel.setAttribute('id', `buku-${id}`);
    const gambar = document.createElement('img');
    gambar.setAttribute('src', 'assets/image/buku.jpg');
    gambar.setAttribute('alt', 'buku');

    const info = document.createElement('div');
    info.classList.add('info');
    const titleBook = document.createElement('h3');
    titleBook.innerText = title;
    const authorBook = document.createElement('p');
    authorBook.innerText = author
    const yearBook = document.createElement('p');
    yearBook.innerText = year;
    info.append(titleBook);
    info.append(authorBook);
    info.append(yearBook);

    const tombol = document.createElement('div');
    tombol.classList.add('tombol');
    if (isComplete) {
        const undo = document.createElement('button');
        undo.classList.add('undo');
        undo.innerText = "Belum Selesai";
        undo.addEventListener('click', function () {
            undoBuku(id);
        });
        tombol.append(undo);
    } else {
        const selesai = document.createElement('button');
        selesai.classList.add('done');
        selesai.innerText = "Selesai";
        selesai.addEventListener('click', function () {
            selesaiBuku(id);
        });
        tombol.append(selesai);
    }
    const edit = document.createElement('button');
    edit.classList.add('edit');
    edit.innerText = "Edit";
    edit.addEventListener('click', function () {
        editBuku(id);
    });
    tombol.append(edit);
    const hapus = document.createElement('button');
    hapus.classList.add('hapus');
    hapus.innerText = "Hapus";
    tombol.append(hapus);
    hapus.addEventListener('click', function () {
        hapusBuku(id);
    });
    artikel.append(gambar);
    artikel.append(info);
    artikel.append(tombol);
    return artikel;
}
function tambahBuku() {
    const idBook = buatId();
    const Judul = document.getElementById('judul-buku').value;
    const author = document.getElementById('author-buku').value;
    const year = Number(document.getElementById('tahun-buku').value);
    const iscompleted = document.getElementById('iscompleted');
    let nilai;
    if (iscompleted.checked == true) {
        nilai = true;
    } else {
        nilai = false;
    }
    const bukuBaru = dataBuku(idBook, Judul, author, year, nilai);
    daftarBuku.push(bukuBaru);
    document.dispatchEvent(new Event(SAVED_EVENT));
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBuku();

}
function selesaiBuku(idBuku) {
    const bukuTarget = cariBuku(idBuku);

    if (bukuTarget == null) return;

    bukuTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBuku();

}
function hapusBuku(idBuku) {
    const bukuTarget = cariIndexBuku(idBuku);

    if (bukuTarget === -1) return;

    daftarBuku.splice(bukuTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBuku();
    document.dispatchEvent(new Event(DELETE_EVENT));
}
function undoBuku(idBuku) {
    const bukuTarget = cariBuku(idBuku);
    if (bukuTarget == null) return;

    bukuTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBuku();
}
function cariBukuByJudul(judulBuku) {
    dataSearch.pop();
    const index = cariIndexBukuByJudul(judulBuku);
    if (index !== -1) {
        dataSearch.push(daftarBuku[index]);
        const data = dataSearch[0];
        const infoSearch = document.createElement('div');
        infoSearch.setAttribute('id', 'info-search');
        infoSearch.innerHTML = '';
        tampilBuku.innerHTML = '';

        const gambar = document.createElement('img');
        gambar.setAttribute('id', 'gambar-search');
        gambar.setAttribute('alt', 'buku');
        gambar.setAttribute('src', 'assets/image/buku.jpg');

        const judul = document.createElement('h3');
        judul.setAttribute('id', 'judul-search');
        judul.innerText = data.title;

        const authorBook = document.createElement('p');
        authorBook.setAttribute('id', 'author-search');
        authorBook.innerText = data.author;

        const tahun = document.createElement('p');
        tahun.setAttribute('id', 'tahun-search');
        tahun.innerText = data.year;

        const rak = document.createElement('p');
        rak.setAttribute('id', 'rak-search');
        if (data.isComplete === true) {
            rak.innerText = "Belum Selesai Dibaca";
        } else {
            rak.innerText = "Selesai Dibaca";
        }
        tampilBuku.append(gambar);
        infoSearch.append(judul);
        infoSearch.append(authorBook);
        infoSearch.append(tahun);
        infoSearch.append(rak);
        tampilBuku.append(infoSearch);
    } else {
        tampilBuku.innerHTML = "<h3>Buku tidak ditemukan</h3>";
    }
}
document.addEventListener('DOMContentLoaded', function (event) {
    const submit = document.getElementById('submit');
    submit.addEventListener('click', function () {
        event.preventDefault();
        tambahBuku();
    });
    if (cekLayananStorage()) {
        ambilDataBuku();
    }
});
document.addEventListener(SAVED_EVENT, function () {
    input.style.display = "none";
    alert('Buku berhasil disimpan!');
});
document.addEventListener(DELETE_EVENT, function () {
    alert('Buku berhasil dihapus');
});
document.addEventListener(EDIT_EVENT, function () {
    input.style.display = "none";
    alert('Buku berhasil diedit!');
});
document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBook = document.getElementById('uncompleted-wrap');
    const completedBook = document.getElementById('completed-wrap');
    uncompletedBook.innerHTML = '';
    completedBook.innerHTML = '';
    for (const itemBuku of daftarBuku) {
        const elemenBuku = inputBuku(itemBuku);
        if (itemBuku.isComplete === true) {
            completedBook.append(elemenBuku);
        } else {
            uncompletedBook.append(elemenBuku);
        }
    }
    count.innerText = daftarBuku.length;
});
add.addEventListener('click', function () {
    input.style.display = "block";
    submit.style.display = "inline";
    editBtn.style.display = "none";
});
cancel.addEventListener('click', function () {
    input.style.display = "none";
    form.removeChild(document.getElementsByClassName("eksekusi"));
});
search.addEventListener('click', function () {
    const title = document.getElementById('cari').value;
    cariBukuByJudul(title);

});