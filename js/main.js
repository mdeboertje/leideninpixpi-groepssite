const readJson = () => {
  fetch("./json/data.json")
    .then((response) => response.json())
    .then((json) => {
      displayCards(json);
    })
    .catch((error) => console.error("Error fetching JSON:", error));
};

const buildCard = (pageInfo) => {
  return `
    <div class="custom-card">
      <div class="card-content">
        <h4>${pageInfo.studentnaam}</h4>
        <p>${pageInfo.omschrijving}</p>
        <a href="${pageInfo.url}"><i><img id="icon" src="./public/link.svg" /></i></a>
      </div>
    </div>
   `;
};

const displayCards = (json) => {
  const cardContainer = document.querySelector(".card-container");

  json.forEach((pageInfo, index) => {
    const card = document.createElement("div");
    card.innerHTML = buildCard(pageInfo);

    // Add a class to the card for styling purposes
    card.classList.add("card");

    // Determine if it's the first element of a row
    if (index % 2 === 0) {
      card.classList.add("start-new-row");
    }

    cardContainer.appendChild(card);
  });
};

function checkCode() {
  const puzzleCode = 1234;
  const enteredCode = document.getElementById("puzzleCode").value;

  if (enteredCode === puzzleCode.toString()) {
    readJson(); // Trigger fetching and displaying of cards
    const mainContainer = document.querySelector("container");
    const input = document.getElementById("codeInput");
    input.parentNode.removeChild(input);
    if (mainContainer) {
      mainContainer.innerHTML = "";
    }
  } else {
    alert("Verkeerde code");
  }
}
