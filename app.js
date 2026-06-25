import * as store from './store.js';
import * as views from './views.js';

// DOM containers
const appContainer = document.getElementById("appContainer");
const authContainer = document.getElementById("authContainer");
const viewViewport = document.getElementById("viewViewport");

// Sidebar controls
const sidebar = document.querySelector(".sidebar");
const navItems = document.querySelectorAll(".nav-item");
const userProfileWidget = document.getElementById("userProfileWidget");

// Modals
const modalCreateClass = document.getElementById("modalCreateClass");
const modalJoinClass = document.getElementById("modalJoinClass");

// Active view tracker
let activeView = "home";

// Initialize Application
function init() {
  const state = store.getState();

  // 1. Initialize theme
  if (state.user.theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  // 2. Set up global authentication and rendering hooks
  window.onAuthSuccess = () => {
    authContainer.style.display = "none";
    appContainer.style.display = "flex";
    
    // Refresh widgets and load home view
    renderUserProfileWidget();
    renderSidebarClasses();
    activeView = "home";
    
    // Reset sidebar active item
    navItems.forEach(n => {
      if (n.getAttribute("data-view") === "home") n.classList.add("active");
      else n.classList.remove("active");
    });
    
    renderView("home");
  };

  window.onLogout = () => {
    appContainer.style.display = "none";
    authContainer.style.display = "flex";
    views.renderAuthScreen(authContainer);
  };

  window.refreshActiveView = () => renderView(activeView);
  window.updateSidebarClasses = () => renderSidebarClasses();
  window.refreshUserProfileWidget = () => renderUserProfileWidget();
  
  window.setActiveSidebar = (element) => {
    navItems.forEach(n => n.classList.remove("active"));
    element.classList.add("active");
    activeView = element.getAttribute("data-view");
    renderView(activeView);
  };

  // 3. Listen to messages from mock Google OAuth Pop-up
  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;
    
    if (event.data && event.data.type === "MYAQUIZ_GOOGLE_LOGIN") {
      const { email, name } = event.data;
      store.loginGoogle(email, name);
      window.onAuthSuccess();
    }
  });

  // 4. Check Auth state on startup
  if (state.isLoggedIn) {
    authContainer.style.display = "none";
    appContainer.style.display = "flex";
    
    renderUserProfileWidget();
    renderSidebarClasses();
    renderView(activeView);
  } else {
    appContainer.style.display = "none";
    authContainer.style.display = "flex";
    views.renderAuthScreen(authContainer);
  }

  // 5. Set up global event listeners
  setupNavigation();
  setupModals();
  setupMobileHandlers();
  setupAuthLogout();
}

// Render dynamic view
function renderView(viewName) {
  if (!viewViewport) return;

  // Show loading spinner briefly
  viewViewport.innerHTML = `
    <div class="loading-spinner-container">
      <div class="spinner"></div>
    </div>
  `;

  // Render correct content
  setTimeout(() => {
    switch (viewName) {
      case "home":
        views.renderHome(viewViewport);
        break;
      case "library":
        views.renderLibrary(viewViewport);
        break;
      case "exams":
        views.renderExams(viewViewport);
        break;
      case "qbank":
        views.renderQBank(viewViewport);
        break;
      case "settings":
        views.renderSettings(viewViewport);
        break;
      case "guide":
        views.renderGuide(viewViewport);
        break;
      default:
        views.renderHome(viewViewport);
    }
  }, 100);
}

// Render user profile details
function renderUserProfileWidget() {
  const state = store.getState();
  const displayName = document.getElementById("userDisplayName");
  const displayEmail = document.getElementById("userDisplayEmail");
  const planBadge = document.getElementById("userPlanBadge");
  const userAvatar = document.getElementById("userAvatar");
  const mobileAvatar = document.getElementById("mobileUserAvatar");

  const initial = state.user.name ? state.user.name.substring(0, 1).toUpperCase() : "U";

  if (displayName) displayName.innerText = state.user.name;
  if (displayEmail) displayEmail.innerText = state.user.email;
  
  if (state.user.avatarUrl) {
    if (userAvatar) userAvatar.innerHTML = `<img src="${state.user.avatarUrl}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    if (mobileAvatar) mobileAvatar.innerHTML = `<img src="${state.user.avatarUrl}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
  } else {
    if (userAvatar) userAvatar.innerText = initial;
    if (mobileAvatar) mobileAvatar.innerText = initial;
  }

  if (planBadge) {
    planBadge.innerText = state.user.plan;
    if (state.user.plan === "Pro") {
      planBadge.className = "user-badge pro";
    } else {
      planBadge.className = "user-badge";
    }
  }
}

// Render sidebar classes list
function renderSidebarClasses() {
  const state = store.getState();
  const list = document.getElementById("sidebarClassesList");
  if (!list) return;

  if (state.classes.length === 0) {
    list.innerHTML = `<p class="empty-list-text">Chưa có lớp học nào</p>`;
  } else {
    list.innerHTML = state.classes.map(c => `
      <div class="class-sidebar-item" data-class-id="${c.id}" title="${c.name}">
        <span class="class-dot"></span>
        <span class="class-name-text" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85rem;">${c.name}</span>
      </div>
    `).join('');

    // Clicking sidebar class opens details or filters in home view
    list.querySelectorAll(".class-sidebar-item").forEach(item => {
      item.addEventListener("click", () => {
        activeView = "home";
        navItems.forEach(n => {
          if (n.getAttribute("data-view") === "home") n.classList.add("active");
          else n.classList.remove("active");
        });
        renderView("home");
      });
    });
  }
}

// Navigation items click handling
function setupNavigation() {
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navItems.forEach(n => n.classList.remove("active"));
      item.classList.add("active");
      
      activeView = item.getAttribute("data-view");

      // Reset exams active state if going back to list
      if (activeView !== "exams") {
        window.currentExamDetailId = null;
      }

      renderView(activeView);

      // Close sidebar on mobile
      if (sidebar && sidebar.classList.contains("show")) {
        sidebar.classList.remove("show");
      }
    });
  });

  // Bottom user profile widget click routes to settings
  if (userProfileWidget) {
    userProfileWidget.addEventListener("click", () => {
      navItems.forEach(n => {
        if (n.getAttribute("data-view") === "settings") n.classList.add("active");
        else n.classList.remove("active");
      });
      activeView = "settings";
      renderView("settings");
    });
  }
}

// Modals event listeners
function setupModals() {
  document.getElementById("btnAddClass").addEventListener("click", () => modalCreateClass.classList.add("show"));
  document.getElementById("btnJoinClass").addEventListener("click", () => modalJoinClass.classList.add("show"));
  
  document.getElementById("btnJoinCampus").addEventListener("click", () => alert("Tính năng Gia nhập Campus yêu cầu kết nối mạng nội bộ trường học của bạn. Vui lòng liên hệ với Quản trị viên để được cấp quyền."));
  document.getElementById("btnFindCampus").addEventListener("click", () => alert("Đang quét tìm kiếm Campus lân cận... Hệ thống chưa phát hiện Campus công khai nào xung quanh khu vực của bạn."));

  // Closing modals
  document.querySelectorAll(".modal-close-btn, .modal-cancel-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      modalCreateClass.classList.remove("show");
      modalJoinClass.classList.remove("show");
      clearModalInputs();
    });
  });

  // Outside click closes modal
  window.addEventListener("click", (e) => {
    if (e.target === modalCreateClass) {
      modalCreateClass.classList.remove("show");
      clearModalInputs();
    }
    if (e.target === modalJoinClass) {
      modalJoinClass.classList.remove("show");
      clearModalInputs();
    }
  });

  // Submit Create Class
  document.getElementById("btnSubmitCreateClass").addEventListener("click", () => {
    const nameInput = document.getElementById("newClassName");
    const subjectInput = document.getElementById("newClassSubject");
    const descInput = document.getElementById("newClassDesc");

    const name = nameInput.value.trim();
    if (!name) {
      alert("Vui lòng điền tên lớp học!");
      return;
    }

    store.addClass(name, subjectInput.value.trim(), descInput.value.trim());
    modalCreateClass.classList.remove("show");
    clearModalInputs();

    // Refresh UI
    renderSidebarClasses();
    renderView(activeView);
  });

  // Submit Join Class
  document.getElementById("btnSubmitJoinClass").addEventListener("click", () => {
    const codeInput = document.getElementById("classCodeInput");
    const code = codeInput.value.trim();
    if (!code) {
      alert("Vui lòng nhập mã lớp học!");
      return;
    }

    store.addClass(`Lớp liên kết: Mã ${code.toUpperCase()}`, "Tổng hợp", "Lớp học được liên kết trực tuyến");
    modalJoinClass.classList.remove("show");
    clearModalInputs();

    alert(`Tham gia lớp học thành công! Lớp học liên kết đã được thêm vào tài khoản của bạn.`);

    renderSidebarClasses();
    renderView(activeView);
  });
}

function clearModalInputs() {
  const inputs = [
    "newClassName", "newClassSubject", "newClassDesc", "classCodeInput"
  ];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

// Mobile sidebar hamburger & close button
function setupMobileHandlers() {
  const menuHamburger = document.getElementById("menuHamburger");
  const sidebarToggle = document.getElementById("sidebarToggle");

  if (menuHamburger) {
    menuHamburger.addEventListener("click", () => {
      sidebar.classList.add("show");
    });
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.remove("show");
    });
  }
}

// Setup Auth Logout sidebar item listener
function setupAuthLogout() {
  const btnLogout = document.getElementById("btnSidebarLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      if (confirm("Bạn có muốn đăng xuất khỏi MyaQuiz không?")) {
        store.logout();
        window.onLogout();
      }
    });
  }
}

// Initialize on load
document.addEventListener("DOMContentLoaded", init);
