const paginationNumbers = document.getElementById("pagination-numbers");
const paginatedTable = document.getElementById("paginated-table");
let tableItems;
let pageCount;
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
let leaderboard;

const paginationLimit = 10;

let currentPage = 1;

const disableButton = (button) => {
  button.classList.add("disabled");
  button.setAttribute("disabled", true);
};

const enableButton = (button) => {
  button.classList.remove("disabled");
  button.removeAttribute("disabled");
};

const handlePageButtonsStatus = () => {
  if (currentPage === 1) {
    disableButton(prevButton);
  } else {
    enableButton(prevButton);
  }

  if (pageCount === currentPage) {
    disableButton(nextButton);
  } else {
    enableButton(nextButton);
  }
};

const handleActivePageNumber = () => {
  document.querySelectorAll(".pagination-number").forEach((button) => {
    button.classList.remove("active");
    const pageIndex = Number(button.getAttribute("page-index"));
    if (pageIndex == currentPage) {
      button.classList.add("active");
    }
  });
};

const appendPageNumber = (index) => {
  const pageNumber = document.createElement("button");
  pageNumber.className = "pagination-number";
  pageNumber.innerHTML = index;
  pageNumber.setAttribute("page-index", index);
  pageNumber.setAttribute("aria-label", "Page " + index);

  paginationNumbers.appendChild(pageNumber);
};

const getPaginationNumbers = () => {  
  paginationNumbers.innerHTML = '';
  // Dynamically calculate bottom and top numbers to always have 5 numbers showing
  for (let i = Math.max(1, Math.min(Math.max(1, currentPage-2)+4, pageCount)-4); i <= Math.min(Math.max(1, currentPage-2)+4, pageCount); i++) {
    appendPageNumber(i);
  }
};

const setCurrentPage = (pageNum) => {
  currentPage = pageNum;
  getPaginationNumbers();

  handleActivePageNumber();
  handlePageButtonsStatus();
  
  const prevRange = (pageNum - 1) * paginationLimit;
  const currRange = pageNum * paginationLimit;

  tableItems.forEach((item, index) => {
    item.classList.add("hidden");
    if (index >= prevRange && index < currRange) {
      item.classList.remove("hidden");
    }
  });

  generatePaginationNumbersLinsteners();
};

const generatePaginationNumbersLinsteners = () => {
  document.querySelectorAll(".pagination-number").forEach((button) => {
    const pageIndex = Number(button.getAttribute("page-index"));

    if (pageIndex) {
      button.addEventListener("click", () => {
        setCurrentPage(pageIndex);
      });
    }
  });
}

function paginateTable () {
  tableItems = paginatedTable.querySelectorAll("tbody>tr");
  pageCount = Math.ceil(tableItems.length / paginationLimit);

  getPaginationNumbers();
  setCurrentPage(1);

  prevButton.addEventListener("click", () => {
    setCurrentPage(currentPage - 1);
  });

  nextButton.addEventListener("click", () => {
    setCurrentPage(currentPage + 1);
  });

  generatePaginationNumbersLinsteners();
}

function getLeaderboard() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    leaderboard = JSON.parse(this.response);
    fillLeaderboard();
    paginateTable();
    console.log(leaderboard);
  }
  xhttp.open("GET", "../src/libs/getLeaderboard.php");
  xhttp.send();
}

function fillLeaderboard() {
  const table = document.getElementById("tbody");
  leaderboard.forEach( item => {
    let row = table.insertRow();
    let username = row.insertCell(0);
    username.innerHTML = item.Username;
    let globalScore = row.insertCell(1);
    globalScore.innerHTML = item.Global_Score;
    let monthlyTokens = row.insertCell(2);
    monthlyTokens.innerHTML = item.Monthly_Tokens;
    let globalTokens = row.insertCell(3);
    globalTokens.innerHTML = item.Global_Tokens;
  });
}

getLeaderboard();

