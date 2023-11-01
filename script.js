const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");

function addItem(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  // Validate Input
  if (newItem === "") {
    alert("Please add an item");
    return;
  }
  // create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(newItem));

  const button = createButton("remove-item btn-link text-red");
  const icon = createIcon("fa-solid fa-xmark");

  button.appendChild(icon);

  li.appendChild(button);

  itemList.appendChild(li);
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

function removeItem(e) {
  // таргет - иконка, проверяем есть ли у родителя(кнопки), класс remove-item
  if (e.target.parentElement.classList.contains("remove-item")) {
    // После чего удаляем li... i -> button -> li
    e.target.parentElement.parentElement.remove();
  }
}

function clearItems(e) {
  // Простой вариант удаления
  // itemList.innerHTML = "";
  while (itemList.firstChild) {
    // Цикл с условием, пока у нас есть лист айтем
    itemList.removeChild(itemList.firstChild);
    // удаляем первый лист айтем, до тех пор пока их не останется
  }
}
// Event Listener
itemForm.addEventListener("submit", addItem);
itemList.addEventListener("click", removeItem);
clearBtn.addEventListener("click", clearItems);
