// Function to download a file
function downloadFile(downloadPath) {
  const link = document.createElement("a");
  link.href = downloadPath;

  const filename = downloadPath.substring(downloadPath.lastIndexOf("/") + 1);
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.addEventListener("DOMContentLoaded", function () {
  const elements = {
    openBtn: document.getElementById("openModalBtn"), // Adjusted ID to match the HTML
    closeBtn: document.getElementById("closeEventModalBtn"),
    saveBtn: document.getElementById("saveEventBtn"),
    modal: document.getElementById("eventModal"),
    form: document.getElementById("eventForm"),
    timeline: document.getElementById("eventTimeline"),
    noEventsMsg: document.getElementById("noEventsMessage"),
    mainContent: document.getElementById("mainContent"),
  };

  const storedEventData = localStorage.getItem("eventData");
  const eventTimelineData = storedEventData ? JSON.parse(storedEventData) : [];

  const createEventItem = (week, title, desc, downloadPath) => {
    const item = document.createElement("li");
    item.classList.add("event");
    item.innerHTML = `<strong>${week}</strong>: ${title}`;
    item.addEventListener("click", () =>
      displayEventDetails(week, title, desc, downloadPath)
    );
    elements.timeline.appendChild(item);
    updateNoEventsVisibility();
  };

  const buildEventDetailsHTML = (week, title, desc, downloadPath) => `
    <article class="event-details">
      <p class="event-detail"><strong>Week:</strong> ${week}</p>
      <p class="event-detail"><strong>Title:</strong> ${title}</p>
      <p class="event-detail"><strong>Description:</strong> ${desc}</p>
      <button class="download-btn" onclick="downloadFile('${downloadPath}')">Download</button>
    </article>`;

  const updateNoEventsVisibility = () => {
    elements.noEventsMsg.style.display =
      eventTimelineData.length === 0 ? "block" : "none";
    elements.noEventsMsg.classList.toggle(
      "visible",
      eventTimelineData.length === 0
    );
  };

  const displayEventDetails = (week, title, desc, downloadPath) => {
    const currentDetails = elements.mainContent.querySelector(".event-details");
    currentDetails?.remove();

    const newDetails = buildEventDetailsHTML(week, title, desc, downloadPath);
    elements.mainContent.insertAdjacentHTML("beforeend", newDetails);
    updateNoEventsVisibility();
  };

  const saveEvent = () => {
    const week = document.getElementById("eventWeek").value;
    const title = document.getElementById("eventTitle").value;
    const desc = document.getElementById("eventDescription").value;

    if (week && title && desc) {
      const newEvent = { week, title, desc };
      eventTimelineData.push(newEvent);
      createEventItem(newEvent.week, newEvent.title, newEvent.desc);

      elements.modal.style.display = "none";
      updateNoEventsVisibility(); // Update visibility after saving the event
    }

    elements.form.reset();
  };

  const setupEventListeners = () => {
    elements.openBtn.addEventListener(
      "click",
      () => (elements.modal.style.display = "block")
    );
    elements.closeBtn.addEventListener(
      "click",
      () => (elements.modal.style.display = "none")
    );
    elements.saveBtn.addEventListener("click", saveEvent);
  };

  const readJson = () => {
    fetch("./json/data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch JSON (status ${response.status})`);
        }
        return response.json();
      })
      .then((json) => {
        if (!json || !json.data || !Array.isArray(json.data)) {
          console.error(
            "Invalid JSON structure. 'data' property not found or not an array."
          );
          return;
        }

        json.data.forEach((event) => {
          createEventItem(
            event.week,
            event.title,
            event.description,
            event.file_location
          );
          eventTimelineData.push({
            week: event.week,
            title: event.title,
            desc: event.description,
            downloadPath: event.file_location,
          });
        });

        // Update visibility after reading the JSON and creating events
        updateNoEventsVisibility();

        // Continue with other initializations
        setupEventListeners();
      })
      .catch((error) =>
        console.error("Error fetching or parsing JSON:", error)
      );
  };

  // Initialize the component
  const init = () => {
    readJson();
  };

  // Run the initialization
  init();
});
