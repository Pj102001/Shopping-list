const form = document.querySelector("#item-form");
const input = document.querySelector("#item-input");
const itemList = document.querySelector("#item-list");
const clearBtn = document.querySelector("#clear");
const itemFilter = document.querySelector("#filter");
const formBtn = form.querySelector("button");
let isEditMode = false;

const displayItems = () => {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  // console.log(getItemsFromStorage());

  checkUi();
};

const onAddItemSubmit = (e) => {
  e.preventDefault();
  // console.log(input.value);
  const newItem = input.value;

  if (newItem === "") {
    alert("Please add Item");
    return;
  }

  // check for editMode & not duplicating
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    // Essentially we are removing the item we are updating and then adding the new updated item inplace of it
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");

    itemToEdit.remove();

    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert("This item already exists");
      input.value = "";
      return;
    }
  }

  // create Item DOm Element
  addItemToDOM(newItem);
  // Add new Item to local Storage
  additemToStorage(newItem);
  //   invoking the checkUi
  checkUi();
  //   setting input Value back to null
  input.value = "";
  input.style.backgroundColor = "white";
  input.style.color = "black";
};

// check it item exsts
const checkIfItemExists = (item) => {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
};

// Creating the function to add item to dom
const addItemToDOM = (item) => {
  // create new list item
  const newLi = document.createElement("li");
  newLi.appendChild(document.createTextNode(item));

  // create delete btn
  const button = createButton("remove-item btn-link text-black");

  // adding button to Li
  newLi.appendChild(button);
  itemList.appendChild(newLi);
};
const createButton = (classes) => {
  const button = document.createElement("button");
  button.className = classes;
  //   create delete Icon
  const deleteIcon = createIcon("fa-solid fa-xmark");
  button.append(deleteIcon);
  return button;
};

const createIcon = (classes) => {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
};

// Function to addItems in Storage
const additemToStorage = (item) => {
  const itemsFromStorage = getItemsFromStorage();

  // add New Item to Array
  itemsFromStorage.push(item);
  // convert to Json String and set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};

// function to get Items from storage
const getItemsFromStorage = () => {
  let itemsFromStorage;
  if (localStorage.getItem("items") !== null) {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  } else {
    itemsFromStorage = [];
  }
  return itemsFromStorage;
};

const onClickItem = (e) => {
  if (e.target.parentElement.classList.contains("remove-item")) {
    // pass the list to the removeItem
    removeItem(e.target.parentElement.parentElement);
  } else if (e.target.classList.contains("items")) {
    return;
  } else {
    setItemToEdit(e.target);
  }
};

const setItemToEdit = (item) => {
  isEditMode = true;
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");

  // Update form style
  formBtn.innerHTML = '<i class = "fa-solid fa-pen"></i> update Item';
  formBtn.style.backgroundColor = "green";
  formBtn.style.color = "white";

  // Add Selected item to input
  input.value = item.textContent;
  // Changing styling of input
  input.style.color = "coral";
  input.style.backgroundColor = "black";
};

const removeItem = (item) => {
  if (confirm("Are You sure?")) {
    //Remove the element
    item.remove();
    //Remove Item from Storage
    removeItemFromStorage(item.textContent);
    checkUi();
  }
};

const removeItemFromStorage = (item) => {
  let itemsFromStorage = getItemsFromStorage();
  // Filter out items to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set to localStorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};

const clearAll = (e) => {
  if (confirm("Are You sure?")) {
    while (itemList.firstChild) {
      itemList.firstChild.remove();
    }

    // clearing from localStorage
    localStorage.removeItem("items");
    //   invoking the checkUi
    checkUi();
  }
};

// Creating CheckUi Function
const checkUi = () => {
  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "flex";
    itemFilter.style.display = "flex";
  }

  formBtn.innerHTML = '<i class = "fa-solid fa-pen"></i> add Item';
  formBtn.style.backgroundColor = "#333";
  formBtn.style.color = "white";
};

// Creating the filter function
const filterItems = (e) => {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) !== -1) {
      item.style.display = "flex";
    } else item.style.display = "none";
  });
};

const init = () => {
  // EventListeners
  form.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearAll);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);
  checkUi();
};
init();
