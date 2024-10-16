const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const itemLists = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updateOnload = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let arrayList = [];

// Drag Functionality
let draggedItem;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  arrayList = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(arrayList[index]));
  });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updateOnload) {
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogListItem, index) => {
    createItemEl(backlogList, 0, backlogListItem, index);
  });

  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressListItem, index) => {
    createItemEl(progressList, 1, progressListItem, index);
  });

  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeListItem, index) => {
    createItemEl(completeList, 2, completeListItem, index);
  });

  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldListItem, index) => {
    createItemEl(onHoldList, 3, onHoldListItem, index);
  });

  // Run getSavedColumns only once, Update Local Storage
  updateOnload = true
  updateSavedColumns();
}

function rebuildArray() {
  backlogListArray = [];
  progressListArray = [];
  completeListArray = [];
  onHoldListArray = [];

  for ( let i = 0; i < backlogList.childNodes.length; i ++){
    backlogListArray.push(backlogList.childNodes[i].textContent);
  }

  for ( let i = 0; i < progressList.childNodes.length; i ++){
    progressListArray.push(progressList.childNodes[i].textContent);
  }

  for ( let i = 0; i < completeList.childNodes.length; i ++){
    completeListArray.push(completeList.childNodes[i].textContent);
  }

  for ( let i = 0; i < onHoldList.childNodes.length; i ++){
    onHoldListArray.push(onHoldList.childNodes[i].textContent);
  }

  updateDOM()
}

function drag(e) {
  draggedItem = e.target;
}

function dragEnter(column) {
  itemLists[column].classList.add("over");
  currentColumn = column;
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();

  itemLists.forEach((column) => {
    column.classList.remove("over");
  });

  let parent = itemLists[currentColumn];
  parent.appendChild(draggedItem);
  rebuildArray();
}

function addToColumn(column) {
  let selectedColumn = arrayList[column];
  let selectedText = addItems[column].textContent;
  selectedColumn.push(selectedText);
  addItems[column].textContent = '';
  updateDOM();
}

function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}



updateDOM();
