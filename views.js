import * as store from './store.js';

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
let currentExamDetailId = null;
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
                  <stop stop-color="#a78bfa" />
                  <stop offset="1" stop-color="#8b5cf6" />
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
            <input type="email" id="authEmail" placeholder="name@example.com" value="dalk2000vtp@gmail.com" required />
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label for="authPassword">Mật khẩu <span class="required">*</span></label>
            <input type="password" id="authPassword" placeholder="Nhập mật khẩu" value="123" required />
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

    // Form submit logic
    document.getElementById("authSubmitForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("authEmail").value.trim();
      const password = document.getElementById("authPassword").value;

      if (activeTab === "login") {
        const success = store.login(email, password);
        if (success) {
          window.onAuthSuccess();
        } else {
          alert("Email hoặc mật khẩu không hợp lệ! (Mẹo: Mặc định là dalk2000vtp@gmail.com / mật khẩu 123)");
        }
      } else {
        const name = document.getElementById("authName").value.trim();
        const success = store.register(name, email, password);
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
                store.loginGoogle(decoded.email, decoded.name, decoded.picture);
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
      const width = 480;
      const height = 560;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open("", "GoogleOAuthPopup", `width=${width},height=${height},left=${left},top=${top},menubar=no,status=no,toolbar=no`);
      
      if (!popup) {
        alert("Pop-up bị trình duyệt chặn! Vui lòng bật hỗ trợ cửa sổ pop-up cho trang này để đăng nhập Google.");
        return;
      }

      // Write mock Google Accounts interface in the popup window
      popup.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <title>Đăng nhập bằng Google</title>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Roboto', sans-serif;
              margin: 0;
              padding: 36px 30px;
              background-color: #ffffff;
              color: #202124;
              display: flex;
              flex-direction: column;
              height: calc(100vh - 72px);
              justify-content: space-between;
              box-sizing: border-box;
            }
            .header {
              text-align: center;
              margin-bottom: 24px;
            }
            .google-logo {
              width: 74px;
              height: 28px;
              margin-bottom: 12px;
            }
            .title {
              font-size: 22px;
              font-weight: 400;
              line-height: 1.3;
              color: #202124;
              margin: 0 0 6px 0;
            }
            .subtitle {
              font-size: 14px;
              color: #5f6368;
              margin: 0;
            }
            .account-list {
              border: 1px solid #dadce0;
              border-radius: 8px;
              list-style: none;
              padding: 0;
              margin: 16px 0;
              overflow: hidden;
            }
            .account-item {
              padding: 14px 16px;
              display: flex;
              align-items: center;
              gap: 12px;
              cursor: pointer;
              border-bottom: 1px solid #dadce0;
              transition: background 0.15s;
            }
            .account-item:last-child {
              border-bottom: none;
            }
            .account-item:hover {
              background-color: #f8f9fa;
            }
            .avatar {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background-color: #8b5cf6;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 500;
              font-size: 14px;
            }
            .avatar-google {
              background-color: #f1f3f4;
              color: #5f6368;
            }
            .info {
              display: flex;
              flex-direction: column;
              text-align: left;
            }
            .name {
              font-size: 13.5px;
              font-weight: 500;
              color: #3c4043;
            }
            .email {
              font-size: 11.5px;
              color: #5f6368;
            }
            .footer {
              display: flex;
              justify-content: space-between;
              font-size: 11.5px;
              color: #70757a;
              border-top: 1px solid #f1f3f4;
              padding-top: 14px;
            }
            .footer a {
              color: #70757a;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
            .loading {
              display: none;
              flex-direction: column;
              align-items: center;
              gap: 16px;
              margin-top: 40px;
              text-align: center;
            }
            .spinner {
              width: 32px;
              height: 32px;
              border: 3px solid #f3f3f3;
              border-top: 3px solid #8b5cf6;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div id="authContent">
            <div class="header">
              <svg class="google-logo" viewBox="0 0 74 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 74px; height: 24px;">
                <path d="M11.2 12.3c0-3.3 2.7-5.9 5.9-5.9 1.7 0 3.2.7 4.2 1.9l-2.4 2.4c-.5-.7-1.1-1-1.8-1-1.9 0-3.4 1.5-3.4 3.4s1.5 3.4 3.4 3.4c1 0 1.7-.5 2.1-1.1v-1.5h-2.1v-2.5h4.6v4.6c-1.1 1.7-3 2.7-4.6 2.7-3.2-.1-5.9-2.7-5.9-6zm18.3 2.1c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zm-2.5 0c0-1-.8-1.8-1.5-1.8s-1.5.8-1.5 1.8.8 1.8 1.5 1.8 1.5-.8 1.5-1.8zm11 0c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zm-2.5 0c0-1-.8-1.8-1.5-1.8s-1.5.8-1.5 1.8.8 1.8 1.5 1.8 1.5-.8 1.5-1.8zm10.7 2.1c0 2.2-1.8 4-4 4s-3.7-1.7-3.7-3.5v-.5c0-1.8 1.5-3.5 3.7-3.5s4 1.8 4 4v.5c0 1.2-1 2.2-2.2 2.2s-2.2-1-2.2-2.2v-.5h-2.5v.5c0 2.6 2.1 4.7 4.7 4.7s4.7-2.1 4.7-4.7v-7.3h-2.5v1.2zm-2.5-2.1c0-1-.8-1.8-1.5-1.8s-1.5.8-1.5 1.8.8 1.8 1.5 1.8 1.5-.8 1.5-1.8zM57 1v17.2h-2.5V1H57zm8.4 13.4c-1 0-1.5-.5-1.8-1.1l5.5-2.3-.2-.5c-.4-1.1-1.7-3.5-4.5-3.5-2.8 0-5.1 2.2-5.1 5.9 0 3.3 2.3 5.9 5.6 5.9 2.7 0 4.2-1.6 4.9-2.5l-2-1.3c-.7.9-1.5-1.5-2.4-1.5zm-.2-4.1c.7 0 1.3.4 1.5.9l-3.6 1.5c0-1.7.9-2.4 2.1-2.4z" fill="#757575"/>
              </svg>
              <h1 class="title">Chọn một tài khoản</h1>
              <p class="subtitle">để đăng nhập vào MyaQuiz.ai</p>
            </div>

            <ul class="account-list">
              <li class="account-item" id="accDefault">
                <div class="avatar">TN</div>
                <div class="info">
                  <span class="name">Thìn Nguyễn</span>
                  <span class="email">dalk2000vtp@gmail.com</span>
                </div>
              </li>
              <li class="account-item" id="accOther">
                <div class="avatar avatar-google">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>
                </div>
                <div class="info">
                  <span class="name">Sử dụng tài khoản khác</span>
                  <span class="email">Đăng nhập email Google khác</span>
                </div>
              </li>
            </ul>
          </div>

          <div class="loading" id="loadingArea">
            <div class="spinner"></div>
            <p style="font-size: 14px; color: #5f6368;" id="loadText">Đang liên kết với MyaQuiz...</p>
          </div>

          <div class="footer">
            <span>Tiếng Việt</span>
            <div style="display: flex; gap: 12px;">
              <a href="#">Bảo mật</a>
              <a href="#">Điều khoản</a>
            </div>
          </div>

          <script>
            const accDefault = document.getElementById("accDefault");
            const accOther = document.getElementById("accOther");
            const authContent = document.getElementById("authContent");
            const loadingArea = document.getElementById("loadingArea");
            const loadText = document.getElementById("loadText");

            function loginBack(email, name) {
              authContent.style.display = "none";
              loadingArea.style.display = "flex";
              
              setTimeout(() => {
                loadText.innerText = "Đồng bộ tài khoản thành công!";
                setTimeout(() => {
                  window.opener.postMessage({
                    type: 'MYAQUIZ_GOOGLE_LOGIN',
                    email: email,
                    name: name
                  }, window.location.origin);
                  window.close();
                }, 800);
              }, 1000);
            }

            accDefault.addEventListener("click", () => {
              loginBack("dalk2000vtp@gmail.com", "Thìn Nguyễn");
            });

            accOther.addEventListener("click", () => {
              const email = prompt("Nhập Email Google của bạn:");
              if (!email || !email.trim()) return;
              
              let name = prompt("Nhập Họ & Tên của bạn:");
              if (!name || !name.trim()) name = email.split('@')[0];
              
              loginBack(email.trim(), name.trim());
            });
          </script>
        </body>
        </html>
      `);
      popup.document.close();
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

  // File Attachment simulation
  const btnAttach = document.getElementById("btnComposerAttach");
  const attachedRow = document.getElementById("attachedFilesRow");
  
  btnAttach.addEventListener("click", () => {
    const mockFiles = [
      "baigiang_daoham_lop12.pdf", 
      "baitap_generation_gap_unit1.docx", 
      "lythuyet_daodong_vatly12.pdf"
    ];
    // Pick random file
    const picked = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    if (!attachedFiles.includes(picked)) {
      attachedFiles.push(picked);
      updateAttachedFilesUI();
    }
  });

  function updateAttachedFilesUI() {
    if (attachedFiles.length === 0) {
      attachedRow.style.display = "none";
      attachedRow.innerHTML = "";
    } else {
      attachedRow.style.display = "flex";
      attachedRow.innerHTML = attachedFiles.map((file, idx) => `
        <div class="attached-file-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <span>${file}</span>
          <button data-idx="${idx}" class="btn-remove-attachment">&times;</button>
        </div>
      `).join('');
      
      attachedRow.querySelectorAll(".btn-remove-attachment").forEach(btn => {
        btn.addEventListener("click", () => {
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
    const promptText = promptInput.value.trim();
    if (!promptText && attachedFiles.length === 0) {
      alert("Vui lòng nhập nội dung yêu cầu soạn đề hoặc đính kèm tài liệu học tập!");
      return;
    }

    // Check Gemini API Key
    const state = store.getState();
    let subjectKey = "default";
    const lowerText = (promptText + " " + attachedFiles.join(" ")).toLowerCase();
    
    if (lowerText.includes("toán") || lowerText.includes("math") || lowerText.includes("đạo hàm") || lowerText.includes("tích phân") || lowerText.includes("giải tích")) {
      subjectKey = "toan";
    } else if (lowerText.includes("anh") || lowerText.includes("english") || lowerText.includes("grammar") || lowerText.includes("generation gap")) {
      subjectKey = "tienganh";
    } else if (lowerText.includes("lý") || lowerText.includes("physics") || lowerText.includes("dao động") || lowerText.includes("sóng")) {
      subjectKey = "vatly";
    }

    if (state.user.geminiApiKey) {
      // Call ACTUAL Gemini API
      startActualGeminiGeneration(state.user.geminiApiKey, promptText, subjectKey);
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
              <stop stop-color="#a78bfa" />
              <stop offset="1" stop-color="#8b5cf6" />
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
      const template = MOCK_EXAM_TEMPLATES[subjectKey];
      const examTitle = promptText.length > 40 
        ? `Đề thi tạo bởi AI: ${promptText.substring(0, 40)}...`
        : `Đề thi tạo bởi AI: ${promptText}`;

      const newExam = store.addExam({
        title: examTitle,
        subject: template.subject,
        questions: template.questions
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

async function callGeminiAPI(apiKey, promptText, config = {}) {
  const models = [
    { name: "gemini-flash-latest", version: "v1beta" },
    { name: "gemini-flash-latest", version: "v1" },
    { name: "gemini-2.5-flash", version: "v1beta" },
    { name: "gemini-2.5-flash", version: "v1" },
    { name: "gemini-2.0-flash", version: "v1beta" },
    { name: "gemini-2.0-flash", version: "v1" },
    { name: "gemini-3.5-flash", version: "v1beta" },
    { name: "gemini-3.5-flash", version: "v1" },
    { name: "gemini-1.5-flash", version: "v1beta" },
    { name: "gemini-1.5-flash", version: "v1" }
  ];

  let errors = [];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/${model.version}/models/${model.name}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{
          parts: [{ text: promptText }]
        }]
      };
      if (Object.keys(config).length > 0) {
        payload.generationConfig = config;
      }
      
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        return {
          ok: true,
          data: data,
          modelUsed: `${model.version}/${model.name}`
        };
      } else {
        const errJson = await res.json().catch(() => ({}));
        const msg = errJson.error?.message || `HTTP ${res.status}`;
        errors.push(`${model.name} (${model.version}) thất bại: ${msg}`);
      }
    } catch (err) {
      errors.push(`${model.name} (${model.version}) lỗi kết nối: ${err.message}`);
    }
  }

  // Diagnostic ListModels check
  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await fetch(listUrl);
    if (listRes.ok) {
      const listData = await listRes.json();
      const availableModels = listData.models?.map(m => m.name.replace("models/", "")).join(", ") || "None";
      const errorDetails = errors.join("; ");
      throw new Error(`Tất cả các mô hình thử nghiệm đều thất bại. Các mô hình khả dụng cho API Key của bạn là: ${availableModels}. Chi tiết lỗi thử nghiệm: ${errorDetails}`);
    } else {
      const errJson = await listRes.json().catch(() => ({}));
      const msg = errJson.error?.message || `HTTP ${listRes.status}`;
      throw new Error(`Dự án của bạn chưa được cấp phép hoặc API Key bị hạn chế: ${msg}. Chi tiết lỗi thử nghiệm: ${errors.join("; ")}`);
    }
  } catch (diagErr) {
    throw new Error(`Lỗi kết nối hoặc chẩn đoán thất bại: ${diagErr.message}. Chi tiết lỗi thử nghiệm: ${errors.join("; ")}`);
  }
}

function startActualGeminiGeneration(apiKey, promptText, subjectKey) {
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
              <stop stop-color="#a78bfa" />
              <stop offset="1" stop-color="#8b5cf6" />
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
  const finalPrompt = `Bạn là một chuyên gia khảo thí giáo dục hàng đầu. Hãy soạn một bộ đề thi trắc nghiệm chi tiết dựa trên nội dung/yêu cầu sau từ người dùng: "${promptText}".
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
Hãy viết toàn bộ câu hỏi và phương án, lời giải bằng Tiếng Việt.`;

  // Start API request
  progressFill.style.width = "40%";
  stepText.innerText = "Gemini AI đang tư duy và tạo các câu hỏi trắc nghiệm...";

  callGeminiAPI(apiKey, finalPrompt, { 
    responseMimeType: "application/json",
    temperature: 0.2 
  })
  .then(result => {
    progressFill.style.width = "75%";
    stepText.innerText = "Đang nhận dữ liệu và phân tích cấu trúc đề thi...";

    const textResponse = result.data.candidates[0].content.parts[0].text;
    
    // Clean potential markdown blocks
    let cleanJson = textResponse.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
    }

    const questions = JSON.parse(cleanJson);

    progressFill.style.width = "95%";
    stepText.innerText = "Đang lưu đề thi vào Thư viện của bạn...";

    // Determine subject name
    const subjectName = subjectKey === "toan" ? "Toán" : subjectKey === "tienganh" ? "Tiếng Anh" : subjectKey === "vatly" ? "Vật lý" : "Tổng hợp";
    const examTitle = promptText.length > 50 ? `Đề thi AI: ${promptText.substring(0, 50)}...` : `Đề thi AI: ${promptText}`;

    const newExam = store.addExam({
      title: examTitle,
      subject: subjectName,
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
  currentExamDetailId = examId;
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
// 3. RENDER EXAMS VIEW
// --------------------------------------------------------------------------
export function renderExams(container) {
  const state = store.getState();

  // If a specific exam detail is active, render that instead
  if (currentExamDetailId) {
    const exam = state.exams.find(e => e.id === currentExamDetailId);
    if (exam) {
      if (quizState && quizState.examId === currentExamDetailId) {
        renderQuizMode(container, exam);
      } else {
        renderExamDetail(container, exam);
      }
      return;
    } else {
      currentExamDetailId = null; // Clear if not found
    }
  }

  // Otherwise, render list of exams
  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Danh sách đề thi</h1>
        <p class="view-subtitle" style="color: var(--text-muted);">Quản lý cấu trúc đề thi, lời giải chi tiết và chia sẻ bài thi trên MyaQuiz.</p>
      </div>
    </div>

    <div class="library-grid" id="examsListGrid">
      <!-- Loaded dynamically -->
    </div>
  `;

  const grid = document.getElementById("examsListGrid");
  
  if (state.exams.length === 0) {
    grid.innerHTML = `
      <div class="empty-state-box" style="grid-column: 1 / -1; padding: 60px 20px;">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <h3 class="empty-state-title">Chưa có đề thi nào</h3>
        <p class="empty-state-subtitle">Bắt đầu soạn đề tại Trang chủ bằng công cụ soạn đề AI.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = state.exams.map(e => `
    <div class="exam-library-card" data-exam-id="${e.id}">
      <div class="exam-card-main">
        <div class="exam-card-meta-row">
          <span class="exam-card-subject-tag">${e.subject}</span>
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
  `).join('');

  // Click handler to select exam
  grid.querySelectorAll(".exam-library-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-delete-exam")) return;
      const examId = card.getAttribute("data-exam-id");
      currentExamDetailId = examId;
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
        window.refreshActiveView();
      }
    });
  });
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
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title" style="font-size: 1.5rem; line-height: 1.3;">${exam.title}</h1>
        <p class="view-subtitle" style="color: var(--text-muted);">Môn học: <strong>${exam.subject}</strong> • Tạo ngày: ${formatDate(exam.created)}</p>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-primary" id="btnStartExamQuiz">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span>Thi thử</span>
        </button>
        <button class="btn btn-secondary" id="btnPrintExam" title="In đề thi">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          <span>In đề</span>
        </button>
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
                const isCorrect = oIdx === q.answer;
                return `
                  <li style="display: flex; gap: 8px; font-size: 0.95rem;">
                    <strong>${letter}.</strong>
                    <span>${opt}</span>
                    ${isCorrect ? `<span style="color: #10b981; font-weight: 700; margin-left: 10px; font-size: 0.85rem;">(Đáp án đúng)</span>` : ''}
                  </li>
                `;
              }).join('')}
            </ul>

            <button class="btn btn-secondary btn-sm btn-toggle-explanation" style="align-self: flex-start; margin-top: 10px;">Hiện lời giải chi tiết</button>
            <div class="question-explanation" style="display: none; margin-top: 10px;">
              <div class="explanation-title">Giải thích từ AI:</div>
              <p>${q.explanation || "Không có giải thích cho câu hỏi này."}</p>
            </div>
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
    currentExamDetailId = null;
    window.refreshActiveView();
  });

  // Toggle Answers Explanation
  container.querySelectorAll(".btn-toggle-explanation").forEach(btn => {
    btn.addEventListener("click", () => {
      const expDiv = btn.nextElementSibling;
      if (expDiv.style.display === "none") {
        expDiv.style.display = "block";
        btn.innerText = "Ẩn lời giải chi tiết";
      } else {
        expDiv.style.display = "none";
        btn.innerText = "Hiện lời giải chi tiết";
      }
    });
  });

  // Delete Exam
  document.getElementById("btnDeleteExamDetail").addEventListener("click", () => {
    if (confirm("Xóa vĩnh viễn đề thi này?")) {
      store.removeExam(exam.id);
      currentExamDetailId = null;
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

  // Print Exam trigger
  document.getElementById("btnPrintExam").addEventListener("click", () => {
    window.print();
  });

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
  
  let correctCount = 0;
  exam.questions.forEach((q, idx) => {
    const userAnswer = quizState.answers[idx];
    const correctIdx = q.answer;
    
    const card = document.getElementById(`quizQuestionCard_${idx}`);
    const explanation = document.getElementById(`quizExplanation_${idx}`);
    
    if (explanation) explanation.style.display = "block";
    
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
export function renderQBank(container) {
  const state = store.getState();

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Ngân hàng câu hỏi</h1>
        <p class="view-subtitle" style="color: var(--text-muted);">Kho lưu trữ câu hỏi cá nhân giúp bạn chủ động thiết kế hoặc trộn đề nhanh chóng.</p>
      </div>
    </div>

    <!-- Grid: Add form & list -->
    <div class="exam-detail-layout">
      <!-- Left side: Questions List -->
      <div class="exam-questions-panel">
        <h2 style="font-family: var(--font-headings); font-size: 1.15rem;">Danh sách câu hỏi hiện tại (${state.qbank.length} câu)</h2>
        
        <div id="qbankQuestionsList" style="display: flex; flex-direction: column; gap: 16px;">
          ${state.qbank.map((q, idx) => `
            <div class="question-item-card card">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="suggested-tag" style="background-color: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 4px; font-size: 0.65rem;">Môn: ${q.subject}</span>
                <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">#${idx + 1}</span>
              </div>
              <p class="question-text" style="font-size: 1rem; margin-top: 6px;">${q.text}</p>
              
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px; padding-left: 8px;">
                ${q.options.map((opt, oIdx) => `
                  <li style="font-size: 0.9rem; ${oIdx === q.answer ? 'color: #10b981; font-weight: 600;' : ''}">
                    <strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}
                    ${oIdx === q.answer ? '✓' : ''}
                  </li>
                `).join('')}
              </ul>
              
              ${q.explanation ? `
                <div class="question-explanation" style="font-size: 0.8rem; padding: 10px 14px; margin-top: 4px;">
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
    window.refreshActiveView();
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
            <input type="password" id="settingGeminiApiKey" value="${state.user.geminiApiKey || ''}" placeholder="Nhập API Key lấy từ Google AI Studio..." style="flex: 1;" />
            <button class="btn btn-secondary" id="btnTestGeminiKey" style="white-space: nowrap; padding: 10px 14px;">Kiểm tra kết nối</button>
          </div>
          <p class="form-hint">Dùng để tạo đề trắc nghiệm thật không giới hạn. Nhận Key miễn phí tại <a href="https://aistudio.google.com/" target="_blank" style="color: hsl(var(--primary)); font-weight:600; text-decoration: underline;">Google AI Studio</a>.</p>
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
        
        <div class="theme-toggle-row">
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 600;">Giao diện Tối (Dark Mode)</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Chuyển đổi giao diện sang tông màu tối giúp bảo vệ mắt vào ban đêm.</p>
          </div>
          <label class="switch">
            <input type="checkbox" id="settingThemeSwitch" ${state.user.theme === "dark" ? "checked" : ""}>
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Section 4: Gói cước tài khoản -->
      <div class="settings-section-card card">
        <h2 class="settings-section-title">Gói tài khoản sử dụng</h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">Bạn đang sử dụng gói tài khoản <strong id="settingsActivePlan">${state.user.plan}</strong>.</p>
        
        <div class="pricing-cards-container">
          <div class="plan-card-option ${state.user.plan === 'Free' ? 'active' : ''}" data-plan-name="Free">
            <span class="plan-option-name">Gói miễn phí (Free)</span>
            <span class="plan-option-price">0 đ<span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">/ tháng</span></span>
            <ul class="plan-option-features">
              <li>✓ Tạo đề mẫu thông minh</li>
              <li>✓ Kho câu hỏi tối đa 50 câu</li>
              <li>✗ Không tích hợp API Gemini riêng</li>
            </ul>
          </div>
          
          <div class="plan-card-option ${state.user.plan === 'Pro' ? 'active' : ''}" data-plan-name="Pro">
            <span class="plan-option-name">Gói chuyên nghiệp (Pro)</span>
            <span class="plan-option-price">199.000 đ<span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">/ tháng</span></span>
            <ul class="plan-option-features">
              <li>✓ Sử dụng API Key riêng của bạn</li>
              <li>✓ Tạo đề thi không giới hạn</li>
              <li>✓ Hỗ trợ xuất file PDF chất lượng cao</li>
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
    
    store.updateUser({ name });
    alert("Đã cập nhật hồ sơ cá nhân!");
    window.refreshUserProfileWidget();
    
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
      const result = await callGeminiAPI(key, "Hello");
      btnTestGemini.innerText = "Kiểm tra kết nối";
      btnTestGemini.disabled = false;
      geminiTestResult.style.display = "block";
      geminiTestResult.style.backgroundColor = "#dcfce7";
      geminiTestResult.style.color = "#166534";
      geminiTestResult.innerText = `✓ Kết nối thành công! API Key hoạt động hoàn hảo bằng mô hình: ${result.modelUsed}.`;
    } catch (err) {
      btnTestGemini.innerText = "Kiểm tra kết nối";
      btnTestGemini.disabled = false;
      geminiTestResult.style.display = "block";
      geminiTestResult.style.backgroundColor = "#fee2e2";
      geminiTestResult.style.color = "#991b1b";
      geminiTestResult.innerHTML = `✗ Lỗi kết nối Google API! Chi tiết: <strong>${err.message}</strong>.<br><small>Mẹo: Hãy đảm bảo bạn đã kích hoạt 'Generative Language API' hoặc tạo khóa API tự động kích hoạt dự án mới từ Google AI Studio.</small>`;
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

  // Attach Dark mode toggle
  const themeSwitch = document.getElementById("settingThemeSwitch");
  themeSwitch.addEventListener("change", () => {
    const isDark = themeSwitch.checked;
    const theme = isDark ? "dark" : "light";
    
    store.updateUser({ theme });
    
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  });

  // Attach Plan change
  container.querySelectorAll(".plan-card-option").forEach(card => {
    card.addEventListener("click", () => {
      const planName = card.getAttribute("data-plan-name");
      store.updateUser({ plan: planName });
      
      container.querySelectorAll(".plan-card-option").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      
      document.getElementById("settingsActivePlan").innerText = planName;
      window.refreshUserProfileWidget();
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
