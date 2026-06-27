import * as store from './store.js?v=1.7';

// Pre-defined exam templates for AI generation fallback if API Key is missing
const MOCK_EXAM_TEMPLATES = {
  toan: {
    title: "Đề thi trắc nghiệm Toán: Giải tích & Đạo hàm nâng cao",
    subject: "Toán",
    questions: [
      {
        text: "Tính đạo hàm của hàm số y = ln(x^2 + 1).",
        options: ["y' = 1 / (x^2 + 1)", "y' = 2x / (x^2 + 1)", "y' = x / (x^2 + 1)", "y' = 2x(x^2 + 1)"],
        answer: 1,
        explanation: "Áp dụng công thức đạo hàm hàm hợp: (ln u)' = u'/u. Với u = x^2 + 1, ta có u' = 2x. Do đó y' = 2x/(x^2+1)."
      },
      {
        text: "Cho hàm số y = x^3 - 3x^2 + 2. Khẳng định nào sau đây là đúng?",
        options: [
          "Hàm số nghịch biến trên khoảng (0; 2)",
          "Hàm số đồng biến trên khoảng (0; 2)",
          "Hàm số nghịch biến trên khoảng (-∞; 0)",
          "Hàm số đồng biến trên khoảng (2; +∞) và nghịch biến trên khoảng (0; 2)"
        ],
        answer: 3,
        explanation: "Ta có y' = 3x^2 - 6x. Cho y' = 0 => x = 0 hoặc x = 2. Khảo sát dấu y', ta thấy y' < 0 trên (0; 2) (nghịch biến) và y' > 0 trên (2; +∞) (đồng biến)."
      },
      {
        text: "Tìm giá trị cực đại y_CD của hàm số y = -x^3 + 3x + 1.",
        options: ["y_CD = 3", "y_CD = -1", "y_CD = 1", "y_CD = 2"],
        answer: 0,
        explanation: "y' = -3x^2 + 3. Cho y' = 0 => x = ±1. Điểm cực đại là x = 1 (vì đạo hàm đổi dấu từ dương sang âm qua x=1). y(1) = -1 + 3 + 1 = 3."
      }
    ]
  },
  tienganh: {
    title: "Đề kiểm tra Tiếng Anh: Ngữ pháp tổng hợp & Reading",
    subject: "Tiếng Anh",
    questions: [
      {
        text: "If I ___ you, I would accept the job offer immediately.",
        options: ["am", "was", "were", "would be"],
        answer: 2,
        explanation: "Câu điều kiện loại 2 (diễn tả giả định không có thật ở hiện tại). Cấu trúc: If + S + V2/ed (tobe dùng 'were' cho tất cả các ngôi), S + would + V-inf."
      },
      {
        text: "The book ___ by a famous author last year became a best-seller.",
        options: ["written", "writing", "which wrote", "was written"],
        answer: 0,
        explanation: "Dùng mệnh đề quan hệ rút gọn ở dạng bị động (phân từ 2 'written') vì cuốn sách được viết bởi tác giả. Câu gốc: 'The book which was written by...'"
      },
      {
        text: "Identify the synonym of the word 'ABANDON':",
        options: ["Keep", "Support", "Desert", "Adopt"],
        answer: 2,
        explanation: "Abandon nghĩa là từ bỏ, ruồng bỏ, đồng nghĩa với 'Desert' (bỏ hoang, bỏ mặc)."
      }
    ]
  },
  vatly: {
    title: "Đề khảo sát Vật lý: Dao động điều hòa & Sóng cơ học",
    subject: "Vật lý",
    questions: [
      {
        text: "Một vật dao động điều hòa theo phương trình x = A.cos(ωt + φ). Gia tốc của vật tại li độ x là:",
        options: ["a = ω^2.x", "a = -ω^2.x", "a = -ω.x", "a = ω.x^2"],
        answer: 1,
        explanation: "Gia tốc a là đạo hàm bậc hai của li độ x theo thời gian. Ta có mối liên hệ a = -ω^2.x."
      },
      {
        text: "Trong sóng cơ học, tốc độ truyền sóng phụ thuộc chủ yếu vào yếu tố nào?",
        options: ["Tần số sóng", "Biên độ sóng", "Bản chất của môi trường truyền sóng", "Bước sóng"],
        answer: 2,
        explanation: "Tốc độ truyền sóng cơ học chỉ phụ thuộc vào bản chất môi trường truyền (độ đàn hồi, nhiệt độ, mật độ phần tử,...), không phụ thuộc tần số hay biên độ."
      }
    ]
  },
  default: {
    title: "Đề khảo sát năng lực tổng hợp tự động",
    subject: "Tổng hợp",
    questions: [
      {
        text: "Hệ thống AI đã tổng hợp đề thi dựa trên yêu cầu của bạn. Câu hỏi 1: Đâu là thủ đô của Việt Nam?",
        options: ["Thành phố Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Huế"],
        answer: 1,
        explanation: "Hà Nội là thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam."
      },
      {
        text: "Câu hỏi 2: AI (Trí tuệ nhân tạo) viết tắt của từ nào trong tiếng Anh?",
        options: ["Artificial Intelligence", "Automated Information", "Active Integration", "Analytical Instrument"],
        answer: 0,
        explanation: "AI viết tắt từ Artificial Intelligence, dịch sang tiếng Việt là Trí tuệ nhân tạo."
      },
      {
        text: "Câu hỏi 3: Trái đất quay quanh mặt trời mất khoảng bao lâu?",
        options: ["24 giờ", "30 ngày", "365 ngày (1 năm)", "28 ngày"],
        answer: 2,
        explanation: "Trái Đất mất khoảng 365,25 ngày để hoàn thành một vòng quỹ đạo quanh Mặt Trời."
      }
    ]
  }
};

// Helper function to decode JWT from Google Sign-In SDK
export function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT Decode error:", e);
    return null;
  }
}

// State tracker for active navigation
window.currentExamDetailId = null;
let quizState = null; // { examId, answers: {}, submitted: false }

// Helper function to format date
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

// --------------------------------------------------------------------------
// 0. RENDER AUTHENTICATION VIEW (LOGIN / REGISTER)
// --------------------------------------------------------------------------
export function renderAuthScreen(container) {
  let activeTab = "login"; // "login" or "register"
  const state = store.getState();
  
  function render() {
    container.innerHTML = `
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo-area">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 36px; height: 36px;">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#logo-grad-auth)" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="logo-grad-auth" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#00f0ff" />
                  <stop offset="1" stop-color="#0072ff" />
                </linearGradient>
              </defs>
            </svg>
            <span class="auth-brand" style="font-size: 1.85rem;">MyaQuiz<span class="brand-dot">.ai</span></span>
          </div>
          <p class="auth-subtitle">Trình tạo câu hỏi trắc nghiệm & đề thi thông minh bằng AI</p>
        </div>

        <div class="auth-tab-buttons">
          <button class="auth-tab ${activeTab === 'login' ? 'active' : ''}" id="tabSelectLogin">Đăng nhập</button>
          <button class="auth-tab ${activeTab === 'register' ? 'active' : ''}" id="tabSelectRegister">Đăng ký</button>
        </div>

        <form class="auth-form" id="authSubmitForm">
          ${activeTab === 'register' ? `
            <div class="form-group" style="margin-bottom: 0;">
              <label for="authName">Tên hiển thị <span class="required">*</span></label>
              <input type="text" id="authName" placeholder="Tên của bạn" required />
            </div>
          ` : ''}
          
          <div class="form-group" style="margin-bottom: 0;">
            <label for="authEmail">Địa chỉ Email <span class="required">*</span></label>
            <input type="email" id="authEmail" placeholder="name@example.com" value="" required />
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label for="authPassword">Mật khẩu <span class="required">*</span></label>
            <input type="password" id="authPassword" placeholder="Nhập mật khẩu" value="" required />
          </div>

          <div class="form-group" style="margin-bottom: 12px; margin-top: 10px;">
            <label style="margin-bottom: 6px;">Vai trò đăng nhập <span class="required">*</span></label>
            <div style="display: flex; gap: 12px; width: 100%;">
              <label id="roleTeacherCard" style="flex: 1; border: 2px solid hsl(var(--primary)); border-radius: var(--radius-md); padding: 12px; display: flex; align-items: center; gap: 8px; cursor: pointer; background: var(--bg-card); transition: all var(--transition-fast);" class="role-selector-card">
                <input type="radio" name="authRole" value="teacher" checked style="cursor: pointer;" />
                <div style="display: flex; flex-direction: column;">
                  <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-main);">Giáo viên</span>
                  <span style="font-size: 0.7rem; color: var(--text-muted);">Soạn đề, tải đáp án</span>
                </div>
              </label>
              <label id="roleStudentCard" style="flex: 1; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; display: flex; align-items: center; gap: 8px; cursor: pointer; background: var(--bg-card); transition: all var(--transition-fast);" class="role-selector-card">
                <input type="radio" name="authRole" value="student" style="cursor: pointer;" />
                <div style="display: flex; flex-direction: column;">
                  <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-main);">Học sinh</span>
                  <span style="font-size: 0.7rem; color: var(--text-muted);">Làm đề ôn tập, ẩn giải thích câu đúng</span>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="padding: 12px; margin-top: 10px; font-size: 0.95rem;">
            ${activeTab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
          </button>
        </form>

        <div class="auth-divider">hoặc</div>

        <!-- This container renders Google SDK Sign-In Button if Client ID is configured, otherwise fallback to styled custom simulated popup button -->
        <div id="googleButtonContainer" style="display: flex; justify-content: center; width: 100%;">
          <button class="btn-google" id="btnGoogleLogin" style="width: 100%;">
            <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Đăng nhập với Google</span>
          </button>
        </div>
      </div>
    `;

    // Tab selection listeners
    document.getElementById("tabSelectLogin").addEventListener("click", () => {
      activeTab = "login";
      render();
    });
    document.getElementById("tabSelectRegister").addEventListener("click", () => {
      activeTab = "register";
      render();
    });

    // Setup change listeners for role selectors to highlight the active card
    const roleRadios = container.querySelectorAll('input[name="authRole"]');
    roleRadios.forEach(radio => {
      radio.addEventListener("change", () => {
        const teacherCard = document.getElementById("roleTeacherCard");
        const studentCard = document.getElementById("roleStudentCard");
        if (radio.value === "teacher") {
          teacherCard.style.borderColor = "hsl(var(--primary))";
          teacherCard.style.borderWidth = "2px";
          studentCard.style.borderColor = "var(--border-color)";
          studentCard.style.borderWidth = "1px";
        } else {
          studentCard.style.borderColor = "hsl(var(--primary))";
          studentCard.style.borderWidth = "2px";
          teacherCard.style.borderColor = "var(--border-color)";
          teacherCard.style.borderWidth = "1px";
        }
      });
    });

    // Form submit logic
    document.getElementById("authSubmitForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("authEmail").value.trim();
      const password = document.getElementById("authPassword").value;
      const roleEl = container.querySelector('input[name="authRole"]:checked');
      const role = roleEl ? roleEl.value : "teacher";

      if (activeTab === "login") {
        const success = store.login(email, password, role);
        if (success) {
          window.onAuthSuccess();
        } else {
          alert("Email hoặc mật khẩu không hợp lệ! (Mẹo: Mặc định là dalk2000vtp@gmail.com / mật khẩu 123)");
        }
      } else {
        const name = document.getElementById("authName").value.trim();
        const success = store.register(name, email, password, role);
        if (success) {
          alert("Đăng ký thành công!");
          window.onAuthSuccess();
        } else {
          alert("Email này đã được sử dụng!");
        }
      }
    });

    // Setup Google Sign In
    setTimeout(() => {
      if (state.user.googleClientId && typeof google !== "undefined" && google.accounts) {
        // Render OFFICIAL Google Button using the GSI SDK
        try {
          google.accounts.id.initialize({
            client_id: state.user.googleClientId,
            callback: (response) => {
              const decoded = decodeJwt(response.credential);
              if (decoded) {
                const roleEl = container.querySelector('input[name="authRole"]:checked');
                const role = roleEl ? roleEl.value : "teacher";
                store.loginGoogle(decoded.email, decoded.name, decoded.picture, role);
                window.onAuthSuccess();
              }
            }
          });
          
          google.accounts.id.renderButton(
            document.getElementById("googleButtonContainer"),
            { theme: "outline", size: "large", width: 360 }
          );
        } catch (err) {
          console.error("Lỗi Google One Tap init:", err);
          setupSimulatedGooglePopup();
        }
      } else {
        // Fallback to custom pop-up simulation if client ID is not configured
        setupSimulatedGooglePopup();
      }
    }, 100);
  }

  function setupSimulatedGooglePopup() {
    const btnGoogle = document.getElementById("btnGoogleLogin");
    if (!btnGoogle) return;

    btnGoogle.addEventListener("click", () => {
      const email = prompt("Nhập Email Google của bạn để liên kết:");
      if (!email || !email.trim()) return;
      let name = prompt("Nhập Họ & Tên của bạn:");
      if (!name || !name.trim()) name = email.split('@')[0];
      const roleEl = container.querySelector('input[name="authRole"]:checked');
      const role = roleEl ? roleEl.value : "teacher";
      store.loginGoogle(email.trim(), name.trim(), "", role);
      window.onAuthSuccess();
    });
  }

  render();
}

// --------------------------------------------------------------------------
// 1. RENDER HOME VIEW
// --------------------------------------------------------------------------
export function renderHome(container) {
  const state = store.getState();
  
  // Render structure
  container.innerHTML = `
    <div class="welcome-header">
      <h1 class="welcome-title">Xin chào, <span id="homeUserGreeting">${state.user.name}</span> 👋</h1>
      <p class="view-subtitle" style="color: var(--text-muted);">Chào mừng bạn đến với MyaQuiz. Hôm nay bạn muốn tạo đề trắc nghiệm hay bài giảng nào?</p>
    </div>

    <!-- AI Composer Card -->
    <div class="ai-composer-card card">
      <textarea class="ai-composer-textarea" id="aiPromptInput" placeholder="Soạn bài giảng chuyên nghiệp với AI (Ví dụ: 'Soạn 10 câu trắc nghiệm Toán đạo hàm lớp 12' hoặc dán nội dung bài giảng tại đây để số hóa...)..."></textarea>
      
      <!-- Attachment preview row -->
      <div class="attached-files-row" id="attachedFilesRow" style="display: none;"></div>

      <div class="ai-composer-actions">
        <div class="ai-composer-left">
          <div class="composer-select-wrapper">
            <select class="composer-select" id="aiGenerateType">
              <option value="tracnghiem">Tạo đề trắc nghiệm</option>
              <option value="tuluan">Tạo đề tự luận</option>
              <option value="baigiang">Tạo từ bài giảng</option>
              <option value="tronde">Trộn đề thi</option>
            </select>
          </div>
          <button class="btn-attach" id="btnComposerAttach">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            <span>Đính kèm</span>
          </button>
          <input type="file" id="composerFileInput" accept=".txt,.md,.pdf,.docx,image/*" multiple style="display: none;">
        </div>
        <button class="btn btn-primary" id="btnComposerSubmit">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
          <span>Gửi AI</span>
        </button>
      </div>
    </div>

    <!-- Sections Grid: Classes & Workspaces -->
    <div class="home-sections-grid">
      <!-- Classes Card -->
      <div class="card">
        <div class="section-card-header">
          <h2 class="section-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><path d="M12 11v6M9 14h6"/></svg>
            Lớp học của bạn
          </h2>
          <button class="btn-add-section" id="btnHomeAddClass" title="Thêm lớp học">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        <div id="homeClassesContainer"></div>
      </div>

      <!-- Workspaces Card -->
      <div class="card">
        <div class="section-card-header">
          <h2 class="section-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><path d="M2 10h20"/></svg>
            Không gian làm việc
          </h2>
          <button class="btn-add-section" id="btnHomeAddWorkspace" title="Thêm Workspace mới">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        <div id="homeWorkspacesContainer"></div>
      </div>
    </div>

    <!-- Suggested Exams Carousel -->
    <div class="carousel-section">
      <div class="carousel-header">
        <h2 class="carousel-title">Đề thi gợi ý từ MyaQuiz</h2>
        <div class="carousel-controls">
          <button class="carousel-arrow" id="carouselPrev">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button class="carousel-arrow" id="carouselNext">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      <div class="carousel-track-wrapper" id="carouselWrapper">
        <div class="carousel-track">
          <!-- Item 1 -->
          <div class="suggested-exam-card">
            <div class="suggested-header">
              <span class="suggested-tag">Toán Học</span>
              <h3 class="suggested-title">Đề ôn thi THPT Quốc Gia - Giải tích</h3>
              <p class="suggested-meta">50 câu trắc nghiệm • Gợi ý từ AI</p>
            </div>
            <button class="btn btn-secondary btn-sm btn-use-template" data-template-id="toan">Sử dụng mẫu</button>
          </div>
          <!-- Item 2 -->
          <div class="suggested-exam-card">
            <div class="suggested-header">
              <span class="suggested-tag" style="background-color: #e0f2fe; color: #075985;">Tiếng Anh</span>
              <h3 class="suggested-title">Đề Kiểm Tra Tiếng Anh Học Kỳ 1</h3>
              <p class="suggested-meta">40 câu hỏi trắc nghiệm</p>
            </div>
            <button class="btn btn-secondary btn-sm btn-use-template" data-template-id="tienganh">Sử dụng mẫu</button>
          </div>
          <!-- Item 3 -->
          <div class="suggested-exam-card">
            <div class="suggested-header">
              <span class="suggested-tag" style="background-color: #fef3c7; color: #92400e;">Vật Lý</span>
              <h3 class="suggested-title">Khảo sát Dao động điều hòa 15 phút</h3>
              <p class="suggested-meta">20 câu hỏi trắc nghiệm lý thuyết</p>
            </div>
            <button class="btn btn-secondary btn-sm btn-use-template" data-template-id="vatly">Sử dụng mẫu</button>
          </div>
          <!-- Item 4 -->
          <div class="suggested-exam-card">
            <div class="suggested-header">
              <span class="suggested-tag" style="background-color: #dcfce7; color: #166534;">Hóa Học</span>
              <h3 class="suggested-title">Đề ôn tập chương este & chất béo</h3>
              <p class="suggested-meta">30 câu trắc nghiệm • Gợi ý từ AI</p>
            </div>
            <button class="btn btn-secondary btn-sm btn-use-template" data-template-id="default">Sử dụng mẫu</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Render subcomponents
  renderHomeClasses(state);
  renderHomeWorkspaces(state);

  // Setup Event Listeners
  setupHomeListeners(container);
}

function renderHomeClasses(state) {
  const container = document.getElementById("homeClassesContainer");
  if (!container) return;

  if (state.classes.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <h3 class="empty-state-title">Chưa có lớp học nào</h3>
        <p class="empty-state-subtitle">Thêm lớp học để phân phối đề thi và chấm điểm trực tiếp.</p>
        <button class="empty-state-btn" id="btnHomeClassesEmptyAdd">Thêm lớp</button>
      </div>
    `;
    document.getElementById("btnHomeClassesEmptyAdd").addEventListener("click", () => {
      document.getElementById("modalCreateClass").classList.add("show");
    });
  } else {
    container.innerHTML = `
      <div class="items-list-grid">
        ${state.classes.map(c => `
          <div class="item-list-card">
            <div class="item-card-info">
              <span class="item-card-title">${c.name}</span>
              <span class="item-card-subtitle">Môn: ${c.subject} ${c.desc ? `• ${c.desc}` : ''}</span>
            </div>
            <div class="item-card-actions">
              <button class="btn-icon-only btn-delete-class" data-class-id="${c.id}" title="Xóa lớp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    // Add delete listeners
    container.querySelectorAll(".btn-delete-class").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-class-id");
        if (confirm("Bạn có chắc chắn muốn xóa lớp học này không?")) {
          store.removeClass(id);
          window.refreshActiveView();
          window.updateSidebarClasses();
        }
      });
    });
  }
}

function renderHomeWorkspaces(state) {
  const container = document.getElementById("homeWorkspacesContainer");
  if (!container) return;

  if (state.workspaces.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </div>
        <h3 class="empty-state-title">Chưa có workspace nào</h3>
        <p class="empty-state-subtitle">Bắt đầu tạo đề thi bằng AI hoặc số hóa đề có sẵn.</p>
        <button class="empty-state-btn" id="btnHomeWSAddEmpty">Tạo workspace</button>
      </div>
    `;
    document.getElementById("btnHomeWSAddEmpty").addEventListener("click", () => {
      promptAddWorkspace();
    });
  } else {
    container.innerHTML = `
      <div class="items-list-grid">
        ${state.workspaces.map(w => {
          const count = state.exams.filter(e => e.workspaceId === w.id).length;
          return `
            <div class="item-list-card">
              <div class="item-card-info">
                <span class="item-card-title">${w.name}</span>
                <span class="item-card-subtitle">${count} tài liệu / đề thi</span>
              </div>
              <div class="item-card-actions">
                <button class="btn-icon-only btn-delete-ws" data-ws-id="${w.id}" title="Xóa workspace">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Add delete listeners
    container.querySelectorAll(".btn-delete-ws").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-ws-id");
        if (confirm("Xóa workspace này? Các đề thi bên trong sẽ không bị xóa mà chuyển sang mục không phân loại.")) {
          store.removeWorkspace(id);
          window.refreshActiveView();
        }
      });
    });
  }
}

function promptAddWorkspace() {
  const name = prompt("Nhập tên không gian làm việc (Workspace) mới:");
  if (name && name.trim()) {
    store.addWorkspace(name.trim());
    window.refreshActiveView();
  }
}

let attachedFiles = [];

function setupHomeListeners(container) {
  // Add Class Click
  document.getElementById("btnHomeAddClass").addEventListener("click", () => {
    document.getElementById("modalCreateClass").classList.add("show");
  });

  // Add Workspace Click
  document.getElementById("btnHomeAddWorkspace").addEventListener("click", () => {
    promptAddWorkspace();
  });

  // Carousel Controls
  const wrapper = document.getElementById("carouselWrapper");
  document.getElementById("carouselPrev").addEventListener("click", () => {
    wrapper.scrollBy({ left: -270, behavior: 'smooth' });
  });
  document.getElementById("carouselNext").addEventListener("click", () => {
    wrapper.scrollBy({ left: 270, behavior: 'smooth' });
  });

  // Handle Mock Template clone
  container.querySelectorAll(".btn-use-template").forEach(btn => {
    btn.addEventListener("click", () => {
      const templateId = btn.getAttribute("data-template-id");
      const template = MOCK_EXAM_TEMPLATES[templateId] || MOCK_EXAM_TEMPLATES.default;
      
      const newExam = store.addExam({
        title: `${template.title} (Bản sao)`,
        subject: template.subject,
        questions: template.questions
      });

      alert(`Đã lưu mẫu đề thi vào Thư viện của bạn!`);
      // Navigate to Exam detail
      navigateToExamDetail(newExam.id);
    });
  });

  // File Attachment handling
  const btnAttach = document.getElementById("btnComposerAttach");
  const fileInput = document.getElementById("composerFileInput");
  const attachedRow = document.getElementById("attachedFilesRow");
  
  btnAttach.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Show spinner in attached files list while reading
    attachedRow.style.display = "flex";
    attachedRow.innerHTML = `<span style="font-size: 0.85rem; color: var(--text-muted); padding: 6px;"><div class="spinner" style="width:16px; height:16px; border-width:2px; display:inline-block; vertical-align:middle; margin-right:6px;"></div> Đang đọc tệp tin đính kèm...</span>`;

    for (const file of files) {
      if (attachedFiles.some(f => f.name === file.name)) continue;
      
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        textContent: "",
        isImage: file.type.startsWith("image/"),
        base64Data: ""
      };
      
      try {
        if (fileData.isImage) {
          const base64DataUrl = await readFileAsDataURL(file);
          fileData.base64Data = base64DataUrl.split(',')[1];
        } else if (file.name.endsWith(".pdf")) {
          const arrayBuffer = await readFileAsArrayBuffer(file);
          fileData.textContent = await extractTextFromPDF(arrayBuffer);
        } else if (file.name.endsWith(".docx")) {
          const arrayBuffer = await readFileAsArrayBuffer(file);
          fileData.textContent = await extractTextFromDocx(arrayBuffer);
        } else {
          fileData.textContent = await readFileAsText(file);
        }
        
        attachedFiles.push(fileData);
      } catch (err) {
        console.error("Lỗi đọc file:", err);
        alert(`Không thể đọc file ${file.name}: ${err.message || err}`);
      }
    }
    
    updateAttachedFilesUI();
    fileInput.value = "";
  });

  function updateAttachedFilesUI() {
    if (attachedFiles.length === 0) {
      attachedRow.style.display = "none";
      attachedRow.innerHTML = "";
    } else {
      attachedRow.style.display = "flex";
      attachedRow.innerHTML = attachedFiles.map((file, idx) => {
        const sizeStr = file.size > 1024 * 1024 
          ? (file.size / (1024 * 1024)).toFixed(1) + " MB" 
          : (file.size / 1024).toFixed(0) + " KB";
        const icon = file.isImage 
          ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle; margin-right:4px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
          : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle; margin-right:4px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
        return `
          <div class="attached-file-badge">
            ${icon}
            <span title="${file.name}">${file.name} (${sizeStr})</span>
            <button data-idx="${idx}" class="btn-remove-attachment" type="button">&times;</button>
          </div>
        `;
      }).join('');
      
      attachedRow.querySelectorAll(".btn-remove-attachment").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute("data-idx"), 10);
          attachedFiles.splice(idx, 1);
          updateAttachedFilesUI();
        });
      });
    }
  }

  // Submit AI Prompt Composer
  const btnSubmit = document.getElementById("btnComposerSubmit");
  const promptInput = document.getElementById("aiPromptInput");
  const generateType = document.getElementById("aiGenerateType");

  btnSubmit.addEventListener("click", () => {
    // 1. Check Subscription status first
    const subStatus = store.getSubscriptionStatus();
    const state = store.getState();
    
    // Block AI if plan is Free (expired trial/pro) and user has no personal API Key configured
    if (subStatus.plan === "Free" && !state.user.geminiApiKey) {
      alert("Thời gian dùng thử miễn phí 7 ngày của bạn đã hết hạn.\nVui lòng nâng cấp gói Pro hoặc tự cấu hình Gemini API Key cá nhân trong mục Cài đặt để tiếp tục sử dụng tính năng thông minh bằng AI!");
      if (window.openUpgradeModal) {
        window.openUpgradeModal();
      }
      return;
    }

    const promptText = promptInput.value.trim();
    if (!promptText && attachedFiles.length === 0) {
      alert("Vui lòng nhập nội dung yêu cầu soạn đề hoặc đính kèm tài liệu học tập!");
      return;
    }

    // Determine subject key based on text and file names
    let subjectKey = "default";
    const lowerText = (promptText + " " + attachedFiles.map(f => f.name).join(" ")).toLowerCase();
    
    if (lowerText.includes("toán") || lowerText.includes("math") || lowerText.includes("đạo hàm") || lowerText.includes("tích phân") || lowerText.includes("giải tích")) {
      subjectKey = "toan";
    } else if (lowerText.includes("anh") || lowerText.includes("english") || lowerText.includes("grammar") || lowerText.includes("generation gap")) {
      subjectKey = "tienganh";
    } else if (lowerText.includes("lý") || lowerText.includes("physics") || lowerText.includes("dao động") || lowerText.includes("sóng")) {
      subjectKey = "vatly";
    }

    // Extracted documents text context
    let documentContext = "";
    attachedFiles.forEach(file => {
      if (!file.isImage && file.textContent) {
        documentContext += `\n\n--- NỘI DUNG TÀI LIỆU ĐÍNH KÈM: ${file.name} ---\n${file.textContent}\n--- HẾT TÀI LIỆU ---`;
      }
    });

    // Merge document content into request text
    const fullRequestText = promptText + documentContext;

    if (state.user.geminiApiKey) {
      // Call ACTUAL Gemini API, pass request text and attached files
      startActualGeminiGeneration(state.user.geminiApiKey, fullRequestText, subjectKey, attachedFiles);
    } else {
      // Fallback with warning
      alert("Bạn chưa cấu hình Gemini API Key thật.\nỨng dụng sẽ tự động tải bộ câu hỏi mẫu minh họa để bạn trải nghiệm. Để tạo câu hỏi thật theo đúng ý, vui lòng vào tab 'Cài đặt' điền Gemini API Key (miễn phí) nhé!");
      startSimulatedAIGeneration(subjectKey, promptText || "Đề thi được biên soạn từ tài liệu đính kèm");
    }
  });
}

function startSimulatedAIGeneration(subjectKey, promptText) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "ai-processing-overlay";
  overlay.innerHTML = `
    <div class="ai-processing-card">
      <div class="ai-icon-animation">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#logo-grad-ai)" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <defs>
            <linearGradient id="logo-grad-ai" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stop-color="#00f0ff" />
              <stop offset="1" stop-color="#0072ff" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h3 class="ai-step-title">MyaQuiz AI Đang Khởi Chạy...</h3>
      <p class="ai-step-text" id="aiStepText">Đang kết nối hệ thống phân tích nội dung...</p>
      <div class="ai-progress-bar">
        <div class="ai-progress-fill" id="aiProgressFill"></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const stepText = document.getElementById("aiStepText");
  const progressFill = document.getElementById("aiProgressFill");

  const steps = [
    { progress: 15, text: "Đang đọc dữ liệu & phân tích ngữ cảnh bài viết..." },
    { progress: 35, text: "Đang trích xuất các chủ đề và kiến thức trọng tâm..." },
    { progress: 60, text: "Đang thiết lập ngân hàng câu hỏi trắc nghiệm và lời giải chi tiết..." },
    { progress: 85, text: "Đang trộn câu hỏi & định dạng cấu trúc đề thi chuẩn..." },
    { progress: 100, text: "Hoàn tất biên soạn đề thi! Đang chuyển hướng..." }
  ];

  let stepIdx = 0;
  function runStep() {
    if (stepIdx < steps.length) {
      const step = steps[stepIdx];
      progressFill.style.width = `${step.progress}%`;
      stepText.innerText = step.text;
      
      stepIdx++;
      setTimeout(runStep, 1000 + Math.random() * 800); // Random delay
    } else {
      // Finished! Create exam, clear inputs, remove overlay
      const template = MOCK_EXAM_TEMPLATES[subjectKey] || MOCK_EXAM_TEMPLATES.default;
      
      // Determine subject name
      const subjectName = subjectKey === "toan" ? "Toán" : subjectKey === "tienganh" ? "Tiếng Anh" : subjectKey === "vatly" ? "Vật lý" : "Tổng hợp";
      
      // Parse grade
      let gradeVal = null;
      const gradeMatch = promptText.match(/lớp\s*([1-9]|1[0-2])/i) || promptText.match(/grade\s*([1-9]|1[0-2])/i);
      if (gradeMatch) {
        gradeVal = parseInt(gradeMatch[1], 10);
      }
      
      // Determine type: "Đề thi" vs "Đề kiểm tra"
      let examType = "Đề kiểm tra";
      const lowerPrompt = promptText.toLowerCase();
      if (lowerPrompt.includes("thi học kì") || lowerPrompt.includes("thi học kỳ") || lowerPrompt.includes("thi thử") || (lowerPrompt.includes("đề thi") && !lowerPrompt.includes("đề kiểm tra"))) {
        examType = "Đề thi";
      }
      
      // Determine duration
      let duration = 15;
      const timeMatch = promptText.match(/(\d+)\s*(phút|minute|pt)/i);
      if (timeMatch) {
        duration = parseInt(timeMatch[1], 10);
      } else {
        if (lowerPrompt.includes("90 phút")) duration = 90;
        else if (lowerPrompt.includes("45 phút")) duration = 45;
      }
      
      // Parse quantity / questionsCount
      let questionCount = 10;
      const qCountMatch = promptText.match(/(\d+)\s*(câu hỏi|câu|question)/i);
      if (qCountMatch) {
        questionCount = parseInt(qCountMatch[1], 10);
      } else {
        if (duration === 90) questionCount = 50;
        else if (duration === 45) questionCount = 25;
      }
      
      // Determine difficulty
      let difficulty = "Trung bình";
      const diffMatch = promptText.match(/Độ khó:\s*([^\n\r.]+)/i);
      if (diffMatch) {
        difficulty = diffMatch[1].trim();
      } else {
        const cleanPrompt = lowerPrompt.replace(/độ khó/g, "");
        if (cleanPrompt.includes("khó") || cleanPrompt.includes("nâng cao") || cleanPrompt.includes("giỏi")) {
          difficulty = "Khó";
        } else if (cleanPrompt.includes("dễ") || cleanPrompt.includes("cơ bản")) {
          difficulty = "Dễ";
        }
      }

      // Format title: "Đề thi môn Toán Lớp 5 (15 phút)"
      let examTitle = `${examType} môn ${subjectName}`;
      if (gradeVal) {
        examTitle += ` Lớp ${gradeVal}`;
      }
      examTitle += ` (${duration} phút)`;

      // Clone/repeat template questions to match requested count
      let finalQuestions = [];
      const templateQuestions = template.questions || [];
      if (templateQuestions.length > 0) {
        for (let i = 0; i < questionCount; i++) {
          const originalQ = templateQuestions[i % templateQuestions.length];
          finalQuestions.push({
            text: `(Mô phỏng Câu ${i + 1}) ${originalQ.text}`,
            options: [...originalQ.options],
            answer: originalQ.answer,
            explanation: originalQ.explanation
          });
        }
      }

      const newExam = store.addExam({
        title: examTitle,
        subject: subjectName,
        grade: gradeVal,
        duration: duration,
        difficulty: difficulty,
        examType: examType,
        questions: finalQuestions.length > 0 ? finalQuestions : template.questions
      });

      attachedFiles = [];
      const promptInput = document.getElementById("aiPromptInput");
      if (promptInput) promptInput.value = "";
      
      document.body.removeChild(overlay);
      navigateToExamDetail(newExam.id);
    }
  }

  setTimeout(runStep, 400);
}

async function callGeminiAPI(apiKeyStr, promptText, config = {}) {
  const apiKeys = apiKeyStr.split(",").map(k => k.trim()).filter(Boolean);
  if (apiKeys.length === 0) {
    throw new Error("Không tìm thấy Google Gemini API Key nào trong cấu hình.");
  }

  const models = [
    { name: "gemini-2.0-flash", version: "v1beta" },
    { name: "gemini-2.0-flash", version: "v1" },
    { name: "gemini-flash-latest", version: "v1beta" },
    { name: "gemini-flash-latest", version: "v1" },
    { name: "gemini-1.5-flash", version: "v1beta" },
    { name: "gemini-1.5-flash", version: "v1" }
  ];

  let errors = [];
  let keyIndex = 0;

  for (const apiKey of apiKeys) {
    keyIndex++;
    let keyErrors = [];
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/${model.version}/models/${model.name}:generateContent?key=${apiKey}`;
        const payload = {
          contents: [{
            parts: Array.isArray(promptText) ? promptText : [{ text: promptText }]
          }]
        };
        if (Object.keys(config).length > 0) {
          const adjustedConfig = {};
          for (const [key, val] of Object.entries(config)) {
            if (model.version === "v1") {
              // v1 expects snake_case for REST payloads
              if (key === "responseMimeType") adjustedConfig["response_mime_type"] = val;
              else if (key === "responseSchema") adjustedConfig["response_schema"] = val;
              else adjustedConfig[key] = val;
            } else {
              // v1beta expects camelCase for REST payloads
              if (key === "response_mime_type") adjustedConfig["responseMimeType"] = val;
              else if (key === "response_schema") adjustedConfig["responseSchema"] = val;
              else adjustedConfig[key] = val;
            }
          }
          payload.generationConfig = adjustedConfig;
        }
        
        let res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        // If rate limited (429), pause 2 seconds and retry once
        if (res.status === 429) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });
        }

        if (res.ok) {
          const data = await res.json();
          return {
            ok: true,
            data: data,
            modelUsed: `${model.version}/${model.name}`,
            successKeyIndex: keyIndex,
            errorsBeforeSuccess: [...errors]
          };
        } else {
          const errJson = await res.json().catch(() => ({}));
          const msg = errJson.error?.message || `HTTP ${res.status}`;
          keyErrors.push(`${model.name} (${model.version}) thất bại: ${msg}`);
        }
      } catch (err) {
        keyErrors.push(`${model.name} (${model.version}) lỗi kết nối: ${err.message}`);
      }
    }
    errors.push(`[Key #${keyIndex} thất bại] Chi tiết: ${keyErrors.join(" | ")}`);
  }

  // Diagnostic ListModels check using the last key
  const lastKey = apiKeys[apiKeys.length - 1];
  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${lastKey}`;
    const listRes = await fetch(listUrl);
    if (listRes.ok) {
      const listData = await listRes.json();
      const availableModels = listData.models?.map(m => m.name.replace("models/", "")).join(", ") || "None";
      throw new Error(`Tất cả các API Key cấu hình đều thất bại. Các mô hình khả dụng cho API Key của bạn là: ${availableModels}. Chi tiết thử nghiệm: ${errors.join("; ")}`);
    } else {
      const errJson = await listRes.json().catch(() => ({}));
      const msg = errJson.error?.message || `HTTP ${listRes.status}`;
      throw new Error(`Tất cả các API Key đều hết hạn ngạch hoặc không hợp lệ: ${msg}. Chi tiết thử nghiệm: ${errors.join("; ")}`);
    }
  } catch (diagErr) {
    throw new Error(`Tất cả các API Key đều hết hạn ngạch hoặc lỗi kết nối: ${diagErr.message}. Chi tiết thử nghiệm: ${errors.join("; ")}`);
  }
}

async function testSingleAPIKey(apiKey) {
  const models = [
    { name: "gemini-2.0-flash", version: "v1beta" },
    { name: "gemini-2.0-flash", version: "v1" },
    { name: "gemini-flash-latest", version: "v1beta" },
    { name: "gemini-flash-latest", version: "v1" },
    { name: "gemini-1.5-flash", version: "v1beta" },
    { name: "gemini-1.5-flash", version: "v1" }
  ];

  let errors = [];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/${model.version}/models/${model.name}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ parts: [{ text: "Hello" }] }]
      };
      
      const adjustedConfig = {};
      if (model.version === "v1") {
        adjustedConfig["response_mime_type"] = "text/plain";
      } else {
        adjustedConfig["responseMimeType"] = "text/plain";
      }
      payload.generationConfig = adjustedConfig;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        return { ok: true, modelUsed: `${model.version}/${model.name}` };
      } else {
        const errJson = await res.json().catch(() => ({}));
        const msg = errJson.error?.message || `HTTP ${res.status}`;
        errors.push(`${model.name} (${model.version}): ${msg}`);
      }
    } catch (err) {
      errors.push(`${model.name} (${model.version}): ${err.message}`);
    }
  }
  return { ok: false, error: errors.join(" | ") };
}

function robustJSONParse(str) {
  let clean = str.trim();
  
  // Remove markdown code block markers
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
  }
  
  try {
    return JSON.parse(clean);
  } catch (e) {
    // Fallback 1: Extract array content between first [ and last ]
    const startIdx = clean.indexOf("[");
    const endIdx = clean.lastIndexOf("]");
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const arrayStr = clean.substring(startIdx, endIdx + 1);
      try {
        return JSON.parse(arrayStr);
      } catch (e2) {
        // Fallback 2: Clean trailing commas inside arrays and objects
        let fixedStr = arrayStr
          .replace(/,\s*\]/g, "]")
          .replace(/,\s*\}/g, "}");
        try {
          return JSON.parse(fixedStr);
        } catch (e3) {
          console.error("Robust JSON Parsing failed:", e3);
          throw new Error("Dữ liệu câu hỏi từ AI không đúng định dạng JSON chuẩn.");
        }
      }
    }
    throw e;
  }
}

export function startActualGeminiGeneration(apiKey, promptText, subjectKey, files = []) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "ai-processing-overlay";
  overlay.innerHTML = `
    <div class="ai-processing-card">
      <div class="ai-icon-animation">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#logo-grad-ai)" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <defs>
            <linearGradient id="logo-grad-ai" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stop-color="#00f0ff" />
              <stop offset="1" stop-color="#0072ff" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h3 class="ai-step-title">MyaQuiz AI Đang Soạn Đề...</h3>
      <p class="ai-step-text" id="aiStepText">Đang gửi yêu cầu đến Google Gemini API...</p>
      <div class="ai-progress-bar">
        <div class="ai-progress-fill" id="aiProgressFill" style="width: 15%"></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const stepText = document.getElementById("aiStepText");
  const progressFill = document.getElementById("aiProgressFill");

  // Construct Gemini System Instruct Prompt
  const isEnglish = subjectKey === "tienganh";
  const finalPromptText = `Bạn là một chuyên gia khảo thí giáo dục hàng đầu. Hãy soạn một bộ đề thi trắc nghiệm chi tiết dựa trên nội dung/yêu cầu sau từ người dùng: "${promptText}".
YÊU CẦU QUAN TRỌNG VỀ ĐỘ CHÍNH XÁC KIẾN THỨC:
1. Tuyệt đối không được tự bịa đặt (hallucinate) thông tin hay kiến thức giả. Tất cả câu hỏi, phương án lựa chọn và giải thích đáp án phải chính xác 100% về mặt khoa học, lịch sử, thực tế đời sống hoặc logic học thuật.
2. Nếu kiến thức không chắc chắn hoặc không có câu trả lời chuẩn xác được giới khoa học/giáo dục công nhận rộng rãi, tuyệt đối không đưa vào đề thi.
3. Bạn phải tạo ra CHÍNH XÁC số lượng câu hỏi được yêu cầu trong nội dung trên (Ví dụ: nếu người dùng yêu cầu 25 câu, hãy tạo đủ 25 câu). Nếu người dùng không chỉ định cụ thể số lượng câu hỏi, hãy tạo mặc định là 10 câu hỏi.

Yêu cầu bắt buộc trả về dưới dạng một MẢNG JSON thuần túy (Array of Objects), không kèm theo bất kỳ ký tự định dạng markdown như \`\`\`json hay text giải thích nào ở ngoài mảng.
Mỗi phần tử (Object) trong mảng phải có cấu trúc chính xác như sau:
{
  "text": "Nội dung câu hỏi trắc nghiệm...",
  "options": ["Phương án A", "Phương án B", "Phương án C", "Phương án D"],
  "answer": 0, // chỉ số của đáp án đúng (từ 0 đến 3)
  "explanation": "Giải thích chi tiết vì sao đáp án đó đúng bằng tiếng Việt"
}
${isEnglish ? 
  'Vì đây là đề thi môn Tiếng Anh (English), bạn BẮT BUỘC phải phân bổ khoảng 20% đến 30% số lượng câu hỏi trong bộ đề dưới dạng dịch thuật hoặc kiểm tra nghĩa từ vựng (ở các câu này: câu hỏi "text" viết chỉ dẫn bằng Tiếng Việt như "Dịch câu sau...", "Từ sau đây có nghĩa là gì...", và 4 phương án lựa chọn "options" viết bằng Tiếng Việt). 70% đến 80% số câu hỏi còn lại là các câu hỏi ngữ pháp, đọc hiểu hoặc phát âm với câu hỏi và phương án "options" viết 100% bằng Tiếng Anh. Phần giải thích đáp án đúng ("explanation") luôn viết bằng Tiếng Việt.' : 
  'Hãy viết toàn bộ câu hỏi và phương án, lời giải bằng Tiếng Việt.'
}`;

  // Build multimodal parts if images are attached
  let promptPayload = finalPromptText;
  const images = files.filter(f => f.isImage);
  
  if (images.length > 0) {
    promptPayload = [];
    promptPayload.push({ text: finalPromptText });
    images.forEach(img => {
      promptPayload.push({
        inlineData: {
          mimeType: img.type,
          data: img.base64Data
        }
      });
    });
  }

  // Start API request
  progressFill.style.width = "40%";
  stepText.innerText = "Gemini AI đang tư duy và tạo các câu hỏi trắc nghiệm...";

  callGeminiAPI(apiKey, promptPayload, { 
    response_mime_type: "application/json",
    temperature: 0.2 
  })
  .then(result => {
    progressFill.style.width = "75%";
    stepText.innerText = "Đang nhận dữ liệu và phân tích cấu trúc đề thi...";

    const textResponse = result.data.candidates[0].content.parts[0].text;
    const questions = robustJSONParse(textResponse);

    progressFill.style.width = "95%";
    stepText.innerText = "Đang lưu đề thi vào Thư viện của bạn...";

    // Determine subject name
    const subjectName = subjectKey === "toan" ? "Toán" : subjectKey === "tienganh" ? "Tiếng Anh" : subjectKey === "vatly" ? "Vật lý" : "Tổng hợp";
    
    // Parse grade
    let gradeVal = null;
    const gradeMatch = promptText.match(/lớp\s*([1-9]|1[0-2])/i) || promptText.match(/grade\s*([1-9]|1[0-2])/i);
    if (gradeMatch) {
      gradeVal = parseInt(gradeMatch[1], 10);
    }
    
    // Determine type: "Đề thi" vs "Đề kiểm tra"
    let examType = "Đề kiểm tra";
    const lowerPrompt = promptText.toLowerCase();
    if (lowerPrompt.includes("đề thi") || lowerPrompt.includes("thi học kì") || lowerPrompt.includes("thi thử") || questions.length >= 20) {
      examType = "Đề thi";
    }
    
    // Determine duration
    let duration = 15;
    if (questions.length >= 40) {
      duration = 90;
    } else if (questions.length >= 20) {
      duration = 45;
    }
    const timeMatch = promptText.match(/(\d+)\s*(phút|minute|pt)/i);
    if (timeMatch) {
      duration = parseInt(timeMatch[1], 10);
    }
    
    // Determine difficulty
    let difficulty = "Trung bình";
    const diffMatch = promptText.match(/Độ khó:\s*([^\n\r.]+)/i);
    if (diffMatch) {
      difficulty = diffMatch[1].trim();
    } else {
      const cleanPrompt = lowerPrompt.replace(/độ khó/g, "");
      if (cleanPrompt.includes("khó") || cleanPrompt.includes("nâng cao") || cleanPrompt.includes("giỏi")) {
        difficulty = "Khó";
      } else if (cleanPrompt.includes("dễ") || cleanPrompt.includes("cơ bản")) {
        difficulty = "Dễ";
      }
    }

    // Format title: "Đề thi môn Toán Lớp 5 (15 phút)"
    let examTitle = `${examType} môn ${subjectName}`;
    if (gradeVal) {
      examTitle += ` Lớp ${gradeVal}`;
    }
    examTitle += ` (${duration} phút)`;

    const newExam = store.addExam({
      title: examTitle,
      subject: subjectName,
      grade: gradeVal,
      duration: duration,
      difficulty: difficulty,
      examType: examType,
      questions: questions
    });

    // Clear inputs
    attachedFiles = [];
    const promptInput = document.getElementById("aiPromptInput");
    if (promptInput) promptInput.value = "";

    progressFill.style.width = "100%";
    stepText.innerText = "Hoàn thành!";
    
    setTimeout(() => {
      document.body.removeChild(overlay);
      navigateToExamDetail(newExam.id);
    }, 500);
  })
  .catch(err => {
    document.body.removeChild(overlay);
    console.error("Lỗi Gemini API:", err);
    alert(`Lỗi tạo đề thi bằng Gemini API!\nChi tiết: ${err.message}\n\nHướng dẫn khắc phục:\n1. Kiểm tra lại Gemini API Key trong mục 'Cài đặt' xem đã đúng chưa.\n2. Đảm bảo bạn đã kích hoạt 'Generative Language API' cho dự án chứa API Key.\n3. Nếu lỗi vẫn tiếp tục, hệ thống sẽ sử dụng đề mẫu để bạn trải nghiệm.`);
  });
}

function navigateToExamDetail(examId) {
  window.currentExamDetailId = examId;
  const sidebarItem = document.querySelector('.nav-item[data-view="exams"]');
  if (sidebarItem) {
    window.setActiveSidebar(sidebarItem);
  }
}

// --------------------------------------------------------------------------
// 2. RENDER LIBRARY VIEW
// --------------------------------------------------------------------------
export function renderLibrary(container) {
  const state = store.getState();
  
  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Thư viện của bạn</h1>
        <p class="view-subtitle" style="color: var(--text-muted);">Quản lý tất cả đề thi, bài giảng và tài nguyên tự động hóa trên MyaQuiz.</p>
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="search-filter-row">
      <div class="search-input-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" class="search-input" id="librarySearchInput" placeholder="Tìm kiếm tên đề thi..." />
      </div>
      <select class="filter-select" id="librarySubjectFilter">
        <option value="Tất cả">Tất cả môn học</option>
        <option value="Toán">Môn Toán</option>
        <option value="Tiếng Anh">Môn Tiếng Anh</option>
        <option value="Vật lý">Môn Vật lý</option>
        <option value="Tổng hợp">Tổng hợp</option>
      </select>
    </div>

    <div class="library-grid" id="libraryGrid">
      <!-- Loaded dynamically -->
    </div>
  `;

  renderLibraryGrid(state);

  // Filter Listeners
  const searchInput = document.getElementById("librarySearchInput");
  const subjectFilter = document.getElementById("librarySubjectFilter");

  const handleFilter = () => {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedSubject = subjectFilter.value;
    const filteredState = {
      ...state,
      exams: state.exams.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(searchText);
        const matchesSubject = selectedSubject === "Tất cả" || e.subject === selectedSubject;
        return matchesSearch && matchesSubject;
      })
    };
    renderLibraryGrid(filteredState);
  };

  searchInput.addEventListener("input", handleFilter);
  subjectFilter.addEventListener("change", handleFilter);
}

function renderLibraryGrid(state) {
  const grid = document.getElementById("libraryGrid");
  if (!grid) return;

  if (state.exams.length === 0) {
    grid.innerHTML = `
      <div class="empty-state-box" style="grid-column: 1 / -1; padding: 60px 20px;">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <h3 class="empty-state-title">Không tìm thấy tài liệu phù hợp</h3>
        <p class="empty-state-subtitle">Hãy thử thay đổi từ khóa hoặc chủ đề tìm kiếm.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = state.exams.map(e => {
    let subjectClass = "ai";
    const sub = e.subject.toLowerCase();
    if (sub.includes("toán")) subjectClass = "math";
    else if (sub.includes("anh")) subjectClass = "english";
    else if (sub.includes("lý") || sub.includes("vật lý")) subjectClass = "physics";
    else if (sub.includes("hóa")) subjectClass = "chemistry";

    return `
      <div class="exam-library-card" data-exam-id="${e.id}">
        <div class="exam-card-main">
          <div class="exam-card-meta-row">
            <span class="exam-card-subject-tag ${subjectClass}">${e.subject}</span>
            <span class="exam-card-date">${formatDate(e.created)}</span>
          </div>
          <h3 class="exam-card-title" title="${e.title}">${e.title}</h3>
        </div>
        <div>
          <div class="exam-card-stats">
            <div class="exam-card-stat-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>15 phút</span>
            </div>
            <div class="exam-card-stat-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <span>${e.questionsCount} câu hỏi</span>
            </div>
          </div>
          <div class="exam-card-footer">
            <span class="exam-card-author">
              <span class="exam-card-author-avatar">${e.author ? e.author.substring(0, 1) : "M"}</span>
              <span>${e.author || "MyaQuiz AI"}</span>
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Add click to detail listeners
  grid.querySelectorAll(".exam-library-card").forEach(card => {
    card.addEventListener("click", () => {
      const examId = card.getAttribute("data-exam-id");
      navigateToExamDetail(examId);
    });
  });
}

// --------------------------------------------------------------------------
// 3. AUTO GENERATE MODAL AND EXAMS VIEW
// --------------------------------------------------------------------------
export function openAutoGenerateModal(subject, grade) {
  // Remove existing modals if any
  const oldModal = document.getElementById("modalAutoGenerateExam");
  if (oldModal) oldModal.remove();

  const modal = document.createElement("div");
  modal.id = "modalAutoGenerateExam";
  modal.className = "modal show";
  
  modal.innerHTML = `
    <div class="modal-backdrop show ai-modal-backdrop">
      <div class="modal-backdrop-click-target" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 9998; cursor: pointer;"></div>
      <div class="modal-content ai-modal-content">
        <div class="modal-header" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding: 18px 24px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: hsl(var(--primary));"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <h2 style="font-family: var(--font-headings); font-size: 1.35rem; font-weight: 700; color: var(--text-main); margin: 0;">Tạo đề tự động bằng AI</h2>
          </div>
          <button class="btn-close-auto-generate" style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 1.5rem; line-height: 1; padding: 4px;">&times;</button>
        </div>

        <div class="modal-body" style="display: flex; flex-direction: column; gap: 18px; padding: 20px 24px;">
        <p style="font-size: 0.925rem; color: var(--text-muted);">
          Hệ thống AI sẽ tự động biên soạn nội dung, câu hỏi trắc nghiệm và lời giải chi tiết cho môn <strong>${subject} - Lớp ${grade}</strong>.
        </p>

        <!-- Options selection -->
        <div style="display: flex; flex-direction: column; gap: 10px;" id="autoGenOptionsGroup">
          
          <!-- Option 1: 15 mins -->
          <div class="auto-gen-option-card active" data-duration="15" data-questions="10" data-type="Đề kiểm tra" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border: 2px solid hsl(var(--primary)); background: hsl(var(--primary-light)); border-radius: var(--radius-md); cursor: pointer; transition: all var(--transition-fast);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: hsla(195, 100%, 46%, 0.15); display: flex; align-items: center; justify-content: center; color: hsl(var(--primary-dark));">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">Kiểm tra 15 phút</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">Bài kiểm tra nhanh củng cố kiến thức</span>
              </div>
            </div>
            <div style="text-align: right;">
              <span style="font-weight: 700; color: hsl(var(--primary-dark)); font-size: 0.95rem;">10 Câu hỏi</span>
            </div>
          </div>

          <!-- Option 2: 45 mins -->
          <div class="auto-gen-option-card" data-duration="45" data-questions="25" data-type="Đề kiểm tra" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border: 1px solid var(--border-color); background: var(--bg-card); border-radius: var(--radius-md); cursor: pointer; transition: all var(--transition-fast);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(245, 158, 11, 0.1); display: flex; align-items: center; justify-content: center; color: #d97706;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 10"/></svg>
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">Kiểm tra 45 phút</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">Đề thi định kỳ giữa kỳ hoặc cuối chương</span>
              </div>
            </div>
            <div style="text-align: right;">
              <span style="font-weight: 700; color: #d97706; font-size: 0.95rem;">25 Câu hỏi</span>
            </div>
          </div>

          <!-- Option 3: 90 mins -->
          <div class="auto-gen-option-card" data-duration="90" data-questions="50" data-type="Đề thi" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border: 1px solid var(--border-color); background: var(--bg-card); border-radius: var(--radius-md); cursor: pointer; transition: all var(--transition-fast);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(239, 68, 68, 0.1); display: flex; align-items: center; justify-content: center; color: #dc2626;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 8 14"/></svg>
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">Thi học kỳ (90 phút)</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">Đề thi học kỳ chính thức hoặc thi khảo sát</span>
              </div>
            </div>
            <div style="text-align: right;">
              <span style="font-weight: 700; color: #dc2626; font-size: 0.95rem;">50 Câu hỏi</span>
            </div>
          </div>

        </div>

        <!-- Extra configuration -->
        <div class="form-group" style="margin-top: 6px; margin-bottom: 0;">
          <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 6px;">Chọn độ khó của đề thi:</label>
          <select id="autoGenDifficulty" class="filter-select" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background-color: var(--bg-input); outline: none;">
            <option value="Dễ">Dễ (Kiến thức cơ bản, dễ hiểu)</option>
            <option value="Trung bình" selected>Trung bình (Độ phân hóa vừa phải, chuẩn SGK)</option>
            <option value="Khó">Khó (Nâng cao, kích thích tư duy, phân hóa học sinh giỏi)</option>
          </select>
        </div>
      </div>

      <div class="modal-footer" style="display: flex; align-items: center; justify-content: flex-end; gap: 12px; border-top: 1px solid var(--border-color); padding: 16px 24px; background: var(--bg-card);">
        <button class="btn btn-secondary btn-cancel-auto-generate" style="padding: 10px 18px;">Hủy</button>
        <button id="btnStartAutoGenerate" class="btn btn-primary" style="padding: 10px 22px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px;">
          Bắt đầu tạo đề
        </button>
      </div>
    </div>
  </div>
  `;

  document.body.appendChild(modal);

  // Set up selection logic
  const cards = modal.querySelectorAll(".auto-gen-option-card");
  let selectedOption = {
    duration: 15,
    questions: 10,
    type: "Đề kiểm tra"
  };

  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => {
        c.style.border = "1px solid var(--border-color)";
        c.style.background = "var(--bg-card)";
        c.classList.remove("active");
      });

      card.classList.add("active");
      const duration = parseInt(card.getAttribute("data-duration"), 10);
      const questions = parseInt(card.getAttribute("data-questions"), 10);
      const type = card.getAttribute("data-type");

      selectedOption = { duration, questions, type };

      // Highlight selected card
      let activeBorderColor = "hsl(var(--primary))";
      let activeBg = "hsl(var(--primary-light))";
      if (duration === 45) {
        activeBorderColor = "#f59e0b";
        activeBg = "rgba(245, 158, 11, 0.05)";
      } else if (duration === 90) {
        activeBorderColor = "#dc2626";
        activeBg = "rgba(239, 68, 68, 0.05)";
      }

      card.style.border = `2px solid ${activeBorderColor}`;
      card.style.background = activeBg;
    });
  });

  // Closing handler
  const closeModal = () => {
    modal.remove();
  };

  modal.querySelector(".btn-close-auto-generate").addEventListener("click", closeModal);
  modal.querySelector(".btn-cancel-auto-generate").addEventListener("click", closeModal);
  modal.querySelector(".modal-backdrop-click-target").addEventListener("click", closeModal);

  // Start generation handler
  modal.querySelector("#btnStartAutoGenerate").addEventListener("click", () => {
    const difficulty = modal.querySelector("#autoGenDifficulty").value;
    const { duration, questions, type } = selectedOption;

    closeModal();

    // Check plan & API key
    const state = store.getState();
    const subStatus = store.getSubscriptionStatus();
    
    if (subStatus.plan === "Free" && !state.user.geminiApiKey) {
      alert("Thời gian dùng thử miễn phí 7 ngày của bạn đã hết hạn.\\nVui lòng nâng cấp gói Pro hoặc tự cấu hình Gemini API Key cá nhân trong mục Cài đặt để tiếp tục sử dụng tính năng thông minh bằng AI!");
      if (window.openUpgradeModal) {
        window.openUpgradeModal();
      }
      return;
    }

    // Determine subject key
    const lowerSub = subject.toLowerCase();
    const subjectKey = (lowerSub.includes("toán") || lowerSub === "toan") ? "toan" : "tienganh";

    // Formulate clean structured prompt
    const promptText = `Tạo ${type} môn ${subject} Lớp ${grade} thời gian làm bài ${duration} phút với số lượng câu hỏi là ${questions} câu. Độ khó: ${difficulty}.`;

    if (state.user.geminiApiKey) {
      startActualGeminiGeneration(state.user.geminiApiKey, promptText, subjectKey, []);
    } else {
      alert("Bạn chưa cấu hình Gemini API Key thật.\\nỨng dụng sẽ tự động tải bộ câu hỏi mẫu minh họa và tự nhân bản cho đủ số câu hỏi của bạn. Để tạo câu hỏi thật theo đúng ý, vui lòng vào tab 'Cài đặt' điền Gemini API Key nhé!");
      startSimulatedAIGeneration(subjectKey, promptText);
    }
  });
}

export function renderExams(container) {
  const state = store.getState();

  // If a specific exam detail is active, render that instead
  if (window.currentExamDetailId) {
    const exam = state.exams.find(e => e.id === window.currentExamDetailId);
    if (exam) {
      if (quizState && quizState.examId === window.currentExamDetailId) {
        renderQuizMode(container, exam);
      } else {
        renderExamDetail(container, exam);
      }
      return;
    } else {
      window.currentExamDetailId = null; // Clear if not found
    }
  }

  // Initialize filters if empty
  if (!window.examListFilters) {
    window.examListFilters = {
      examType: "all",
      difficulty: "all",
      sortBy: "newest"
    };
  }

  // Otherwise, render list of exams
  let filteredExams = state.exams;
  let viewTitleText = "Danh sách đề thi";
  let viewSubtitleText = "Quản lý cấu trúc đề thi, lời giải chi tiết và chia sẻ bài thi trên MyaQuiz.";
  let headerActionsHtml = "";

  if (window.activeExamFilter) {
    const { subject, grade } = window.activeExamFilter;
    viewTitleText = `Đề thi: Môn ${subject} - Lớp ${grade}`;
    viewSubtitleText = `Hiển thị danh sách đề thi đã tạo thuộc môn ${subject} và khối lớp ${grade}.`;
    
    headerActionsHtml = `
      <div class="view-header-actions" style="margin-left: auto;">
        <button id="btnAutoGenerateHeader" class="btn btn-primary" style="padding: 10px 20px; font-size: 0.95rem; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; border-radius: var(--radius-md); box-shadow: 0 4px 12px hsla(195, 100%, 46%, 0.25);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spark-icon"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Tạo đề tự động bằng AI
        </button>
      </div>
    `;
    
    filteredExams = state.exams.filter(e => {
      let matchSubject = false;
      if (e.subject) {
        const examSub = e.subject.toLowerCase();
        const filterSub = subject.toLowerCase();
        if (filterSub.includes("toán") || filterSub === "toan") {
          matchSubject = examSub.includes("toán") || examSub === "toan";
        } else if (filterSub.includes("anh") || filterSub === "english") {
          matchSubject = examSub.includes("anh") || examSub.includes("english");
        } else {
          matchSubject = examSub === filterSub;
        }
      }
      
      let examGrade = e.grade;
      if (!examGrade) {
        const match = e.title.match(/lớp\\s*([1-9]|1[0-2])/i) || e.title.match(/grade\\s*([1-9]|1[0-2])/i);
        if (match) {
          examGrade = parseInt(match[1], 10);
        }
      }
      const matchGrade = examGrade === grade;
      
      return matchSubject && matchGrade;
    });
  }

  // Apply toolbar filters
  let processedExams = [...filteredExams];
  
  if (window.examListFilters.examType !== "all") {
    processedExams = processedExams.filter(e => {
      const type = e.examType || (e.title.toLowerCase().includes("đề thi") ? "Đề thi" : "Đề kiểm tra");
      return type === window.examListFilters.examType;
    });
  }
  
  if (window.examListFilters.difficulty !== "all") {
    processedExams = processedExams.filter(e => {
      const diff = e.difficulty || "Trung bình";
      return diff === window.examListFilters.difficulty;
    });
  }
  
  // Sort
  if (window.examListFilters.sortBy === "newest") {
    processedExams.sort((a, b) => new Date(b.created) - new Date(a.created));
  } else if (window.examListFilters.sortBy === "oldest") {
    processedExams.sort((a, b) => new Date(a.created) - new Date(b.created));
  } else if (window.examListFilters.sortBy === "questions_asc") {
    processedExams.sort((a, b) => a.questionsCount - b.questionsCount);
  } else if (window.examListFilters.sortBy === "questions_desc") {
    processedExams.sort((a, b) => b.questionsCount - a.questionsCount);
  }

  container.innerHTML = `
    <div class="view-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; width: 100%;">
      <div class="view-title-group" style="display: flex; flex-direction: column; gap: 4px; max-width: 600px;">
        <h1 class="view-title">${viewTitleText}</h1>
        <p class="view-subtitle" style="color: var(--text-muted);">${viewSubtitleText}</p>
      </div>
      ${headerActionsHtml}
    </div>

    <!-- Filters Toolbar -->
    <div class="card filters-toolbar" style="display: flex; flex-wrap: wrap; gap: 14px; padding: 12px 18px; margin-bottom: 20px; align-items: center; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); width: 100%;">
      <div class="filter-group" style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); white-space: nowrap;">Loại đề:</span>
        <select class="form-group select btn-sm" id="filterExamType" style="padding: 4px 8px; font-size: 0.85rem; border-radius: var(--radius-sm); margin: 0; width: auto; height: auto;">
          <option value="all" \${window.examListFilters.examType === 'all' ? 'selected' : ''}>Tất cả</option>
          <option value="Đề thi" \${window.examListFilters.examType === 'Đề thi' ? 'selected' : ''}>Đề thi</option>
          <option value="Đề kiểm tra" \${window.examListFilters.examType === 'Đề kiểm tra' ? 'selected' : ''}>Đề kiểm tra</option>
        </select>
      </div>

      <div class="filter-group" style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); white-space: nowrap;">Độ khó:</span>
        <select class="form-group select btn-sm" id="filterDifficulty" style="padding: 4px 8px; font-size: 0.85rem; border-radius: var(--radius-sm); margin: 0; width: auto; height: auto;">
          <option value="all" \${window.examListFilters.difficulty === 'all' ? 'selected' : ''}>Tất cả</option>
          <option value="Dễ" \${window.examListFilters.difficulty === 'Dễ' ? 'selected' : ''}>Dễ</option>
          <option value="Trung bình" \${window.examListFilters.difficulty === 'Trung bình' ? 'selected' : ''}>Trung bình</option>
          <option value="Khó" \${window.examListFilters.difficulty === 'Khó' ? 'selected' : ''}>Khó</option>
        </select>
      </div>

      <div class="filter-group" style="display: flex; align-items: center; gap: 8px; margin-left: auto;">
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); white-space: nowrap;">Sắp xếp:</span>
        <select class="form-group select btn-sm" id="filterSortBy" style="padding: 4px 8px; font-size: 0.85rem; border-radius: var(--radius-sm); margin: 0; width: auto; height: auto;">
          <option value="newest" \${window.examListFilters.sortBy === 'newest' ? 'selected' : ''}>Mới nhất</option>
          <option value="oldest" \${window.examListFilters.sortBy === 'oldest' ? 'selected' : ''}>Cũ nhất</option>
          <option value="questions_asc" \${window.examListFilters.sortBy === 'questions_asc' ? 'selected' : ''}>Số câu (Tăng dần)</option>
          <option value="questions_desc" \${window.examListFilters.sortBy === 'questions_desc' ? 'selected' : ''}>Số câu (Giảm dần)</option>
        </select>
      </div>
    </div>

    <div class="library-grid" id="examsListGrid" style="width: 100%;">
      <!-- Loaded dynamically -->
    </div>
  `;

  const grid = document.getElementById("examsListGrid");
  
  if (processedExams.length === 0) {
    grid.innerHTML = `
      <div class="empty-state-box" style="grid-column: 1 / -1; padding: 60px 20px;">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <h3 class="empty-state-title">Chưa có đề thi nào</h3>
        <p class="empty-state-subtitle">Không tìm thấy đề thi nào phù hợp với bộ lọc được chọn.</p>
      </div>
    `;
    
    // Bind header auto-generate button even if empty
    const btnAutoGenHeader = document.getElementById("btnAutoGenerateHeader");
    if (btnAutoGenHeader && window.activeExamFilter) {
      btnAutoGenHeader.addEventListener("click", () => {
        const { subject, grade } = window.activeExamFilter;
        openAutoGenerateModal(subject, grade);
      });
    }
    return;
  }

  grid.innerHTML = processedExams.map(e => {
    const diff = e.difficulty || "Trung bình";
    const diffClass = diff === "Khó" ? "hard" : diff === "Dễ" ? "easy" : "medium";
    const diffColor = diff === "Khó" ? "#ef4444" : diff === "Dễ" ? "#10b981" : "#f59e0b";
    const diffBg = diff === "Khó" ? "#fee2e2" : diff === "Dễ" ? "#d1fae5" : "#fef3c7";
    
    return `
      <div class="exam-library-card" data-exam-id="${e.id}">
        <div class="exam-card-main">
          <div class="exam-card-meta-row" style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span class="exam-card-subject-tag">${e.subject}</span>
            <span class="exam-card-difficulty-tag ${diffClass}" style="font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; background: ${diffBg}; color: ${diffColor};">${diff}</span>
            <span class="exam-card-date" style="margin-left: auto;">${formatDate(e.created)}</span>
          </div>
          <h3 class="exam-card-title" title="${e.title}" style="margin-top: 10px;">${e.title}</h3>
        </div>
        <div>
          <div class="exam-card-stats">
            <div class="exam-card-stat-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>${e.duration || 15} phút</span>
            </div>
            <div class="exam-card-stat-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>${e.questionsCount} câu hỏi</span>
            </div>
          </div>
          <div class="exam-card-footer">
            <span class="exam-card-author">
              <span class="exam-card-author-avatar">${e.author ? e.author.substring(0, 1) : "M"}</span>
              <span>${e.author || "MyaQuiz AI"}</span>
            </span>
            <button class="btn btn-secondary btn-sm btn-delete-exam" data-exam-id="${e.id}" style="padding: 4px 8px; font-size: 0.75rem;">Xóa</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Click handler to select exam
  grid.querySelectorAll(".exam-library-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-delete-exam")) return;
      const examId = card.getAttribute("data-exam-id");
      window.currentExamDetailId = examId;
      window.refreshActiveView();
    });
  });

  // Delete listener
  grid.querySelectorAll(".btn-delete-exam").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-exam-id");
      if (confirm("Bạn có chắc muốn xóa đề thi này khỏi hệ thống?")) {
        store.removeExam(id);
        renderExams(container);
      }
    });
  });

  // Toolbar event listeners
  document.getElementById("filterExamType").addEventListener("change", (e) => {
    window.examListFilters.examType = e.target.value;
    renderExams(container);
  });
  document.getElementById("filterDifficulty").addEventListener("change", (e) => {
    window.examListFilters.difficulty = e.target.value;
    renderExams(container);
  });
  document.getElementById("filterSortBy").addEventListener("change", (e) => {
    window.examListFilters.sortBy = e.target.value;
    renderExams(container);
  });

  // Bind Header Auto-generate button if present
  const btnAutoGenHeader = document.getElementById("btnAutoGenerateHeader");
  if (btnAutoGenHeader && window.activeExamFilter) {
    btnAutoGenHeader.addEventListener("click", () => {
      const { subject, grade } = window.activeExamFilter;
      openAutoGenerateModal(subject, grade);
    });
  }
}

function renderExamDetail(container, exam) {
  const state = store.getState();
  
  container.innerHTML = `
    <!-- Top back navigation -->
    <div style="display: flex; align-items: center; gap: 8px;">
      <button class="btn btn-secondary btn-sm" id="btnBackToExams" style="display: inline-flex; align-items: center; gap: 6px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Quay lại
      </button>
      <span style="color: var(--text-muted); font-size: 0.9rem;">Danh sách đề thi / Chi tiết</span>
    </div>

    <!-- Exam Info Panel -->
    <div class="view-header" style="flex-direction: column; align-items: flex-start; gap: 12px;">
      <div class="view-title-group">
        <h1 class="view-title" style="font-size: 1.5rem; line-height: 1.3;">${exam.title}</h1>
        <p class="view-subtitle" style="color: var(--text-muted); margin-top: 4px;">Môn học: <strong>${exam.subject}</strong> • Tạo ngày: ${formatDate(exam.created)}</p>
      </div>
      
      <!-- Actions panel with downloads -->
      <div class="exam-actions-row" style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center; width: 100%; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 12px 0; margin-top: 4px;">
        <button class="btn btn-primary" id="btnStartExamQuiz">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span>Làm bài thi</span>
        </button>

        <button class="btn btn-secondary" id="btnPrintExam" title="In đề thi cho học sinh">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          <span>In đề thi</span>
        </button>

        ${state.user.role === 'student' ? '' : `
        <button class="btn btn-secondary" id="btnPrintAnswers" title="In đề thi kèm đáp án và lời giải">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #059669;"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/><circle cx="12" cy="18" r="1"/></svg>
          <span style="color: #059669;">In Đáp án</span>
        </button>
        `}

        <button class="btn btn-secondary" id="btnExportWord" title="Tải đề thi file Word (.doc)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <span>Tải file Word</span>
        </button>

        ${state.user.role === 'student' ? '' : `
        <button class="btn btn-secondary" id="btnExportWordAnswers" title="Tải đáp án & lời giải file Word (.doc)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #0284c7;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="12" cy="18" r="1"/></svg>
          <span style="color: #0284c7;">Tải Đáp án (.doc)</span>
        </button>
        `}
      </div>
    </div>

    <!-- Detail Layout -->
    <div class="exam-detail-layout">
      <!-- Left side: Questions preview -->
      <div class="exam-questions-panel">
        <h2 style="font-family: var(--font-headings); font-size: 1.15rem;">Bản xem trước câu hỏi (${exam.questions.length} câu)</h2>
        
        ${exam.questions.map((q, idx) => `
          <div class="question-item-card card">
            <span style="font-size: 0.8rem; font-weight: 700; color: hsl(var(--primary-dark)); text-transform: uppercase;">Câu hỏi ${idx + 1}</span>
            <p class="question-text">${q.text}</p>
            
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
              ${q.options.map((opt, oIdx) => {
                const letter = String.fromCharCode(65 + oIdx);
                return `
                  <li style="display: flex; gap: 8px; font-size: 0.95rem;">
                    <strong>${letter}.</strong>
                    <span>${opt}</span>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <!-- Right side: Management / settings -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div class="card exam-meta-box">
          <h3 style="font-family: var(--font-headings); font-size: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Quản lý đề thi</h3>
          
          <div class="meta-box-item">
            <span class="meta-box-label">Người tạo</span>
            <span class="meta-box-value">${exam.author || "MyaQuiz AI"}</span>
          </div>
          <div class="meta-box-item">
            <span class="meta-box-label">Số câu hỏi</span>
            <span class="meta-box-value">${exam.questions.length} câu</span>
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label for="examWorkspaceAssign">Không gian làm việc</label>
            <select class="form-group select" id="examWorkspaceAssign" style="width: 100%; margin-top: 6px;">
              <option value="">-- Chưa phân loại --</option>
              ${state.workspaces.map(w => `
                <option value="${w.id}" ${exam.workspaceId === w.id ? 'selected' : ''}>${w.name}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="card" style="border-color: #fca5a5; background-color: hsla(0, 100%, 98%, 0.5);">
          <h3 style="color: #b91c1c; font-family: var(--font-headings); font-size: 1rem; margin-bottom: 8px;">Khu vực nguy hiểm</h3>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">Hành động này không thể hoàn tác. Đề thi sẽ bị xóa hoàn toàn khỏi cơ sở dữ liệu.</p>
          <button class="btn btn-secondary" id="btnDeleteExamDetail" style="border-color: #f87171; color: #ef4444; width: 100%;">
            Xóa đề thi
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach handlers
  document.getElementById("btnBackToExams").addEventListener("click", () => {
    window.currentExamDetailId = null;
    window.refreshActiveView();
  });

  // Delete Exam
  document.getElementById("btnDeleteExamDetail").addEventListener("click", () => {
    if (confirm("Xóa vĩnh viễn đề thi này?")) {
      store.removeExam(exam.id);
      window.currentExamDetailId = null;
      window.refreshActiveView();
    }
  });

  // Workspace Assignment change
  const wsSelect = document.getElementById("examWorkspaceAssign");
  wsSelect.addEventListener("change", () => {
    const wsId = wsSelect.value;
    const appState = store.getState();
    const storeExam = appState.exams.find(e => e.id === exam.id);
    if (storeExam) {
      storeExam.workspaceId = wsId;
      store.saveState(appState);
      alert(`Đã chuyển đề thi vào workspace tương ứng!`);
    }
  });

  // Print Exam triggers (Practice vs Answers)
  document.getElementById("btnPrintExam").addEventListener("click", () => {
    printExamPaper(exam, false);
  });

  const btnPrintAnswers = document.getElementById("btnPrintAnswers");
  if (btnPrintAnswers) {
    btnPrintAnswers.addEventListener("click", () => {
      printExamPaper(exam, true);
    });
  }

  // Export Word doc triggers (Practice vs Answers)
  document.getElementById("btnExportWord").addEventListener("click", () => {
    exportToWord(exam, false);
  });

  const btnExportWordAnswers = document.getElementById("btnExportWordAnswers");
  if (btnExportWordAnswers) {
    btnExportWordAnswers.addEventListener("click", () => {
      exportToWord(exam, true);
    });
  }

  // Take Exam Quiz Trigger
  document.getElementById("btnStartExamQuiz").addEventListener("click", () => {
    quizState = {
      examId: exam.id,
      answers: {},
      submitted: false
    };
    window.refreshActiveView();
  });
}

function printExamPaper(exam, showAnswers) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Không thể mở cửa sổ in. Vui lòng tắt trình chặn popup trên trình duyệt của bạn!");
    return;
  }
  
  let questionsHTML = "";
  exam.questions.forEach((q, idx) => {
    let optionsHTML = "";
    const maxOptionLen = Math.max(...q.options.map(opt => opt.length));
    
    if (maxOptionLen < 15) {
      optionsHTML = `<table class="options-grid-4"><tr>`;
      q.options.forEach((opt, oIdx) => {
        const letter = String.fromCharCode(65 + oIdx);
        const isCorrect = oIdx === q.answer && showAnswers;
        const className = isCorrect ? 'correct-ans' : '';
        optionsHTML += `<td class="${className}"><strong>${letter}.</strong> ${opt}</td>`;
      });
      optionsHTML += `</tr></table>`;
    } else if (maxOptionLen < 30) {
      optionsHTML = `<table class="options-table"><tr>`;
      q.options.forEach((opt, oIdx) => {
        const letter = String.fromCharCode(65 + oIdx);
        const isCorrect = oIdx === q.answer && showAnswers;
        const className = isCorrect ? 'correct-ans' : '';
        optionsHTML += `<td class="${className}"><strong>${letter}.</strong> ${opt}</td>`;
        if (oIdx === 1) {
          optionsHTML += `</tr><tr>`;
        }
      });
      optionsHTML += `</tr></table>`;
    } else {
      optionsHTML = `<ul class="options-list">`;
      q.options.forEach((opt, oIdx) => {
        const letter = String.fromCharCode(65 + oIdx);
        const isCorrect = oIdx === q.answer && showAnswers;
        const className = isCorrect ? 'correct-ans' : '';
        optionsHTML += `<li class="${className}"><strong>${letter}.</strong> ${opt}</li>`;
      });
      optionsHTML += `</ul>`;
    }
    
    let explanationHTML = "";
    if (showAnswers && q.explanation) {
      explanationHTML = `<div class="explanation"><strong>Lời giải chi tiết:</strong> ${q.explanation}</div>`;
    }
    
    questionsHTML += `
      <div class="question" style="margin-top: 18px; font-weight: bold; page-break-inside: avoid;">Câu ${idx + 1}: ${q.text}</div>
      ${optionsHTML}
      ${explanationHTML}
    `;
  });
  
  const docHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>${exam.title}</title>
  <style>
    body { font-family: 'Times New Roman', Times, serif; padding: 40px; line-height: 1.5; font-size: 12pt; color: #000; }
    .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .header-table td { vertical-align: top; font-size: 11pt; }
    .title { text-align: center; font-size: 16pt; font-weight: bold; margin: 20px 0 10px 0; text-transform: uppercase; }
    .sub-title { text-align: center; font-style: italic; margin-bottom: 25px; }
    .student-info { margin-bottom: 20px; font-size: 11.5pt; line-height: 1.8; }
    .options-table { width: 100%; margin-top: 6px; border-collapse: collapse; }
    .options-table td { padding: 4px 0; width: 50%; font-size: 11.5pt; }
    .options-grid-4 { width: 100%; margin-top: 6px; border-collapse: collapse; }
    .options-grid-4 td { padding: 4px 0; width: 25%; font-size: 11.5pt; }
    .options-list { margin-left: 20px; list-style-type: none; padding-left: 0; margin-top: 6px; }
    .options-list li { margin-bottom: 6px; font-size: 11.5pt; }
    .explanation { margin-top: 8px; font-style: italic; color: #1f2937; background-color: #f3f4f6; padding: 10px; border-left: 3px solid #4b5563; font-size: 11pt; page-break-inside: avoid; }
    .correct-ans { font-weight: bold; text-decoration: underline; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <table class="header-table">
    <tr>
      <td style="width: 45%;">
        <strong>TRƯỜNG/HỆ THỐNG:</strong> MyaQuiz.ai<br>
        <strong>MÃ ĐỀ THI:</strong> DE-${exam.id.substring(0, 6).toUpperCase()}
      </td>
      <td style="width: 55%; text-align: right;">
        <strong>ĐỀ THI KHẢO SÁT CHẤT LƯỢNG HỌC PHẦN</strong><br>
        <strong>Môn học:</strong> ${exam.subject}<br>
        <em>Thời gian làm bài: 45 phút (Không kể thời gian phát đề)</em>
      </td>
    </tr>
  </table>
  
  <div class="title">ĐỀ THI: ${exam.title}</div>
  <div class="sub-title">${showAnswers ? "--- ĐÁP ÁN & HƯỚNG DẪN GIẢI CHI TIẾT ---" : "--- ĐỀ THI CHÍNH THỨC ---"}</div>
  
  <div class="student-info">
    Họ và tên học sinh:........................................................................... Lớp:............................<br>
    Số báo danh (SBD):.......................................................................... Phòng thi:......................
  </div>
  
  <hr style="border: 0; border-top: 1px solid #000; margin: 15px 0;">
  
  <div class="questions-container">
    ${questionsHTML}
  </div>
  
  <script>
    window.onload = function() {
      window.print();
      setTimeout(function() { window.close(); }, 500);
    }
  </script>
</body>
</html>
  `;
  
  printWindow.document.write(docHTML);
  printWindow.document.close();
}

function exportToWord(exam, showAnswers) {
  let questionsHTML = "";
  exam.questions.forEach((q, idx) => {
    let optionsHTML = "";
    const maxOptionLen = Math.max(...q.options.map(opt => opt.length));
    
    if (maxOptionLen < 15) {
      optionsHTML = `<table style="width:100%; border-collapse:collapse; border:none; margin-top:6px;"><tr>`;
      q.options.forEach((opt, oIdx) => {
        const letter = String.fromCharCode(65 + oIdx);
        const isCorrect = oIdx === q.answer && showAnswers;
        const style = isCorrect ? 'font-weight:bold; text-decoration:underline;' : '';
        optionsHTML += `<td style="width:25%; border:none; padding:4px 0; font-family:'Times New Roman'; font-size:11.5pt; ${style}"><strong>${letter}.</strong> ${opt}</td>`;
      });
      optionsHTML += `</tr></table>`;
    } else if (maxOptionLen < 30) {
      optionsHTML = `<table style="width:100%; border-collapse:collapse; border:none; margin-top:6px;"><tr>`;
      q.options.forEach((opt, oIdx) => {
        const letter = String.fromCharCode(65 + oIdx);
        const isCorrect = oIdx === q.answer && showAnswers;
        const style = isCorrect ? 'font-weight:bold; text-decoration:underline;' : '';
        optionsHTML += `<td style="width:50%; border:none; padding:4px 0; font-family:'Times New Roman'; font-size:11.5pt; ${style}"><strong>${letter}.</strong> ${opt}</td>`;
        if (oIdx === 1) {
          optionsHTML += `</tr><tr>`;
        }
      });
      optionsHTML += `</tr></table>`;
    } else {
      optionsHTML = `<ul style="list-style-type:none; margin-left:20px; padding-left:0; margin-top:6px;">`;
      q.options.forEach((opt, oIdx) => {
        const letter = String.fromCharCode(65 + oIdx);
        const isCorrect = oIdx === q.answer && showAnswers;
        const style = isCorrect ? 'font-weight:bold; text-decoration:underline;' : '';
        optionsHTML += `<li style="margin-bottom:6px; font-family:'Times New Roman'; font-size:11.5pt; ${style}"><strong>${letter}.</strong> ${opt}</li>`;
      });
      optionsHTML += `</ul>`;
    }
    
    let explanationHTML = "";
    if (showAnswers && q.explanation) {
      explanationHTML = `
        <div style="margin-top:8px; margin-bottom:12px; background-color:#f3f4f6; border-left:3px solid #4b5563; padding:10px; font-family:'Times New Roman'; font-size:11pt; color:#1f2937; font-style:italic;">
          <strong>Lời giải chi tiết:</strong> ${q.explanation}
        </div>
      `;
    }
    
    questionsHTML += `
      <p style="margin-top:14px; margin-bottom:4px; font-family:'Times New Roman'; font-size:12pt; font-weight:bold;">Câu ${idx + 1}: ${q.text}</p>
      ${optionsHTML}
      ${explanationHTML}
    `;
  });
  
  const docHTML = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${exam.title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body { font-family: 'Times New Roman', Times, serif; }
  </style>
</head>
<body style="font-family:'Times New Roman', Times, serif; padding:20px;">
  <table style="width:100%; border-collapse:collapse; border:none; margin-bottom:20px;">
    <tr>
      <td style="width:45%; border:none; font-family:'Times New Roman'; font-size:11pt; line-height:1.4;">
        <strong>TRƯỜNG/HỆ THỐNG:</strong> MyaQuiz.ai<br>
        <strong>MÃ ĐỀ THI:</strong> DE-${exam.id.substring(0,6).toUpperCase()}
      </td>
      <td style="width:55%; border:none; text-align:right; font-family:'Times New Roman'; font-size:11pt; line-height:1.4;">
        <strong>ĐỀ THI KHẢO SÁT CHẤT LƯỢNG HỌC PHẦN</strong><br>
        <strong>Môn học:</strong> ${exam.subject}<br>
        <em>Thời gian làm bài: 45 phút (Không kể thời gian phát đề)</em>
      </td>
    </tr>
  </table>
  
  <p style="text-align:center; font-family:'Times New Roman'; font-size:16pt; font-weight:bold; margin-top:20px; margin-bottom:10px; text-transform:uppercase;">ĐỀ THI: ${exam.title}</p>
  <p style="text-align:center; font-family:'Times New Roman'; font-size:12pt; font-style:italic; margin-bottom:25px;">${showAnswers ? "--- ĐÁP ÁN & HƯỚNG DẪN GIẢI CHI TIẾT ---" : "--- ĐỀ THI CHÍNH THỨC ---"}</p>
  
  <p style="font-family:'Times New Roman'; font-size:11.5pt; line-height:1.8; margin-bottom:20px;">
    Họ và tên học sinh:........................................................................... Lớp:............................<br>
    Số báo danh (SBD):.......................................................................... Phòng thi:......................
  </p>
  
  <hr style="border:none; border-top:1px solid #000; margin:15px 0;">
  
  <div>
    ${questionsHTML}
  </div>
</body>
</html>
  `;

  // Use UTF-8 BOM to ensure Vietnamese characters are read correctly in MS Word
  const blob = new Blob(['\ufeff' + docHTML], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);
  downloadLink.href = url;
  
  function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return str;
  }
  
  const cleanTitle = removeVietnameseTones(exam.title)
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
    
  downloadLink.download = showAnswers 
    ? `${cleanTitle}_DAP_AN.doc`
    : `${cleanTitle}_DE_THI.doc`;
    
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

function renderQuizMode(container, exam) {
  container.innerHTML = `
    <!-- Top Back Navigation -->
    <div style="display: flex; align-items: center; gap: 8px;">
      <button class="btn btn-secondary btn-sm" id="btnQuitQuiz" style="display: inline-flex; align-items: center; gap: 6px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Hủy bài thi
      </button>
      <span style="color: var(--text-muted); font-size: 0.9rem;">Thi thử trắc nghiệm</span>
    </div>

    <!-- Header info -->
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title" style="font-size: 1.5rem;">[Thi Thử] ${exam.title}</h1>
        <p class="view-subtitle" style="color: var(--text-muted);">Hãy điền đầy đủ đáp án cho các câu hỏi bên dưới và nhấn nộp bài.</p>
      </div>
      <div id="quizTimerWidget" style="font-family: var(--font-headings); font-weight: 700; font-size: 1.25rem; color: hsl(var(--primary-dark)); padding: 8px 16px; border: 1.5px solid hsl(var(--primary-medium)); border-radius: var(--radius-md); background-color: hsl(var(--primary-light));">
        Thời gian: 15:00
      </div>
    </div>

    <div class="exam-detail-layout">
      <!-- Left side: Interactive Questions -->
      <div class="exam-questions-panel" id="quizQuestionsContainer">
        ${exam.questions.map((q, idx) => `
          <div class="question-item-card card" id="quizQuestionCard_${idx}">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Câu hỏi ${idx + 1}</span>
            <p class="question-text">${q.text}</p>
            
            <div class="quiz-options-list">
              ${q.options.map((opt, oIdx) => {
                const letter = String.fromCharCode(65 + oIdx);
                const isSelected = quizState.answers[idx] === oIdx;
                return `
                  <div class="quiz-option-item ${isSelected ? 'selected' : ''}" data-question-idx="${idx}" data-option-idx="${oIdx}">
                    <span class="option-letter">${letter}</span>
                    <span class="option-content">${opt}</span>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Explanations revealed later -->
            <div class="question-explanation" id="quizExplanation_${idx}" style="display: none; margin-top: 10px;">
              <div class="explanation-title">Đáp án chuẩn & Lời giải:</div>
              <p>${q.explanation || "Không có lời giải."}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Right side: Control score / submission -->
      <div style="position: sticky; top: 20px;">
        <div class="card" id="quizSubmitPanel">
          <h3 style="font-family: var(--font-headings); font-size: 1.1rem; margin-bottom: 12px;">Trạng thái bài làm</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;" id="quizStatusText">Đang làm bài: Đã điền 0/${exam.questions.length} câu hỏi.</p>
          
          <button class="btn btn-primary" id="btnSubmitQuiz" style="width: 100%;">
            Nộp bài thi
          </button>
        </div>
      </div>
    </div>
  `;

  // Start timer simulation
  let seconds = 900;
  const timerWidget = document.getElementById("quizTimerWidget");
  const interval = setInterval(() => {
    if (quizState.submitted || !timerWidget) {
      clearInterval(interval);
      return;
    }
    seconds--;
    if (seconds <= 0) {
      clearInterval(interval);
      timerWidget.innerText = "Hết giờ!";
      submitQuiz(exam);
    } else {
      const min = Math.floor(seconds / 60).toString().padStart(2, '0');
      const sec = (seconds % 60).toString().padStart(2, '0');
      timerWidget.innerText = `Thời gian: ${min}:${sec}`;
    }
  }, 1000);

  // Attach Radio options selection listeners
  container.querySelectorAll(".quiz-option-item").forEach(item => {
    item.addEventListener("click", () => {
      if (quizState.submitted) return;
      
      const qIdx = parseInt(item.getAttribute("data-question-idx"), 10);
      const oIdx = parseInt(item.getAttribute("data-option-idx"), 10);
      
      const siblings = item.parentNode.querySelectorAll(".quiz-option-item");
      siblings.forEach(sib => sib.classList.remove("selected"));
      item.classList.add("selected");

      quizState.answers[qIdx] = oIdx;

      const completedCount = Object.keys(quizState.answers).length;
      document.getElementById("quizStatusText").innerText = `Đang làm bài: Đã điền ${completedCount}/${exam.questions.length} câu hỏi.`;
    });
  });

  // Quit / Back handler
  document.getElementById("btnQuitQuiz").addEventListener("click", () => {
    if (confirm("Bạn có chắc chắn muốn hủy bỏ bài thi thử hiện tại? Mọi bài làm sẽ bị mất.")) {
      clearInterval(interval);
      quizState = null;
      window.refreshActiveView();
    }
  });

  // Submit trigger
  document.getElementById("btnSubmitQuiz").addEventListener("click", () => {
    const completedCount = Object.keys(quizState.answers).length;
    if (completedCount < exam.questions.length) {
      if (!confirm(`Bạn chưa hoàn thành tất cả câu hỏi (${completedCount}/${exam.questions.length}). Bạn vẫn muốn nộp bài?`)) {
        return;
      }
    }
    clearInterval(interval);
    submitQuiz(exam);
  });
}

function submitQuiz(exam) {
  quizState.submitted = true;
  const state = store.getState();
  const isStudent = state.user.role === "student";
  
  let correctCount = 0;
  exam.questions.forEach((q, idx) => {
    const userAnswer = quizState.answers[idx];
    const correctIdx = q.answer;
    
    const card = document.getElementById(`quizQuestionCard_${idx}`);
    const explanation = document.getElementById(`quizExplanation_${idx}`);
    
    if (explanation) {
      if (isStudent && userAnswer === correctIdx) {
        explanation.style.display = "none";
      } else {
        explanation.style.display = "block";
      }
    }
    
    const options = card.querySelectorAll(".quiz-option-item");
    options.forEach((opt, oIdx) => {
      opt.classList.remove("selected");
      if (oIdx === correctIdx) {
        opt.classList.add("correct");
      } else if (userAnswer === oIdx && userAnswer !== correctIdx) {
        opt.classList.add("incorrect");
      }
    });

    if (userAnswer === correctIdx) {
      correctCount++;
    }
  });

  const score = ((correctCount / exam.questions.length) * 10).toFixed(1);
  const panel = document.getElementById("quizSubmitPanel");
  panel.innerHTML = `
    <div class="quiz-result-banner">
      <span style="font-size: 0.9rem; text-transform: uppercase; font-weight: 700; opacity: 0.9;">Kết quả đạt được</span>
      <span class="result-score">${score}</span>
      <span style="font-size: 0.85rem; font-weight: 500;">Đúng ${correctCount}/${exam.questions.length} câu hỏi</span>
    </div>
    
    <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 8px;">
      <button class="btn btn-secondary" id="btnRetryQuiz" style="width: 100%;">Thử lại</button>
      <button class="btn btn-primary" id="btnFinishQuiz" style="width: 100%;">Xem lại Đề thi</button>
    </div>
  `;

  document.getElementById("btnRetryQuiz").addEventListener("click", () => {
    quizState = {
      examId: exam.id,
      answers: {},
      submitted: false
    };
    window.refreshActiveView();
  });

  document.getElementById("btnFinishQuiz").addEventListener("click", () => {
    quizState = null;
    window.refreshActiveView();
  });
}

// --------------------------------------------------------------------------
// 4. RENDER QUESTION BANK VIEW
// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// 4. RENDER QUESTION BANK VIEW
// --------------------------------------------------------------------------
function getExtendedQuestionBank(state) {
  // 1. Gather all questions from exams in the library (which are the "đề thi đã làm/tạo")
  let examQuestions = [];
  if (state.exams) {
    state.exams.forEach(e => {
      const eSubject = e.subject || "Tổng hợp";
      if (e.questions) {
        e.questions.forEach((q, idx) => {
          examQuestions.push({
            id: `exam_q_${e.id}_${idx}`,
            subject: eSubject,
            text: q.text,
            options: q.options,
            answer: q.answer,
            explanation: q.explanation || `Câu hỏi được trích xuất từ đề thi: ${e.title}`
          });
        });
      }
    });
  }

  // 2. Gather user-created questions in the QBank
  const userQbank = state.qbank || [];
  
  // Combine both
  let combined = [...userQbank, ...examQuestions];
  
  // Remove duplicates based on question text to keep the pool clean and distinct
  const seenTexts = new Set();
  combined = combined.filter(q => {
    const textClean = q.text.trim().toLowerCase();
    if (seenTexts.has(textClean)) return false;
    seenTexts.add(textClean);
    return true;
  });
  
  // 3. If combined is less than 100, generate/pre-populate high-quality educational questions to reach 100
  const remaining = 100 - combined.length;
  if (remaining > 0) {
    const seedPool = [
      // Toán
      {
        subject: "Toán",
        text: "Tìm giá trị của x biết: 2x + 5 = 15.",
        options: ["x = 5", "x = 10", "x = 15", "x = 2"],
        answer: 0,
        explanation: "Ta có: 2x = 15 - 5 => 2x = 10 => x = 5."
      },
      {
        subject: "Toán",
        text: "Diện tích hình tròn có bán kính R = 3cm bằng bao nhiêu?",
        options: ["3π cm²", "6π cm²", "9π cm²", "12π cm²"],
        answer: 2,
        explanation: "Diện tích hình tròn S = π.R² = π.(3)² = 9π cm²."
      },
      {
        subject: "Toán",
        text: "Tìm đạo hàm của hàm số y = x^4 - 2x^2 + 1.",
        options: ["y' = 4x^3 - 4x", "y' = 4x^3 - 2x", "y' = x^3 - 4x", "y' = 4x - 4"],
        answer: 0,
        explanation: "Áp dụng công thức đạo hàm: (x^n)' = n.x^(n-1). Ta có: y' = 4x^3 - 4x."
      },
      {
        subject: "Toán",
        text: "Tập nghiệm của phương trình x^2 - 5x + 6 = 0 là:",
        options: ["{1; 5}", "{2; 3}", "{-2; -3}", "{1; 6}"],
        answer: 1,
        explanation: "Phương trình phân tích thành (x-2)(x-3) = 0 => x = 2 hoặc x = 3."
      },
      {
        subject: "Toán",
        text: "Giá trị của cos(60°) bằng bao nhiêu?",
        options: ["1/2", "√3/2", "√2/2", "1"],
        answer: 0,
        explanation: "Giá trị lượng giác cơ bản: cos(60°) = 1/2."
      },
      {
        subject: "Toán",
        text: "Đồ thị hàm số y = (2x + 1)/(x - 1) có tiệm cận đứng là đường thẳng:",
        options: ["x = 1", "x = 2", "y = 2", "y = 1"],
        answer: 0,
        explanation: "Tiệm cận đứng là nghiệm của mẫu số: x - 1 = 0 => x = 1."
      },
      {
        subject: "Toán",
        text: "Một hộp chứa 3 bi đỏ và 2 bi xanh. Chọn ngẫu nhiên 1 bi. Xác suất để chọn được bi đỏ là:",
        options: ["3/5", "2/5", "1/5", "1/2"],
        answer: 0,
        explanation: "Tổng số bi là 5. Số bi đỏ là 3. Xác suất P = 3/5."
      },
      {
        subject: "Toán",
        text: "Cấp số cộng có u1 = 2 và công sai d = 3. Số hạng u5 bằng:",
        options: ["14", "11", "17", "15"],
        answer: 0,
        explanation: "Số hạng tổng quát u_n = u1 + (n-1)d. u5 = 2 + 4*3 = 14."
      },
      // Tiếng Anh
      {
        subject: "Tiếng Anh",
        text: "Choose the correct preposition: 'She is interested ___ learning history.'",
        options: ["at", "on", "in", "about"],
        answer: 2,
        explanation: "Cấu trúc quen thuộc: 'be interested in sth/doing sth' (quan tâm, thích thú cái gì)."
      },
      {
        subject: "Tiếng Anh",
        text: "Which of the following words is a synonym of 'BEAUTIFUL'?",
        options: ["Ugly", "Gorgeous", "Rough", "Plain"],
        answer: 1,
        explanation: "'Gorgeous' có nghĩa là lộng lẫy, cực kỳ đẹp, là từ đồng nghĩa với 'Beautiful'."
      },
      {
        subject: "Tiếng Anh",
        text: "Select the correct form of the verb: 'By the time we arrived, they ___.'",
        options: ["had left", "have left", "left", "were leaving"],
        answer: 0,
        explanation: "Hành động xảy ra và hoàn thành trước một hành động khác trong quá khứ dùng thì Quá khứ hoàn thành (had + V3)."
      },
      {
        subject: "Tiếng Anh",
        text: "Identify the antonym of 'GENEROUS':",
        options: ["Kind", "Mean", "Polite", "Helpful"],
        answer: 1,
        explanation: "'Generous' là hào phóng, từ trái nghĩa là 'Mean' (keo kiệt, ích kỷ)."
      },
      {
        subject: "Tiếng Anh",
        text: "Choose the correct modal verb: 'You ___ touch that hot pan. It will burn you.'",
        options: ["mustn't", "don't have to", "might", "should"],
        answer: 0,
        explanation: "Dùng 'mustn't' để diễn tả sự cấm đoán hoặc khuyên ngăn mạnh mẽ (không được phép)."
      },
      {
        subject: "Tiếng Anh",
        text: "Complete the sentence: 'If it ___ tomorrow, we will cancel the picnic.'",
        options: ["rains", "rain", "will rain", "rained"],
        answer: 0,
        explanation: "Câu điều kiện loại 1 (giả định có thể xảy ra ở hiện tại/tương lai): Mệnh đề If dùng thì Hiện tại đơn (If it rains)."
      },
      // Vật lý
      {
        subject: "Vật lý",
        text: "Một vật chuyển động thẳng đều với vận tốc v = 5m/s. Quãng đường vật đi được sau 10 giây là:",
        options: ["50m", "2m", "0.5m", "15m"],
        answer: 0,
        explanation: "Công thức chuyển động thẳng đều: s = v.t = 5 . 10 = 50m."
      },
      {
        subject: "Vật lý",
        text: "Hệ số ma sát trượt phụ thuộc chủ yếu vào yếu tố nào?",
        options: ["Diện tích tiếp xúc", "Vận tốc của vật", "Vật liệu và tình trạng của hai bề mặt tiếp xúc", "Lực ép N"],
        answer: 2,
        explanation: "Hệ số ma sát trượt chỉ phụ thuộc vào vật liệu cấu tạo và tình trạng (nhám, khô, ướt...) của hai bề mặt tiếp xúc."
      },
      {
        subject: "Vật lý",
        text: "Một sóng âm truyền từ nước ra không khí thì tần số của sóng âm sẽ:",
        options: ["Tăng lên", "Giảm đi", "Không đổi", "Thay đổi tùy theo nhiệt độ"],
        answer: 2,
        explanation: "Khi sóng (cơ học hoặc ánh sáng) truyền qua các môi trường khác nhau, tần số f của sóng luôn luôn không thay đổi."
      },
      {
        subject: "Vật lý",
        text: "Lực tương tác tĩnh điện giữa hai điện tích điểm được xác định theo định luật nào?",
        options: ["Định luật Ohm", "Định luật Newton", "Định luật Coulomb", "Định luật Faraday"],
        answer: 2,
        explanation: "Định luật Coulomb xác định lực hút/đẩy giữa hai điện tích điểm đứng yên F = k.|q1.q2|/r²."
      },
      // Hóa học
      {
        subject: "Hóa học",
        text: "Công thức hóa học của muối ăn thông thường là:",
        options: ["NaCl", "KCl", "HCl", "NaOH"],
        answer: 0,
        explanation: "Muối ăn hàng ngày chủ yếu là Natri Clorua (NaCl)."
      },
      {
        subject: "Hóa học",
        text: "Kim loại nào sau đây ở trạng thái lỏng ở điều kiện thường?",
        options: ["Sắt (Fe)", "Thủy ngân (Hg)", "Đồng (Cu)", "Vàng (Au)"],
        answer: 1,
        explanation: "Thủy ngân (Hg) là kim loại duy nhất ở dạng lỏng ở nhiệt độ phòng thông thường."
      },
      {
        subject: "Hóa học",
        text: "Khí nào sau đây có mùi trứng thối đặc trưng?",
        options: ["CO₂", "NH₃", "H₂S", "SO₂"],
        answer: 2,
        explanation: "Khí Hydro Sunfua (H₂S) là chất khí độc, có mùi trứng thối đặc trưng phát sinh từ chất hữu cơ phân hủy."
      },
      {
        subject: "Hóa học",
        text: "Độ pH của một dung dịch trung tính ở 25°C là bao nhiêu?",
        options: ["pH = 0", "pH = 7", "pH = 14", "pH = 5"],
        answer: 1,
        explanation: "Dung dịch trung tính (như nước tinh khiết) có pH = 7 ở điều kiện tiêu chuẩn."
      },
      // Địa lý
      {
        subject: "Địa lý",
        text: "Tỉnh thành nào của Việt Nam có diện tích lớn nhất cả nước?",
        options: ["Thanh Hóa", "Nghệ An", "Đắk Lắk", "Gia Lai"],
        answer: 1,
        explanation: "Nghệ An là tỉnh có diện tích đất tự nhiên lớn nhất Việt Nam (khoảng 16.490 km²)."
      },
      {
        subject: "Địa lý",
        text: "Thành phố nào được mệnh danh là 'Thành phố của kênh đào'?",
        options: ["Paris", "Venice", "Amsterdam", "London"],
        answer: 1,
        explanation: "Venice (Ý) nổi tiếng thế giới với hệ thống kênh rạch chằng chịt và phương tiện di chuyển chính là thuyền Gondola."
      },
      {
        subject: "Địa lý",
        text: "Sông nào dài nhất thế giới?",
        options: ["Sông Amazon", "Sông Nile", "Sông Mê Kông", "Sông Mississippi"],
        answer: 1,
        explanation: "Sông Nile ở Châu Phi là con sông dài nhất thế giới (khoảng 6.650 km), trong khi sông Amazon có lưu lượng nước lớn nhất."
      },
      // Lịch sử
      {
        subject: "Lịch sử",
        text: "Chiến thắng Điện Biên Phủ vang dội năm nào?",
        options: ["1945", "1954", "1975", "1968"],
        answer: 1,
        explanation: "Chiến thắng lịch sử Điện Biên Phủ lừng lẫy năm châu, chấn động địa cầu diễn ra vào ngày 7 tháng 5 năm 1954."
      },
      {
        subject: "Lịch sử",
        text: "Ai là người lãnh đạo cuộc cách mạng Tháng Mười Nga năm 1917?",
        options: ["Karl Marx", "V.I. Lenin", "Joseph Stalin", "Leon Trotsky"],
        answer: 1,
        explanation: "Vladimir Ilyich Lenin là lãnh tụ vĩ đại của Đảng Bolshevik chỉ đạo thắng lợi cuộc Cách mạng tháng Mười Nga."
      },
      // Sinh học
      {
        subject: "Sinh học",
        text: "Bào quan nào được coi là 'nhà máy năng lượng' của tế bào?",
        options: ["Nhân tế bào", "Ti thể", "Lục lạp", "Ribosome"],
        answer: 1,
        explanation: "Ti thể (Mitochondria) chịu trách nhiệm hô hấp tế bào và tạo ra năng lượng ATP cung cấp cho các hoạt động sống."
      },
      {
        subject: "Sinh học",
        text: "Ai được coi là cha đẻ của ngành Di truyền học hiện đại?",
        options: ["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Alexander Fleming"],
        answer: 1,
        explanation: "Gregor Mendel nổi tiếng với các thí nghiệm lai đậu Hà Lan thiết lập nên các quy luật cơ bản của di truyền học."
      }
    ];

    // Systematic generator to yield enough questions up to 100
    let currentIdx = 0;
    while (combined.length < 100) {
      const seed = seedPool[currentIdx % seedPool.length];
      const repeatNum = Math.floor(currentIdx / seedPool.length) + 1;
      
      combined.push({
        id: `sys_generated_q_${currentIdx}`,
        subject: seed.subject,
        text: repeatNum === 1 ? seed.text : `[Biến thể ${repeatNum}] ${seed.text}`,
        options: seed.options.map(opt => repeatNum === 1 ? opt : `${opt} (Mẫu ${repeatNum})`),
        answer: seed.answer,
        explanation: `${seed.explanation} (Câu hỏi tự động trong ngân hàng)`
      });
      
      currentIdx++;
    }
  }

  return combined;
}

export function renderQBank(container) {
  const state = store.getState();
  
  // Default show answers to false if not set
  if (window.qbankShowAnswers === undefined) {
    window.qbankShowAnswers = false;
  }
  
  const showAnswers = window.qbankShowAnswers;
  const qList = getExtendedQuestionBank(state);

  container.innerHTML = `
    <div class="view-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; width: 100%;">
      <div class="view-title-group">
        <h1 class="view-title">Ngân hàng câu hỏi</h1>
        <p class="view-subtitle" style="color: var(--text-muted);">Kho lưu trữ câu hỏi cá nhân giúp bạn chủ động thiết kế hoặc trộn đề nhanh chóng (gồm câu hỏi từ các đề thi đã làm và bộ câu hỏi mẫu).</p>
      </div>
      <div class="view-header-actions" style="margin-left: auto;">
        <button class="btn ${showAnswers ? 'btn-primary' : 'btn-secondary'} btn-sm" id="btnToggleQBankAnswers" style="padding: 6px 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
          ${showAnswers ? '👁️ Ẩn Đáp Án & Lời Giải' : '👁️ Hiện Đáp Án & Lời Giải'}
        </button>
      </div>
    </div>

    <!-- Grid: Add form & list -->
    <div class="exam-detail-layout">
      <!-- Left side: Questions List -->
      <div class="exam-questions-panel">
        <h2 style="font-family: var(--font-headings); font-size: 1.15rem;">Danh sách câu hỏi hiện tại (${qList.length} câu)</h2>
        
        <div id="qbankQuestionsList" style="display: flex; flex-direction: column; gap: 16px;">
          ${qList.map((q, idx) => `
            <div class="question-item-card card" style="transition: all 0.3s ease;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="suggested-tag" style="background-color: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 4px; font-size: 0.65rem;">Môn: ${q.subject}</span>
                <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">#${idx + 1}</span>
              </div>
              <p class="question-text" style="font-size: 1rem; margin-top: 6px; font-weight: 600;">${q.text}</p>
              
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; padding-left: 0; margin-top: 10px;">
                ${q.options.map((opt, oIdx) => {
                  const letter = String.fromCharCode(65 + oIdx);
                  const isCorrect = oIdx === q.answer;
                  const correctStyle = (isCorrect && showAnswers) ? 'color: #065f46; font-weight: 600; background-color: #d1fae5; border-color: #10b981; padding: 6px 12px; border-radius: var(--radius-md); border-left: 4px solid #10b981;' : '';
                  return `
                    <li style="font-size: 0.95rem; display: flex; align-items: center; gap: 6px; padding: 4px 0; ${correctStyle}">
                      <strong>${letter}.</strong>
                      <span>${opt}</span>
                      ${(isCorrect && showAnswers) ? '<span style="color:#10b981; font-weight:bold; margin-left:6px;">✓</span>' : ''}
                    </li>
                  `;
                }).join('')}
              </ul>
              
              ${(q.explanation && showAnswers) ? `
                <div class="question-explanation" style="font-size: 0.85rem; padding: 10px 14px; margin-top: 10px; background-color: var(--bg-hover); border-left: 3px solid var(--text-muted); border-radius: 4px; font-style: italic;">
                  <strong>Giải thích:</strong> ${q.explanation}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Right side: Add Question Form -->
      <div>
        <div class="card" style="position: sticky; top: 20px;">
          <h3 style="font-family: var(--font-headings); font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; margin-bottom: 16px;">Thêm câu hỏi mới</h3>
          
          <form id="formAddQuestionBank">
            <div class="form-group">
              <label for="qSubject">Môn học</label>
              <input type="text" id="qSubject" placeholder="Ví dụ: Toán, Anh, Hóa..." required />
            </div>

            <div class="form-group">
              <label for="qText">Nội dung câu hỏi <span class="required">*</span></label>
              <textarea id="qText" rows="3" placeholder="Nhập câu hỏi..." required></textarea>
            </div>

            <div class="form-group">
              <label>Các phương án lựa chọn <span class="required">*</span></label>
              <input type="text" id="qOptA" placeholder="Phương án A" style="margin-bottom: 6px;" required />
              <input type="text" id="qOptB" placeholder="Phương án B" style="margin-bottom: 6px;" required />
              <input type="text" id="qOptC" placeholder="Phương án C" style="margin-bottom: 6px;" required />
              <input type="text" id="qOptD" placeholder="Phương án D" required />
            </div>

            <div class="form-group">
              <label for="qAnswer">Đáp án đúng <span class="required">*</span></label>
              <select id="qAnswer" required>
                <option value="0">Phương án A</option>
                <option value="1">Phương án B</option>
                <option value="2">Phương án C</option>
                <option value="3">Phương án D</option>
              </select>
            </div>

            <div class="form-group">
              <label for="qExplanation">Giải thích lời giải</label>
              <textarea id="qExplanation" rows="2" placeholder="Giải thích chi tiết..."></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
              Lưu vào kho câu hỏi
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Attach handlers
  document.getElementById("btnToggleQBankAnswers").addEventListener("click", () => {
    window.qbankShowAnswers = !window.qbankShowAnswers;
    renderQBank(container);
  });

  document.getElementById("formAddQuestionBank").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const subject = document.getElementById("qSubject").value.trim();
    const text = document.getElementById("qText").value.trim();
    const optA = document.getElementById("qOptA").value.trim();
    const optB = document.getElementById("qOptB").value.trim();
    const optC = document.getElementById("qOptC").value.trim();
    const optD = document.getElementById("qOptD").value.trim();
    const answer = document.getElementById("qAnswer").value;
    const explanation = document.getElementById("qExplanation").value.trim();

    store.addQuestion({
      subject,
      text,
      options: [optA, optB, optC, optD],
      answer,
      explanation
    });

    alert("Đã lưu câu hỏi mới vào ngân hàng thành công!");
    renderQBank(container);
  });
}

// --------------------------------------------------------------------------
// 5. RENDER SETTINGS VIEW
// --------------------------------------------------------------------------
export function renderSettings(container) {
  const state = store.getState();

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Cài đặt hệ thống</h1>
        <p class="view-subtitle" style="color: var(--text-muted);">Cấu hình hồ sơ cá nhân, giao diện sử dụng và các khóa API nhà phát triển.</p>
      </div>
    </div>

    <div class="settings-layout">
      <!-- Section 1: User Profile -->
      <div class="settings-section-card card">
        <h2 class="settings-section-title">Hồ sơ người dùng</h2>
        
        <form id="formUserSettings">
          <div class="form-group">
            <label for="settingUserName">Tên hiển thị <span class="required">*</span></label>
            <input type="text" id="settingUserName" value="${state.user.name}" required />
          </div>
          <div class="form-group">
            <label for="settingUserEmail">Địa chỉ Email <span class="required">*</span></label>
            <input type="email" id="settingUserEmail" value="${state.user.email}" disabled style="opacity: 0.6;" />
            <p class="form-hint">Email đăng nhập không thể thay đổi.</p>
          </div>
          <div class="form-group">
            <label for="settingUserRole">Vai trò tài khoản <span class="required">*</span></label>
            <div class="composer-select-wrapper">
              <select id="settingUserRole" class="composer-select" style="min-width: 100%; padding: 10px 32px 10px 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md); background-color: var(--bg-input); color: var(--text-main);">
                <option value="teacher" ${state.user.role === 'teacher' ? 'selected' : ''}>Giáo viên</option>
                <option value="student" ${state.user.role === 'student' ? 'selected' : ''}>Học sinh</option>
              </select>
            </div>
            <p class="form-hint">Chuyển đổi vai trò để xem giao diện dưới góc nhìn Giáo viên hoặc Học sinh.</p>
          </div>
          <button type="submit" class="btn btn-primary" style="align-self: flex-start;">
            Cập nhật hồ sơ
          </button>
        </form>
      </div>

      <!-- Section 2: Developer Configuration API (Gemini & Google OAuth) -->
      <div class="settings-section-card card">
        <h2 class="settings-section-title">Cấu hình API Nhà phát triển (Bắt buộc để chạy thật)</h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">Cấu hình các API Key chính thức của Google để chạy thực tế tính năng đăng nhập và soạn đề AI.</p>
        
        <div class="form-group">
          <label for="settingGeminiApiKey">Google Gemini API Key</label>
          <div style="display: flex; gap: 8px;">
            <input type="password" id="settingGeminiApiKey" value="${state.user.geminiApiKey || ''}" placeholder="Nhập một hoặc nhiều API Key, cách nhau bằng dấu phẩy (Ví dụ: key1, key2)..." style="flex: 1;" />
            <button class="btn btn-secondary" id="btnTestGeminiKey" style="white-space: nowrap; padding: 10px 14px;">Kiểm tra kết nối</button>
          </div>
          <p class="form-hint">Dùng để tạo đề trắc nghiệm thật không giới hạn. Có thể nhập nhiều Key ngăn cách bằng dấu phẩy để tự động xoay vòng chống nghẽn. Nhận Key miễn phí tại <a href="https://aistudio.google.com/" target="_blank" style="color: hsl(var(--primary)); font-weight:600; text-decoration: underline;">Google AI Studio</a>.</p>
          <div id="geminiTestResult" style="margin-top: 8px; display: none; font-size: 0.85rem; font-weight: 600; padding: 8px 12px; border-radius: var(--radius-sm);"></div>
        </div>

        <div class="form-group">
          <label for="settingGoogleClientId">Google Client ID (OAuth 2.0)</label>
          <div style="display: flex; gap: 8px;">
            <input type="text" id="settingGoogleClientId" value="${state.user.googleClientId || ''}" placeholder="123456-abcdef.apps.googleusercontent.com" style="flex: 1;" />
            <button class="btn btn-secondary" id="btnTestGoogleClient" style="white-space: nowrap; padding: 10px 14px;">Kiểm tra kết nối</button>
          </div>
          <p class="form-hint">Dùng để kết nối nút Đăng nhập bằng Google thật. Đăng ký Client ID tại <a href="https://console.cloud.google.com/" target="_blank" style="color: hsl(var(--primary)); font-weight:600; text-decoration: underline;">Google Cloud Console</a>.</p>
          <div id="googleTestResult" style="margin-top: 8px; display: none; font-size: 0.85rem; font-weight: 600; padding: 8px 12px; border-radius: var(--radius-sm);"></div>
        </div>

        <button class="btn btn-primary" id="btnSaveDeveloperSettings" style="align-self: flex-start;">
          Lưu cấu hình API
        </button>
      </div>

      <!-- Section 3: Giao diện -->
      <div class="settings-section-card card">
        <h2 class="settings-section-title">Cài đặt giao diện</h2>
        
        <div class="theme-toggle-row" style="display: flex; align-items: center; justify-content: space-between; gap: 16px;">
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 600;">Chế độ giao diện</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Chọn giao diện sáng, tối hoặc tự động chuyển đổi theo thời gian thực.</p>
          </div>
          <div class="composer-select-wrapper">
            <select id="settingThemeSelect" class="composer-select" style="min-width: 140px; padding: 10px 32px 10px 16px;">
              <option value="light" ${state.user.theme === "light" ? "selected" : ""}>☀️ Sáng</option>
              <option value="dark" ${state.user.theme === "dark" ? "selected" : ""}>🌙 Tối</option>
              <option value="auto" ${state.user.theme === "auto" ? "selected" : ""}>⏰ Tự động</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Section 4: Gói cước tài khoản -->
      <div class="settings-section-card card">
        <h2 class="settings-section-title">Gói tài khoản sử dụng</h2>
        <div id="settingsPlanStatusContainer" style="margin-bottom: 16px;"></div>
        
        <div class="pricing-cards-container">
          <div class="plan-card-option" id="settingsPlanTrial" data-plan-name="Trial" style="display: none;">
            <span class="plan-option-name">Gói dùng thử (Trial)</span>
            <span class="plan-option-price">Miễn phí<span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">/ 7 ngày</span></span>
            <ul class="plan-option-features">
              <li>✓ Soạn đề AI không giới hạn</li>
              <li>✓ Không cần cấu hình API Key</li>
              <li>✓ Hạn sử dụng: 7 ngày</li>
            </ul>
          </div>
          
          <div class="plan-card-option" id="settingsPlanFree" data-plan-name="Free">
            <span class="plan-option-name">Gói miễn phí (Free)</span>
            <span class="plan-option-price">0 đ<span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">/ tháng</span></span>
            <ul class="plan-option-features">
              <li>✓ Quản lý lớp học & thư viện</li>
              <li>✓ Tự cấu hình API Key riêng</li>
              <li>✗ Khóa tính năng AI mặc định</li>
            </ul>
          </div>
          
          <div class="plan-card-option" id="settingsPlanPro" data-plan-name="Pro">
            <span class="plan-option-name">Gói chuyên nghiệp (Pro)</span>
            <span class="plan-option-price">99.000 đ<span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">/ tháng</span></span>
            <ul class="plan-option-features">
              <li>✓ Soạn đề AI không giới hạn</li>
              <li>✓ Xuất file Word/PDF cao cấp</li>
              <li>✓ Phê duyệt mở khóa tức thì</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Section 5: Dang xuat -->
      <div class="card" style="border-color: #fca5a5; background-color: hsla(0, 100%, 98%, 0.5); display: flex; flex-direction: column; gap: 10px;">
        <h3 style="color: #b91c1c; font-family: var(--font-headings); font-size: 1rem;">Đăng xuất</h3>
        <p style="font-size: 0.8rem; color: var(--text-muted);">Đăng xuất khỏi tài khoản hiện tại trên thiết bị này.</p>
        <button class="btn btn-secondary" id="btnSettingsLogout" style="border-color: #f87171; color: #ef4444; align-self: flex-start;">
          Đăng xuất tài khoản
        </button>
      </div>
    </div>
  `;

  // Attach Profile update
  document.getElementById("formUserSettings").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("settingUserName").value.trim();
    const role = document.getElementById("settingUserRole").value;
    
    store.updateUser({ name, role });
    alert("Đã cập nhật hồ sơ cá nhân!");
    window.refreshUserProfileWidget();
    window.refreshActiveView();
    
    const greeting = document.getElementById("homeUserGreeting");
    if (greeting) greeting.innerText = name;
  });

  // Test Gemini API Connection
  const btnTestGemini = document.getElementById("btnTestGeminiKey");
  const geminiTestResult = document.getElementById("geminiTestResult");
  btnTestGemini.addEventListener("click", async () => {
    const key = document.getElementById("settingGeminiApiKey").value.trim();
    if (!key) {
      alert("Vui lòng nhập Google Gemini API Key trước khi kiểm tra!");
      return;
    }

    btnTestGemini.innerText = "Đang kết nối...";
    btnTestGemini.disabled = true;
    geminiTestResult.style.display = "none";

    try {
      const apiKeys = key.split(",").map(k => k.trim()).filter(Boolean);
      const testPromises = apiKeys.map(async (apiKey, idx) => {
        const res = await testSingleAPIKey(apiKey);
        return { index: idx + 1, ...res };
      });
      
      const results = await Promise.all(testPromises);
      
      btnTestGemini.innerText = "Kiểm tra kết nối";
      btnTestGemini.disabled = false;
      geminiTestResult.style.display = "block";

      const allSuccess = results.every(r => r.ok);
      const allFailed = results.every(r => !r.ok);
      
      let alertHtml = "";
      if (allSuccess) {
        geminiTestResult.style.backgroundColor = "#dcfce7";
        geminiTestResult.style.color = "#166534";
        alertHtml = `✓ Kết nối thành công! Tất cả ${apiKeys.length} API Key đều hoạt động hoàn hảo:<br>`;
        results.forEach(r => {
          alertHtml += `<span style="font-size: 0.85rem;">- Key #${r.index}: Hoạt động (Mô hình: ${r.modelUsed})</span><br>`;
        });
      } else if (allFailed) {
        geminiTestResult.style.backgroundColor = "#fee2e2";
        geminiTestResult.style.color = "#991b1b";
        alertHtml = `✗ Lỗi kết nối Google API! Không có API Key nào hoạt động:<br>`;
        results.forEach(r => {
          alertHtml += `<div style="margin-top: 4px; font-size: 0.8rem; border-top: 1px dashed #f87171; padding-top: 4px; text-align: left;">`;
          alertHtml += `⚠️ Key #${r.index} hỏng: ${r.error}<br>`;
          alertHtml += `</div>`;
        });
      } else {
        geminiTestResult.style.backgroundColor = "#fffbeb";
        geminiTestResult.style.color = "#b45309";
        alertHtml = `⚠️ Kết nối thành công một phần! (Có khóa lỗi và khóa hoạt động):<br>`;
        results.forEach(r => {
          if (r.ok) {
            alertHtml += `<span style="font-size: 0.85rem; color: #166534; font-weight: bold;">✓ Key #${r.index}: Hoạt động (Mô hình: ${r.modelUsed})</span><br>`;
          } else {
            alertHtml += `<div style="margin-top: 4px; font-size: 0.8rem; border-top: 1px dashed #f59e0b; padding-top: 4px; text-align: left; color: #991b1b;">`;
            alertHtml += `⚠️ Key #${r.index} hỏng: ${r.error}<br>`;
            alertHtml += `</div>`;
          }
        });
      }
      geminiTestResult.innerHTML = alertHtml;
    } catch (err) {
      btnTestGemini.innerText = "Kiểm tra kết nối";
      btnTestGemini.disabled = false;
      geminiTestResult.style.display = "block";
      geminiTestResult.style.backgroundColor = "#fee2e2";
      geminiTestResult.style.color = "#991b1b";
      geminiTestResult.innerHTML = `✗ Lỗi kiểm tra kết nối: <strong>${err.message}</strong>`;
    }
  });

  // Test Google Client ID configuration
  const btnTestGoogle = document.getElementById("btnTestGoogleClient");
  const googleTestResult = document.getElementById("googleTestResult");
  btnTestGoogle.addEventListener("click", () => {
    const clientId = document.getElementById("settingGoogleClientId").value.trim();
    if (!clientId) {
      alert("Vui lòng nhập Google Client ID trước khi kiểm tra!");
      return;
    }

    googleTestResult.style.display = "block";

    if (!clientId.endsWith(".apps.googleusercontent.com")) {
      googleTestResult.style.backgroundColor = "#fee2e2";
      googleTestResult.style.color = "#991b1b";
      googleTestResult.innerText = "✗ Định dạng Client ID không hợp lệ! Định dạng chuẩn phải kết thúc bằng '.apps.googleusercontent.com'.";
      return;
    }

    if (typeof google === "undefined" || !google.accounts) {
      googleTestResult.style.backgroundColor = "#fee2e2";
      googleTestResult.style.color = "#991b1b";
      googleTestResult.innerText = "✗ Thư viện Google Identity Services chưa được tải. Vui lòng kiểm tra lại kết nối mạng của bạn.";
      return;
    }

    try {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: () => {}
      });
      googleTestResult.style.backgroundColor = "#dcfce7";
      googleTestResult.style.color = "#166534";
      googleTestResult.innerHTML = `✓ Cấu hình cục bộ hợp lệ! Nút đăng nhập Google chính thức của Google SDK sẽ xuất hiện ở màn hình ngoài sau khi bạn bấm <strong>Lưu cấu hình API</strong> và thực hiện Đăng xuất.`;
    } catch (err) {
      googleTestResult.style.backgroundColor = "#fee2e2";
      googleTestResult.style.color = "#991b1b";
      googleTestResult.innerText = `✗ Lỗi khởi tạo Google SDK: ${err.message}`;
    }
  });

  // Save Developer Settings
  document.getElementById("btnSaveDeveloperSettings").addEventListener("click", () => {
    const geminiApiKey = document.getElementById("settingGeminiApiKey").value.trim();
    const googleClientId = document.getElementById("settingGoogleClientId").value.trim();
    const plan = geminiApiKey ? "Pro" : "Free";
    
    store.updateUser({ geminiApiKey, googleClientId, plan });
    alert("Đã cấu hình các khóa API Google thành công! Ứng dụng sẽ tự động tải lại để kích hoạt các cài đặt.");
    location.reload();
  });

  // Attach Theme change dropdown
  const themeSelect = document.getElementById("settingThemeSelect");
  if (themeSelect) {
    themeSelect.addEventListener("change", () => {
      const theme = themeSelect.value;
      store.updateUser({ theme });
      
      // Apply theme immediately
      if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else if (theme === "light") {
        document.documentElement.removeAttribute("data-theme");
      } else if (theme === "auto") {
        const hour = new Date().getHours();
        if (hour >= 18 || hour < 6) {
          document.documentElement.setAttribute("data-theme", "dark");
        } else {
          document.documentElement.removeAttribute("data-theme");
        }
      }
    });
  }

  // Update Plan UI states
  const planStatusContainer = document.getElementById("settingsPlanStatusContainer");
  const sub = store.getSubscriptionStatus();
  
  if (planStatusContainer) {
    if (sub.plan === "Pro") {
      planStatusContainer.innerHTML = `
        <div class="plan-status-alert alert-pro" style="padding: 14px; border-radius: var(--radius-md); background-color: #e0f2fe; border: 1px solid #7dd3fc; color: #0369a1; font-size: 0.9rem; font-weight: 500; display: flex; flex-direction: column; gap: 4px;">
          <span>🌟 Bạn đang sử dụng gói <strong>PRO Chuyên nghiệp</strong> (Còn <strong>${sub.daysRemaining} ngày</strong>).</span>
          <span style="font-size: 0.78rem; opacity: 0.85;">Thời hạn đến ngày ${new Date(sub.expiresAt).toLocaleDateString('vi-VN')}.</span>
        </div>
      `;
      const badge = document.getElementById("settingsPlanPro");
      if (badge) badge.classList.add("active");
    } else if (sub.plan === "Trial") {
      planStatusContainer.innerHTML = `
        <div class="plan-status-alert alert-trial" style="padding: 14px; border-radius: var(--radius-md); background-color: #eff6ff; border: 1px solid #93c5fd; color: #1e3a8a; font-size: 0.9rem; font-weight: 500; display: flex; flex-direction: column; gap: 4px;">
          <span>🎁 Bạn đang dùng thử <strong>7 ngày miễn phí</strong> (Còn <strong>${sub.daysRemaining} ngày</strong>).</span>
          <span style="font-size: 0.78rem; opacity: 0.85; margin-bottom: 6px;">Thời hạn dùng thử đến ngày ${new Date(sub.expiresAt).toLocaleDateString('vi-VN')}.</span>
          <button class="btn btn-primary btn-sm" id="btnSettingsUpgrade" style="align-self: flex-start; padding: 6px 12px; font-size: 0.8rem;">Nâng cấp Pro ngay</button>
        </div>
      `;
      const trialBadge = document.getElementById("settingsPlanTrial");
      if (trialBadge) {
        trialBadge.style.display = "block";
        trialBadge.classList.add("active");
      }
    } else {
      const expiredText = sub.status === "trial_expired" ? "Hết hạn dùng thử" : "Hết hạn Pro";
      planStatusContainer.innerHTML = `
        <div class="plan-status-alert alert-free" style="padding: 14px; border-radius: var(--radius-md); background-color: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; font-size: 0.9rem; font-weight: 500; display: flex; flex-direction: column; gap: 4px;">
          <span>⚠️ Tài khoản của bạn là gói <strong>Miễn phí (${expiredText})</strong>.</span>
          <span style="font-size: 0.78rem; opacity: 0.85; margin-bottom: 6px;">Các tính năng tạo đề thi bằng AI đã khóa (Trừ khi bạn điền API Key cá nhân bên trên).</span>
          <button class="btn btn-primary btn-sm" id="btnSettingsUpgrade" style="align-self: flex-start; padding: 6px 12px; font-size: 0.8rem;">Nâng cấp gói PRO (99.000đ)</button>
        </div>
      `;
      const badge = document.getElementById("settingsPlanFree");
      if (badge) badge.classList.add("active");
    }
  }

  // Settings Upgrade Button Click
  const btnSettingsUpgrade = document.getElementById("btnSettingsUpgrade");
  if (btnSettingsUpgrade) {
    btnSettingsUpgrade.addEventListener("click", () => {
      if (window.openUpgradeModal) window.openUpgradeModal();
    });
  }

  // Attach Plan change
  container.querySelectorAll(".plan-card-option").forEach(card => {
    card.addEventListener("click", () => {
      const planName = card.getAttribute("data-plan-name");
      if (planName === "Pro") {
        if (window.openUpgradeModal) window.openUpgradeModal();
      } else if (planName === "Free") {
        if (confirm("Chuyển về gói Miễn phí? Các tính năng AI sẽ bị giới hạn cho đến khi nâng cấp hoặc điền API Key riêng.")) {
          // Force free plan simulator
          const activeState = store.getState();
          activeState.user.plan = "Free";
          // Simulate account created 10 days ago to expire trial
          activeState.user.createdAt = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
          store.saveState(activeState);
          
          alert("Đã chuyển đổi tài khoản về gói Miễn phí (Hết hạn dùng thử) để bạn test thử!");
          location.reload();
        }
      }
    });
  });

  // Settings Logout Click
  document.getElementById("btnSettingsLogout").addEventListener("click", () => {
    if (confirm("Bạn có muốn đăng xuất khỏi MyaQuiz không?")) {
      store.logout();
      window.onLogout();
    }
  });
}

// --------------------------------------------------------------------------
// 6. RENDER GUIDE VIEW
// --------------------------------------------------------------------------
export function renderGuide(container) {
  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Hướng dẫn sử dụng</h1>
        <p class="view-subtitle" style="color: var(--text-muted);">Tìm hiểu cách thức vận hành hệ thống tạo đề & tổ chức thi thông minh MyaQuiz.ai.</p>
      </div>
    </div>

    <div class="settings-layout" style="max-width: 800px;">
      <div class="card" style="display: flex; flex-direction: column; gap: 20px;">
        <h3 style="font-family: var(--font-headings); font-size: 1.2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Quy trình tạo đề thi thật qua Gemini API</h3>
        
        <div style="display: flex; gap: 16px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background-color: hsl(var(--primary-light)); color: hsl(var(--primary-dark)); display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">1</div>
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 4px;">Bước 1: Lấy API Key miễn phí</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Nhấp chọn liên kết <a href="https://aistudio.google.com/" target="_blank" style="color: hsl(var(--primary)); text-decoration: underline;">Google AI Studio</a>, đăng nhập bằng tài khoản Google bất kỳ và tạo khóa API (API Key) miễn phí chỉ trong 2 click.</p>
          </div>
        </div>

        <div style="display: flex; gap: 16px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background-color: hsl(var(--primary-light)); color: hsl(var(--primary-dark)); display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">2</div>
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 4px;">Bước 2: Cấu hình vào MyaQuiz</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Vào mục <strong>Cài đặt</strong> trên sidebar, dán API Key vừa nhận được vào mục <strong>Google Gemini API Key</strong> và nhấn <strong>Lưu cấu hình API</strong>.</p>
          </div>
        </div>

        <div style="display: flex; gap: 16px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background-color: hsl(var(--primary-light)); color: hsl(var(--primary-dark)); display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">3</div>
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 4px;">Bước 3: Nhập yêu cầu soạn đề thi</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Quay lại <strong>Trang chủ</strong>, nhập bất kỳ chủ đề hoặc dán bài giảng nào bạn muốn, ví dụ: <em>"Tạo 8 câu trắc nghiệm Lịch sử Việt Nam giai đoạn 1945"</em> rồi nhấn <strong>Gửi AI</strong>. Gemini sẽ tạo đề thật 100% theo đúng yêu cầu!</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 7. FILE READER HELPER FUNCTIONS
// --------------------------------------------------------------------------
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

async function extractTextFromPDF(arrayBuffer) {
  const pdfjs = typeof pdfjsLib !== "undefined" ? pdfjsLib : window['pdfjs-dist/build/pdf'];
  if (!pdfjs) throw new Error("Thư viện PDF.js chưa được tải xong, vui lòng thử lại sau!");
  
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
  
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let fullText = "";
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    fullText += pageText + "\n";
  }
  return fullText;
}

function extractTextFromDocx(arrayBuffer) {
  return new Promise((resolve, reject) => {
    if (typeof mammoth === "undefined") {
      reject(new Error("Thư viện Mammoth.js chưa được tải xong, vui lòng thử lại sau!"));
      return;
    }
    mammoth.extractRawText({ arrayBuffer: arrayBuffer })
      .then(result => resolve(result.value))
      .catch(err => reject(err));
  });
}
