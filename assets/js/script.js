'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}
const DISCORD_ID = "937302339793068042"; // Your Discord ID
let retryCount = 0;
const MAX_RETRIES = 3;

// DOM Elements
const elements = {
  title: document.getElementById('status-title'),
  details: document.getElementById('status-details'),
  icon: document.getElementById('activity-icon'),
  refreshBtn: document.getElementById('refresh-btn'),
  container: document.querySelector('.discord-activity-bar')
};

// Main Function
async function updateDiscordStatus() {
  try {
    showLoadingState();
    
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    if (!data.success) throw new Error(data.error?.message || "Invalid response");
    
    processActivityData(data.data);
    retryCount = 0; // Reset retry counter on success
    
  } catch (error) {
    handleStatusError(error);
  }
}

// Helper Functions
function showLoadingState() {
  elements.title.textContent = "Loading activity...";
  elements.details.textContent = "Connecting to Discord";
  elements.icon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  elements.container.className = "discord-activity-bar";
}

function processActivityData(data) {
  const activity = data.activities?.[0];
  
  // Update status colors
  updateStatusColor(data.discord_status);
  
  if (activity) {
    if (activity.name === "Spotify") {
      showSpotifyActivity(activity);
    } else if (activity.type === 0) {
      showGameActivity(activity);
    } else {
      showGenericActivity(activity);
    }
  } else {
    showDefaultStatus(data.discord_status);
  }
}

function updateStatusColor(status) {
  elements.container.classList.remove(
    'status-online', 'status-dnd', 'status-idle', 'status-offline', 'spotify-active'
  );
  elements.container.classList.add(`status-${status}`);
}

function showSpotifyActivity(activity) {
  elements.container.classList.add('spotify-active');
  elements.title.textContent = "Listening to Spotify";
  elements.details.textContent = `${activity.details || "No song info"} • ${activity.state || "No artist info"}`;
  
  elements.icon.innerHTML = activity.assets?.large_image 
    ? `<img src="https://i.scdn.co/image/${activity.assets.large_image.replace('spotify:', '')}" alt="Spotify">`
    : '<i class="fab fa-spotify"></i>';
}

function showGameActivity(activity) {
  elements.title.textContent = `Playing ${activity.name}`;
  elements.details.textContent = activity.details || activity.state || "In game";
  
  elements.icon.innerHTML = activity.assets?.large_image 
    ? `<img src="https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png" alt="${activity.name}">`
    : '<i class="fas fa-gamepad"></i>';
}

function showGenericActivity(activity) {
  elements.title.textContent = activity.name;
  elements.details.textContent = activity.details || activity.state || "Active now";
  elements.icon.innerHTML = '<i class="fas fa-desktop"></i>';
}

function showDefaultStatus(status) {
  elements.title.textContent = "Active on Discord";
  elements.details.textContent = status.charAt(0).toUpperCase() + status.slice(1);
  elements.icon.innerHTML = '<i class="fab fa-discord"></i>';
}

function handleStatusError(error) {
  console.error("Status Error:", error);
  
  if (retryCount < MAX_RETRIES) {
    retryCount++;
    setTimeout(updateDiscordStatus, 2000); // Retry after 3 seconds
    return;
  }
  
  elements.title.textContent = "Status Unavailable";
  elements.details.textContent = error.message.includes("404") 
    ? "Join Lanyard Discord and run /subscribe" 
    : "Check Discord desktop app";
  elements.icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
  elements.container.className = "discord-activity-bar";
}

// Event Listeners
elements.refreshBtn.addEventListener('click', () => {
  retryCount = 0;
  updateDiscordStatus();
});

// Initial Load
updateDiscordStatus();
// Auto-refresh every 15 seconds
setInterval(updateDiscordStatus, 15000);

document.addEventListener('DOMContentLoaded', function() {
  const progressBars = document.querySelectorAll('.skill-progress');
  
  // Animate on scroll
  const animateOnScroll = () => {
    progressBars.forEach(bar => {
      const barPosition = bar.getBoundingClientRect().top;
      const screenPosition = window.innerHeight * 0.8;
      
      if (barPosition < screenPosition) {
        const targetWidth = bar.getAttribute('data-percent');
        bar.style.width = targetWidth;
        animateCounter(bar.querySelector('.skill-percent'), parseInt(targetWidth));
      }
    });
  };
  
  // Animate percentage counter
  const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        clearInterval(timer);
        current = target;
      }
      element.textContent = Math.round(current) + '%';
    }, 30);
  };
  
  // Initial check
  animateOnScroll();
  
  // Check on scroll
  window.addEventListener('scroll', animateOnScroll);
});