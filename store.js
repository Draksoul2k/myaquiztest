// Key for localStorage
const STORAGE_KEY = "myaquiz_state_v1";

// Initial seed data for the application
const DEFAULT_STATE = {
  isLoggedIn: false,
  user: {
    name: "Thìn Nguyễn",
    email: "dalk2000vtp@gmail.com",
    plan: "Trial",
    theme: "light",
    geminiApiKey: "",
    googleClientId: "591954709167-dgup0n03seg81grv7ht3t4o5m9osgd0u.apps.googleusercontent.com",
    avatarUrl: "",
    createdAt: "",
    proExpiredAt: "",
    role: "teacher"
  },
  // Registered users for email/password auth simulation
  users: [
    { email: "dalk2000vtp@gmail.com", password: "123", name: "Thìn Nguyễn", plan: "Trial", createdAt: "", proExpiredAt: "", role: "teacher" }
  ],
  classes: [
    { id: "c1", name: "Lớp 12A1 - Toán Giải Tích", subject: "Toán", desc: "Lớp ôn thi THPT Quốc Gia" },
    { id: "c2", name: "Lớp 11B2 - Tiếng Anh", subject: "Tiếng Anh", desc: "Luyện thi IELTS & Ngữ pháp nâng cao" }
  ],
  workspaces: [
    { id: "w1", name: "Đề thi khảo sát đầu năm" },
    { id: "w2", name: "Bài tập về nhà tuần 1-5" }
  ],
  qbank: [
    {
      id: "q1",
      subject: "Toán",
      text: "Cho hàm số y = f(x) có bảng biến thiên như sau. Tìm số nghiệm thực của phương trình 2f(x) - 3 = 0.",
      options: ["0", "1", "2", "3"],
      answer: 3,
      explanation: "Phương trình 2f(x) - 3 = 0 tương đương f(x) = 1.5. Dựa vào bảng biến thiên, đường thẳng nằm ngang y = 1.5 cắt đồ thị hàm số y = f(x) tại 3 điểm phân biệt."
    },
    {
      id: "q2",
      subject: "Tiếng Anh",
      text: "Choose the correct word to complete the sentence: 'She ___ to school every day.'",
      options: ["go", "goes", "going", "gone"],
      answer: 1,
      explanation: "Thì hiện tại đơn với chủ ngữ ngôi thứ ba số ít 'She' yêu cầu động từ thêm -s/es. Động từ 'go' chuyển thành 'goes'."
    },
    {
      id: "q3",
      subject: "Vật lý",
      text: "Công thức liên hệ giữa chu kỳ T và tần số góc ω của dao động điều hòa là:",
      options: ["T = 2πω", "T = ω / (2π)", "T = 2π / ω", "T = 1 / ω"],
      answer: 2,
      explanation: "Chu kỳ T và tần số góc ω liên hệ qua công thức T = 2π/ω, đại diện cho thời gian vật thực hiện một dao động toàn phần."
    }
  ],
  exams: [
    {
      id: "e1",
      title: "Đề thi thử THPT Quốc gia môn Toán - Khảo sát chất lượng",
      subject: "Toán",
      created: "2026-06-23T10:00:00.000Z",
      questionsCount: 4,
      author: "MyaQuiz AI",
      workspaceId: "w1",
      questions: [
        {
          id: "eq1_1",
          text: "Cho hàm số y = f(x) có bảng biến thiên như sau. Tìm số nghiệm thực của phương trình 2f(x) - 3 = 0.",
          options: ["0", "1", "2", "3"],
          answer: 3,
          explanation: "Phương trình f(x) = 1.5 cắt đồ thị hàm số tại 3 điểm phân biệt."
        },
        {
          id: "eq1_2",
          text: "Trong không gian Oxyz, mặt cầu (S): (x-1)^2 + (y+2)^2 + z^2 = 9 có bán kính bằng:",
          options: ["3", "9", "6", "81"],
          answer: 0,
          explanation: "Phương trình mặt cầu có dạng (x-a)^2 + (y-b)^2 + (z-c)^2 = R^2. Ở đây R^2 = 9 nên R = 3."
        },
        {
          id: "eq1_3",
          text: "Hàm số nào dưới đây đồng biến trên khoảng (-∞; +∞)?",
          options: ["y = x^3 - 3x", "y = x^4 + 2x^2", "y = x^3 + x", "y = (x-1)/(x+2)"],
          answer: 2,
          explanation: "Hàm số y = x^3 + x có đạo hàm y' = 3x^2 + 1 > 0 với mọi x thuộc R. Do đó hàm số đồng biến trên toàn bộ R."
        },
        {
          id: "eq1_4",
          text: "Nếu ∫(0 to 2) f(x) dx = 4 thì ∫(0 to 2) 3f(x) dx bằng:",
          options: ["12", "7", "4/3", "1"],
          answer: 0,
          explanation: "Áp dụng tính chất tích phân: ∫ k f(x) dx = k ∫ f(x) dx. Ta có 3 * 4 = 12."
        }
      ]
    },
    {
      id: "e2",
      title: "Đề kiểm tra 15 phút Tiếng Anh - Unit 1: Generation Gap",
      subject: "Tiếng Anh",
      created: "2026-06-24T08:30:00.000Z",
      questionsCount: 3,
      author: "MyaQuiz AI",
      workspaceId: "w2",
      questions: [
        {
          id: "eq2_1",
          text: "Complete the sentence: 'She ___ to school every day.'",
          options: ["go", "goes", "going", "gone"],
          answer: 1,
          explanation: "Chủ ngữ số ít 'She' trong thì hiện tại đơn đi với động từ thêm -s/es: 'goes'."
        },
        {
          id: "eq2_2",
          text: "Parents should listen to their children's opinions, ___ they?",
          options: ["shouldn't", "don't", "should", "aren't"],
          answer: 0,
          explanation: "Câu hỏi đuôi cho mệnh đề khẳng định dùng động từ khuyết thiếu 'should' là 'shouldn't'."
        },
        {
          id: "eq2_3",
          text: "There is often a generation gap in families where three generations live ___.",
          options: ["together", "apart", "lonely", "socially"],
          answer: 0,
          explanation: "Mâu thuẫn thế hệ thường xảy ra trong các gia đình có 3 thế hệ sống cùng nhau ('live together')."
        }
      ]
    }
  ]
};

// Get current state
export function getState() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    saveState(DEFAULT_STATE);
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
  const state = JSON.parse(data);
  // Auto-sync googleClientId from DEFAULT_STATE if empty in active state
  if (DEFAULT_STATE.user.googleClientId && !state.user.googleClientId) {
    state.user.googleClientId = DEFAULT_STATE.user.googleClientId;
    saveState(state);
  }

  // Temporary shared Gemini API key for all users during trial (until July 1st, 2026)
  if (state.user && !state.user.geminiApiKey) {
    state.user.geminiApiKey = atob("QVEuQWI4Uk42TGlIU3lKTkJTQXVxSVJEdUd5cXUyX1k3cDRUcXlwUVNkSTR4WlhIVmZ3dGc=");
    saveState(state);
  }

  // Role migration for existing state
  if (state.user && !state.user.role) {
    state.user.role = "teacher";
    saveState(state);
  }
  return state;
}

// Save state
export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Authentication Helpers
export function login(email, password, role) {
  const state = getState();
  const matchedUser = state.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
  if (matchedUser) {
    state.isLoggedIn = true;
    const nowStr = new Date().toISOString();
    if (role) {
      matchedUser.role = role;
    }
    if (!matchedUser.createdAt) {
      matchedUser.createdAt = nowStr;
    }
    state.user = {
      ...state.user,
      name: matchedUser.name,
      email: matchedUser.email,
      plan: matchedUser.plan || "Trial",
      theme: state.user.theme || "light",
      createdAt: matchedUser.createdAt,
      proExpiredAt: matchedUser.proExpiredAt || "",
      role: matchedUser.role || "teacher"
    };
    saveState(state);
    return true;
  }
  return false;
}

export function loginGoogle(email, name, avatarUrl, role) {
  const state = getState();
  state.isLoggedIn = true;
  
  const nowStr = new Date().toISOString();
  const userInList = state.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!userInList) {
    const newUser = {
      email: email,
      name: name,
      plan: "Trial",
      password: "google_account", // mock
      avatarUrl: avatarUrl || "",
      createdAt: nowStr,
      proExpiredAt: "",
      role: role || "teacher"
    };
    state.users.push(newUser);
    state.user = {
      ...state.user,
      ...newUser
    };
  } else {
    if (role) {
      userInList.role = role;
    }
    state.user = {
      ...state.user,
      name: name,
      email: email,
      avatarUrl: avatarUrl || userInList.avatarUrl || "",
      plan: userInList.plan || "Trial",
      createdAt: userInList.createdAt || nowStr,
      proExpiredAt: userInList.proExpiredAt || "",
      role: userInList.role || "teacher"
    };
    if (!userInList.createdAt) {
      userInList.createdAt = state.user.createdAt;
    }
  }

  saveState(state);
  return state.user;
}

export function register(name, email, password, role) {
  const state = getState();
  const exists = state.users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (exists) {
    return false; // Email already registered
  }

  const nowStr = new Date().toISOString();
  const newUser = { 
    name, 
    email, 
    password, 
    plan: "Trial", 
    createdAt: nowStr, 
    proExpiredAt: "",
    role: role || "teacher"
  };
  state.users.push(newUser);

  state.isLoggedIn = true;
  state.user = {
    ...state.user,
    name: newUser.name,
    email: newUser.email,
    plan: newUser.plan,
    theme: state.user.theme || "light",
    createdAt: nowStr,
    proExpiredAt: "",
    role: newUser.role
  };

  saveState(state);
  return true;
}

export function logout() {
  const state = getState();
  state.isLoggedIn = false;
  saveState(state);
}

// Update User Profile
export function updateUser(userData) {
  const state = getState();
  state.user = { ...state.user, ...userData };
  
  const userIdx = state.users.findIndex(u => u.email.toLowerCase() === state.user.email.toLowerCase());
  if (userIdx !== -1) {
    state.users[userIdx] = {
      ...state.users[userIdx],
      name: state.user.name,
      plan: state.user.plan,
      createdAt: state.user.createdAt,
      proExpiredAt: state.user.proExpiredAt,
      role: state.user.role,
      avatarUrl: state.user.avatarUrl || state.users[userIdx].avatarUrl || ""
    };
  }

  saveState(state);
  return state.user;
}

// Add Class
export function addClass(className, subject, desc) {
  const state = getState();
  const newClass = {
    id: "c_" + Date.now(),
    name: className,
    subject: subject || "Chưa phân loại",
    desc: desc || ""
  };
  state.classes.push(newClass);
  saveState(state);
  return newClass;
}

// Remove Class
export function removeClass(classId) {
  const state = getState();
  state.classes = state.classes.filter(c => c.id !== classId);
  saveState(state);
}

// Add Workspace
export function addWorkspace(name) {
  const state = getState();
  const newWs = {
    id: "w_" + Date.now(),
    name: name
  };
  state.workspaces.push(newWs);
  saveState(state);
  return newWs;
}

// Remove Workspace
export function removeWorkspace(wsId) {
  const state = getState();
  state.workspaces = state.workspaces.filter(w => w.id !== wsId);
  // Unassign exams that belonged to this workspace
  state.exams.forEach(e => {
    if (e.workspaceId === wsId) e.workspaceId = "";
  });
  saveState(state);
}

// Add Question to Question Bank
export function addQuestion(question) {
  const state = getState();
  const newQ = {
    id: "q_" + Date.now(),
    subject: question.subject || "Tổng hợp",
    text: question.text,
    options: question.options,
    answer: parseInt(question.answer, 10),
    explanation: question.explanation || ""
  };
  state.qbank.push(newQ);
  saveState(state);
  return newQ;
}

// Add generated exam
export function addExam(exam) {
  const state = getState();
  const newExam = {
    id: "e_" + Date.now(),
    title: exam.title,
    subject: exam.subject,
    grade: exam.grade || null,
    duration: exam.duration || 15,
    difficulty: exam.difficulty || "Trung bình",
    examType: exam.examType || "Đề kiểm tra",
    created: new Date().toISOString(),
    questionsCount: exam.questions.length,
    author: state.user.name,
    workspaceId: exam.workspaceId || "",
    questions: exam.questions.map((q, idx) => ({
      id: `eq_${Date.now()}_${idx}`,
      text: q.text,
      options: q.options,
      answer: parseInt(q.answer, 10),
      explanation: q.explanation || ""
    }))
  };
  state.exams.push(newExam);
  saveState(state);
  return newExam;
}

// Remove exam
export function removeExam(examId) {
  const state = getState();
  state.exams = state.exams.filter(e => e.id !== examId);
  saveState(state);
}

// Get subscription plan details (calculates trial/Pro remaining time)
export function getSubscriptionStatus() {
  const state = getState();
  const user = state.user;
  
  if (!user.createdAt) {
    // Fallback if not initialized
    const nowStr = new Date().toISOString();
    user.createdAt = nowStr;
    state.user.createdAt = nowStr;
    saveState(state);
  }
  
  const createdTime = new Date(user.createdAt).getTime();
  const trialExpiredTime = createdTime + 7 * 24 * 60 * 60 * 1000; // 7 days in ms
  const now = Date.now();
  
  // 1. Check if user is Pro
  if (user.plan === "Pro") {
    const proExpiredTime = user.proExpiredAt ? new Date(user.proExpiredAt).getTime() : 0;
    if (now < proExpiredTime) {
      const daysRemaining = Math.max(0, Math.ceil((proExpiredTime - now) / (24 * 60 * 60 * 1000)));
      return { plan: "Pro", status: "active", daysRemaining, expiresAt: user.proExpiredAt };
    } else {
      // Pro expired -> Revert to Free
      return { plan: "Free", status: "pro_expired", daysRemaining: 0, expiresAt: user.proExpiredAt };
    }
  }
  
  // 2. Check if user is still in Trial
  if (now < trialExpiredTime) {
    const daysRemaining = Math.max(0, Math.ceil((trialExpiredTime - now) / (24 * 60 * 60 * 1000)));
    return { plan: "Trial", status: "active", daysRemaining, expiresAt: new Date(trialExpiredTime).toISOString() };
  }
  
  // 3. Otherwise, Trial has expired -> Free
  return { plan: "Free", status: "trial_expired", daysRemaining: 0, expiresAt: new Date(trialExpiredTime).toISOString() };
}

// Upgrade user to Pro (simulated checkout success handler)
export function upgradeToPro(months = 1) {
  const state = getState();
  const now = Date.now();
  const proExpiration = now + months * 30 * 24 * 60 * 60 * 1000; // 30 days in ms
  
  state.user.plan = "Pro";
  state.user.proExpiredAt = new Date(proExpiration).toISOString();
  
  // Update in simulated users list
  const userIdx = state.users.findIndex(u => u.email.toLowerCase() === state.user.email.toLowerCase());
  if (userIdx !== -1) {
    state.users[userIdx].plan = "Pro";
    state.users[userIdx].proExpiredAt = state.user.proExpiredAt;
  }
  
  saveState(state);
  return getSubscriptionStatus();
}
