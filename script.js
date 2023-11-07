const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  // Validate Input
  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  // Проверим влючен ли edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExist(newItem)) {
      alert("That item already exist");
      return;
    }
  }

  // Создать DOM элемент
  addItemToDOM(newItem);
  // Добавить элемент в хранилище
  addItemToStorage(newItem);
}

// create list item
function addItemToDOM(item) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  const icon = createIcon("fa-solid fa-xmark");

  button.appendChild(icon);
  li.appendChild(button);

  // Добавляем li в DOM и проверяем на наличие айтемов
  itemList.appendChild(li);
  checkUI();
  // После добавления айтема очищаем поле
  itemInput.value = "";
}

//  Отдельная функция для создания кнопок
function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  // Добавили айтем в массив
  itemsFromStorage.push(item);

  // Convert to JSON STRING и вернуть в локальное хранилище

  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsFromStorage;
}

function onClickItem(e) {
  // таргет - иконка, проверяем есть ли у родителя(кнопки), класс remove-item
  // if (e.target.parentElement.classList.contains("remove-item")) {
  //   // После чего удаляем li... i -> button -> li
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExist(item) {
  const itemsFromStorage = getItemsFromStorage();
  // Проверяем есть ли у нас уже такой айтем в хранилище
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll("li")
    .forEach((item) => item.classList.remove("edit-mode"));
  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class= "fa-solid fa-pen"></i>  Update Item';
  formBtn.style.backgroundColor = "#228b22";
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm("Are you sure?")) {
    // Удаление из DOM
    item.remove();
    // Удаление из Storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  // Filter отсеиваем айтемы для удаления (один из сложных методов массива как forEach)
  // Оставляем айтемы которые не являются айтемом из условия функции
  itemsFromStorage.filter((i) => i !== item);

  // Re-set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function clearItems(e) {
  // Простой вариант удаления
  // itemList.innerHTML = "";
  while (itemList.firstChild) {
    // Цикл с условием, пока у нас есть лист айтем
    itemList.removeChild(itemList.firstChild);
    // удаляем первый лист айтем, до тех пор пока их не останется
  }
  // Удаление с локального хранилища
  // localStorage.clear();
  localStorage.removeItem("items");
  checkUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    // const itemName = item.innerText;
    // firstChild можно применить, потоиу что первый элемент это textNode
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function checkUI() {
  itemInput.value = "";

  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    itemFilter.style.display = "none";
    clearBtn.style.display = "none";
  } else {
    itemFilter.style.display = "block";
    clearBtn.style.display = "block";
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";

  isEditMode = false;
}

// Мой вариант фильтра про продуктам
// function filterItems(e) {
//   const items = itemList.querySelectorAll("li");
//   items.forEach((item) => {
//     if (item.innerText.includes(itemFilter.value) === true) {
//     } else {
//       item.style.display = "none";
//     }
//     if (itemFilter.value === "") {
//       item.style.display = "flex";
//     }
//   });
// }
// itemFilter.addEventListener("keyup", filterItems);

// Initialize app
function init() {
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

init();
// Event Listener
// По поводу проверки: Проверять необходимо каждый раз при изменении числа айтемов и при загрузке страницы, это отличает js от фреймворков. При проверке надо знать текущее число li в ul поэтому нельзя задавать переменную в глобал скоупе.
