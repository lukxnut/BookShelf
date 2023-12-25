const unfinishContainer = document.querySelector('.unfinish-container');
const finishContainer = document.querySelector('.finish-container');
const BOOK_ITEMID = 'itemId';

const submitBtn = document.getElementById('submit-btn');
const selesaiCheck = document.querySelector('.form-element-check');

const twoButton = [
    '<span class="iconify book-btn" data-icon="teenyicons:tick-circle-solid" style="color: #22BB33;"></span>',
    '<span class="iconify book-btn" data-icon="ant-design:close-circle-filled" style="color: #BB2124;"></span>',
];

let editValue = false;
let editJudul;
let editPenulis;
let editTahun;
let editID;

const judul = document.getElementById('title');
const penulis = document.getElementById('author');
const tahun = document.getElementById('year');
const selesaiDibaca = document.getElementById('finish');

function addNewBook() {
    if (!editValue) {
        const bookObject = composeBookObject(judul.value, penulis.value, tahun.value, selesaiDibaca.checked);
        const book = renderNewBook(judul.value, penulis.value, tahun.value, selesaiDibaca.checked);

        book[BOOK_ITEMID] = bookObject.id;
        books.push(bookObject);
    } else {
        editJudul.innerText = judul.value;
        editPenulis.innerText = penulis.value;
        editTahun.innerText = tahun.value;

        editID.title = editJudul.innerText;
        editID.author = editPenulis.innerText;
        editID.year = editTahun.innerText;
    }

    setBackToDefault();
    updateDataToStorage();
}

function renderNewBook(judul, penulis, tahun, selesaiDibaca) {
    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book-card');
    bookContainer.classList.add('gentium');
    bookContainer.innerHTML = `<h1>${judul}</h1>
                        <h2>${penulis}</h2>
                        <h3>${tahun}</h3>`;

    if (selesaiDibaca) {
        createButton(bookContainer, 'unfinish-btn', twoButton[1], false);
        return finishContainer.appendChild(bookContainer);
    } else {
        createButton(bookContainer, 'finish-btn', twoButton[0], true);
        return unfinishContainer.appendChild(bookContainer);
    }
}

function createButton(bookContainer, className, icon, bool) {
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');
    btnContainer.classList.add('flex');
    btnContainer.innerHTML = `<button class="${className}">
                                ${icon}
                            </button>
                            <button class="delete-btn">
                                <span class="iconify book-btn" data-icon="fluent:delete-12-filled" style="color: #AAAAAA;"></span>
                            </button>
                            <button class="edit-btn">
                                <span class="iconify book-btn" data-icon="bxs:edit-location" style="color: #5BC0DE;"></span>
                            </button>`;

    addEventMovedBtn(btnContainer, '.' + className, bool);
    addEventDeleteBtn(btnContainer);
    addEventEditBtn(btnContainer);

    return bookContainer.appendChild(btnContainer);
}

function addEventMovedBtn(btnContainer, className, bool) {
    const movedBtn = btnContainer.querySelector(className);

    movedBtn.addEventListener('click', e => {
        const element = e.currentTarget.parentElement.parentElement;
        const judul = element.querySelector('.book-card h1').innerText;
        const penulis = element.querySelector('.book-card h2').innerText;
        const tahun = element.querySelector('.book-card h3').innerText;

        const newBook = renderNewBook(judul, penulis, tahun, bool);
        const book = findBook(element[BOOK_ITEMID]);

        book.isComplete = bool;
        newBook[BOOK_ITEMID] = book.id;

        element.remove();
        updateDataToStorage();
    });
}

function addEventDeleteBtn(btnContainer) {
    const deleteBtn = btnContainer.querySelector('.delete-btn');

    deleteBtn.addEventListener('click', e => {
        const element = e.currentTarget.parentElement.parentElement;

        const bookPosition = findBookIndex(element[BOOK_ITEMID]);
        books.splice(bookPosition, 1);

        element.remove();
        updateDataToStorage();
    });
}

function addEventEditBtn(btnContainer) {
    const editBtn = btnContainer.querySelector('.edit-btn');

    editBtn.addEventListener('click', e => {
        editValue = true;

        const element = e.currentTarget.parentElement.parentElement;
        editJudul = element.querySelector('.book-card h1');
        editPenulis = element.querySelector('.book-card h2');
        editTahun = element.querySelector('.book-card h3');

        editID = findBook(element[BOOK_ITEMID]);

        addBtn.style.display = 'none';
        addCard.style.display = 'block';
        selesaiCheck.style.display = 'none';

        judul.value = editJudul.innerText;
        penulis.value = editPenulis.innerText;
        tahun.value = editTahun.innerText;
        submitBtn.value = 'Edit';
    });
}

function searchBook() {
    const searchBox = document.getElementById('search-box');
    const eachBooks = document.querySelectorAll('.book-card');

    searchBox.addEventListener('keyup', () => {
        for (let i = 0; i < books.length; i++) {
            const title = eachBooks[i].querySelector('h1').innerText.toLowerCase();

            if (title.includes(searchBox.value.toLowerCase())) {
                eachBooks[i].style.display = 'block';
            } else {
                eachBooks[i].style.display = 'none';
            }
        }
    });
}

function setBackToDefault() {
    judul.value = '';
    penulis.value = '';
    tahun.value = '';
    submitBtn.value = 'Tambah';
    selesaiDibaca.checked = false;
    editValue = false;
    selesaiCheck.style.display = 'block';
}