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

  ReSetUI();
};

// This is the main function I need to look into
const onAddItemSubmit = (e) => {
  e.preventDefault();
  // Declare newItem which is the input value
  const newItem = input.value;
  if (newItem === "") {
    alert("Please add Item");
    return;
  }
  // check for editMode & not duplicating
  // NOW here is where we check if EditMode is true or false, i.e. if the item is set to Edit.
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");

    //If it is in edit mode, we check if the item text and the new item are equal, if equal we move on
    if (newItem != itemToEdit.textContent) {
      if (checkIfItemExists(newItem)) {
        alert("This item already exists");
        return;
      }
    } else {
    }
    // Essentially we are removing the item we are updating and then adding the new updated item inplace of it
    removeItemFromStorage(itemToEdit.textContent);
    // After removing the item from storage, we then take the ItemToEdit, and remove the editMode ClassList.... WHY ?
    itemToEdit.classList.remove("edit-mode");
    // Then we remove the Previous item itself
    itemToEdit.remove();
    // Then we set EditMode to false,
    isEditMode = false;
    // There are only four possibilities.1 we add Item, 2nd the input item is edited and 3rd input item already exists and finally 4th is no input is added
  } else {
    if (checkIfItemExists(newItem)) {
      alert("This item already exists");
      input.value = "";
      return;
    }
  }

  // Okay, so the above if statement checks if the item is in edit mode,
  // if it is then item is removed and we get out of the If block and then the new Edited input is submitted and added to DOM and Local storage

  // create Item DOm Element
  addItemToDOM(newItem);
  // Add new Item to local Storage
  additemToStorage(newItem);
  //   invoking the ReSetUI

  ReSetUI();
  //  then we reset the UI

  //   After Adding, we set the Input value to empty string for other Inputs to be added
  input.value = "";
  input.style.backgroundColor = "white";
  input.style.color = "black";
};

// check it item exsts
const checkIfItemExists = (item) => {
  const itemsFromStorage = getItemsFromStorage();
  const itemsFromStorageLowerCase = itemsFromStorage.map((i) => {
    return i.toLowerCase();
  });
  return itemsFromStorageLowerCase.includes(item.toLowerCase());
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

// Method to addItems in Storage
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

// This is an event Handler, which when we click itemList UL it checks firstly if we click the remove btn then it removes item.
const onClickItem = (e) => {
  if (e.target.parentElement.classList.contains("remove-item")) {
    // pass the list to the removeItem
    removeItem(e.target.parentElement.parentElement);
    // If it click is on the UL we break from the function
  } else if (e.target.classList.contains("items")) {
    return;
    // If not either then that means the item is clicked, and once the item is clicked we set the item to Edit Mode
  } else {
    setItemToEdit(e.target);
  }
};

// This is the method to edit, we add our item
const setItemToEdit = (item) => {
  isEditMode = true;
  // So essentially we do this to make sure by default all the Li do not have the Edit Mode ClassList on them
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  // Then for the particular Item we Selection, we only add the classList of EditMode to it
  item.classList.add("edit-mode");

  // The form btn is updated
  // Update form style
  formBtn.innerHTML = '<i class = "fa-solid fa-pen"></i> update Item';
  formBtn.style.backgroundColor = "green";
  formBtn.style.color = "white";

  // The selected Item is added to Input
  // Add Selected item to input
  input.value = item.textContent;

  // Changing styling of input
  // We chaneg style to show that when we are in editMode we have a diff Input
  input.style.color = "coral";
  input.style.backgroundColor = "black";
};

// We create the method to remove an item from DOM, then remove it LocalStorage and finally call the ResetUI()
const removeItem = (item) => {
  if (confirm("Are You sure?")) {
    if (item.classList.contains("edit-mode")) {
      formBtn.innerHTML = '<i class = "fa-solid fa-pen"></i> add Item';
      formBtn.style.backgroundColor = "#333";
      formBtn.style.color = "white";
      input.value = "";
      input.style.backgroundColor = "white";
      input.style.color = "black";
      //Remove the element
      item.remove();
      //Remove Item from Storage
      removeItemFromStorage(item.textContent);
      ReSetUI();
      isEditMode = false;
    } else {
    }
    //Remove the element
    item.remove();
    //Remove Item from Storage
    removeItemFromStorage(item.textContent);
    ReSetUI();
  }
};

// This function we use to remove all the items from Localstorage, we cannot directly remove we do a get Method and then we set it, by filtering the items which do not contain that element
//  to the Json object with the key Items.
const removeItemFromStorage = (item) => {
  let itemsFromStorage = getItemsFromStorage();
  // Filter out items to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set to localStorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};

const clearAll = () => {
  if (confirm("Are You sure?")) {
    // This while loop checks if there is a firstChild of itemList i.e. an Li, and keeps on removing it from DOM till the expression is false
    while (itemList.firstChild) {
      itemList.firstChild.remove();
    }

    // clearing from localStorage
    localStorage.removeItem("items");
    //   invoking the ReSetUI,
    ReSetUI();
  }
};

// Creating ReSetUI Function
// This function essentially is used to ReSets the UI basis the presence of Items(checking Clear and Filter Input)
const ReSetUI = () => {
  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "flex";
    itemFilter.style.display = "flex";
  }

  //  Once this function is called, we reset the Form Btn to add item, add the styles to it.
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
    // With this condition, we are checking each item and seeing if the item selected  i.e.text is matched with itemName (i.e. the text of all Lis)
    if (itemName.indexOf(text) !== -1) {
      item.style.display = "flex";
    } else item.style.display = "none";
  });
};

//  t's a common practice to write a function named init that's called when a page loads or a component is created to perform initial setup tasks.
const init = () => {
  // EventListeners
  form.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearAll);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);
  ReSetUI();
};

// Calling Init Function
init();
