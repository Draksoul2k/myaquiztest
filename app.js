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

  // Open upgrade Pro modal hook
  window.openUpgradeModal = () => {
    const modal = document.getElementById("modalUpgradePro");
    if (modal) {
      const placeholder = document.getElementById("paymentContentPlaceholder");
      const activeState = store.getState();
      if (placeholder && activeState.user.email) {
        placeholder.innerText = `MYAQUIZ PRO ${activeState.user.email.split('@')[0].toUpperCase()}`;
      }
      resetPaymentModal();
      modal.classList.add("show");
    }
  };

  // 5. Set up global event listeners
  setupNavigation();
  setupModals();
  setupMobileHandlers();
  setupAuthLogout();
  initAmbientCanvas();
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
    const sub = store.getSubscriptionStatus();
    if (sub.plan === "Pro") {
      planBadge.innerText = "Pro";
      planBadge.className = "user-badge pro";
    } else if (sub.plan === "Trial") {
      planBadge.innerText = "Dùng thử";
      planBadge.className = "user-badge trial";
    } else {
      planBadge.innerText = "Miễn phí";
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

// Reset Payment Modal UI state
function resetPaymentModal() {
  const loadingArea = document.getElementById("paymentLoadingArea");
  const successArea = document.getElementById("paymentSuccessArea");
  if (loadingArea) loadingArea.style.display = "none";
  if (successArea) successArea.style.display = "none";
  
  const columns = document.querySelector(".payment-columns");
  if (columns) columns.style.display = "flex";
  
  const intro = document.querySelector(".payment-intro");
  if (intro) intro.style.display = "block";
  
  const footer = document.getElementById("paymentModalFooter");
  if (footer) footer.style.display = "flex";
  
  const btn = document.getElementById("btnConfirmPayment");
  if (btn) {
    btn.disabled = false;
    btn.querySelector("span").innerText = "Xác nhận đã chuyển khoản";
  }
}

// Modals event listeners
function setupModals() {
  const modalUpgradePro = document.getElementById("modalUpgradePro");
  
  document.getElementById("btnAddClass").addEventListener("click", () => modalCreateClass.classList.add("show"));
  document.getElementById("btnJoinClass").addEventListener("click", () => modalJoinClass.classList.add("show"));
  
  document.getElementById("btnJoinCampus").addEventListener("click", () => alert("Tính năng Gia nhập Campus yêu cầu kết nối mạng nội bộ trường học của bạn. Vui lòng liên hệ với Quản trị viên để được cấp quyền."));
  document.getElementById("btnFindCampus").addEventListener("click", () => alert("Đang quét tìm kiếm Campus lân cận... Hệ thống chưa phát hiện Campus công khai nào xung quanh khu vực của bạn."));

  // Closing modals
  document.querySelectorAll(".modal-close-btn, .modal-cancel-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      modalCreateClass.classList.remove("show");
      modalJoinClass.classList.remove("show");
      if (modalUpgradePro) modalUpgradePro.classList.remove("show");
      clearModalInputs();
      resetPaymentModal();
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
    if (e.target === modalUpgradePro) {
      modalUpgradePro.classList.remove("show");
      clearModalInputs();
      resetPaymentModal();
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

  // Confirm Payment simulated checkout listener
  const btnConfirm = document.getElementById("btnConfirmPayment");
  if (btnConfirm) {
    btnConfirm.addEventListener("click", () => {
      btnConfirm.disabled = true;
      
      // Hide payment details
      const columns = document.querySelector(".payment-columns");
      const intro = document.querySelector(".payment-intro");
      const footer = document.getElementById("paymentModalFooter");
      
      if (columns) columns.style.display = "none";
      if (intro) intro.style.display = "none";
      if (footer) footer.style.display = "none";
      
      // Show loading
      const loadingArea = document.getElementById("paymentLoadingArea");
      const statusText = document.getElementById("paymentSimulateStatusText");
      if (loadingArea) loadingArea.style.display = "flex";
      if (statusText) statusText.innerText = "Đang kết nối cổng ngân hàng xác thực...";
      
      setTimeout(() => {
        if (statusText) statusText.innerText = "Đã tìm thấy giao dịch! Đang tiến hành cộng hạn gói Pro...";
        
        setTimeout(() => {
          // Perform Pro upgrade in store
          store.upgradeToPro(1);
          
          // Show success step
          if (loadingArea) loadingArea.style.display = "none";
          const successArea = document.getElementById("paymentSuccessArea");
          if (successArea) successArea.style.display = "flex";
          
          setTimeout(() => {
            if (modalUpgradePro) modalUpgradePro.classList.remove("show");
            renderUserProfileWidget();
            window.refreshActiveView();
            resetPaymentModal();
          }, 2500);
        }, 1500);
      }, 1500);
    });
  }
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

// Global spotlight hover coordinates tracking for cards
document.addEventListener("mousemove", (e) => {
  const cards = document.querySelectorAll(".card, .suggested-exam-card, .item-list-card");
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
});

// Ambient Canvas Particle Network Logic
function initAmbientCanvas() {
  const canvas = document.getElementById("ambient-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  // Background drifting particles
  const particles = [];
  const maxParticles = 65;
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 0.8;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    
    draw() {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "rgba(17, 195, 236, 0.45)" : "rgba(0, 180, 216, 0.35)";
      ctx.fill();
    }
  }
  
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  // Interactive mouse trail particles
  const trailParticles = [];
  
  class TrailParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.radius = Math.random() * 2.5 + 1.2;
      this.alpha = 1.0;
      this.decay = Math.random() * 0.02 + 0.015; // Decays in ~40-60 frames
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }
    
    draw() {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark 
        ? `rgba(0, 240, 255, ${this.alpha * 0.8})` 
        : `rgba(0, 180, 216, ${this.alpha * 0.8})`;
      ctx.fill();
    }
  }
  
  let mouse = { x: null, y: null };
  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Spawn trail particles on mouse move (limit max to keep performance high)
    if (trailParticles.length < 120) {
      for (let i = 0; i < 2; i++) {
        trailParticles.push(new TrailParticle(e.clientX, e.clientY));
      }
    }
  });
  
  document.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // 1. Draw ambient glowing cursor halo
    if (mouse.x !== null && mouse.y !== null) {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 160);
      if (isDark) {
        gradient.addColorStop(0, "rgba(17, 195, 236, 0.12)");
        gradient.addColorStop(1, "rgba(17, 195, 236, 0)");
      } else {
        gradient.addColorStop(0, "rgba(0, 180, 216, 0.08)");
        gradient.addColorStop(1, "rgba(0, 180, 216, 0)");
      }
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 160, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    // 2. Draw background particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    // 3. Draw & update interactive trail particles
    for (let i = trailParticles.length - 1; i >= 0; i--) {
      const tp = trailParticles[i];
      tp.update();
      if (tp.alpha <= 0) {
        trailParticles.splice(i, 1);
      } else {
        tp.draw();
      }
    }
    
    // 4. Draw constellation lines between background particles
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const lineColor = isDark ? "rgba(17, 195, 236, " : "rgba(0, 180, 216, ";
    
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = lineColor + alpha + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      
      // 5. Draw connection lines between background particles and mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p1.x - mouse.x;
        const dy = p1.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.42;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = lineColor + alpha + ")";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

