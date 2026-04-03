export const getDashboardNav = () => [
  {
    category: "Dashboard",
    items: [{ label: "Home", path: "/readiness", icon: "🏠" }]
  },
  {
    category: "Assessments",
    items: [
      { label: "Exam Readiness", path: "/exam-readiness", icon: "📝" },
      { label: "Placement Readiness", path: "/placement-readiness", icon: "💼" }
    ]
  },
  {
    category: "Analytics",
    items: [
      { label: "My Results", path: "/my-results", icon: "📊" },
      { label: "Progress Analytics", path: "/progress-analytics", icon: "📈" }
    ]
  },
  {
    category: "Student",
    items: [{ label: "Profile", path: "/student-profile", icon: "👤" }]
  },
  {
    category: "Support",
    items: [
      { label: "Resources", path: "/resources", icon: "📚" },
      { label: "Contact", path: "/contact", icon: "✉️" }
    ]
  }
];

export const getAdminNav = () => [
  {
    category: "Admin Menu",
    items: [
      { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
      { label: "Students", path: "/admin/students", icon: "👥" },
      { label: "Exam Results", path: "/admin/exam", icon: "📝" },
      { label: "Placement Results", path: "/admin/placement", icon: "💼" },
      { label: "Messages", path: "/admin/contact", icon: "💬" }
    ]
  }
];
