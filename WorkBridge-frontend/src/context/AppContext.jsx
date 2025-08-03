import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const allFreelancers = [
    {
      id: "687f9f1dd7a18062d4b78585",
      name: "Brad Pitt",
      title: "Landing page design",
      experience: 5,
      type: "project work",
      reviews: [
        { user: "Alex", rating: 5, comment: "Very responsive and talented!" },
        { user: "Maria", rating: 4, comment: "Clean design and on time." },
        { user: "John", rating: 5, comment: "Understood my needs perfectly." },
        { user: "Nina", rating: 4, comment: "Great to work with overall." },
      ],
      avatar:
        "https://cdn.britannica.com/61/137461-050-BB6C5D80/Brad-Pitt-2008.jpg",
      skills: [
        "wireframes",
        "spline",
        "figma",
        "illustration",
        "adobe photoshop",
      ],
      services: [
        {
          name: "UX Website Design",
          category: "design",
          price: 5000,
          revisions: 3,
          deadline: "5 days",
          description:
            "I design user-first web interfaces that prioritize clarity, visual balance, and conversion-oriented flows.",
        },
        {
          name: "Brand Identity Kit",
          category: "branding",
          price: 3500,
          revisions: 2,
          deadline: "3 days",
          description:
            "I create sleek, consistent brand systems that tell your story visually and build trust across platforms.",
        },
        {
          name: "Responsive Web Design",
          category: "web design",
          price: 6000,
          revisions: 4,
          deadline: "6 days",
          description:
            "I design responsive web layouts that adapt beautifully to screens of all sizes and devices with consistency.",
        },
      ],
      works: [
        "https://img.freepik.com/premium-vector/style-design-vector-typography-print-perfect-t-shirts-design-clothing-hoodies-etc_448004-668.jpg?semt=ais_hybrid&w=740",
        "https://img.freepik.com/premium-vector/summer-beach-logo_215413-77.jpg",
        "https://img.freepik.com/free-vector/cartoon-web-design-landing-page_52683-70880.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiQVf74oyC72uF5VjGv2wVFSKl9fZDJsY-6w&s",
      ],
    },
    {
      id: 2,
      name: "Alice Murphy",
      title: "Animated landing page design",
      experience: 4,
      type: "part-time",
      reviews: [
        {
          user: "Kevin",
          rating: 5,
          comment: "Animations were smooth and beautiful.",
        },
        {
          user: "Rachel",
          rating: 4,
          comment: "High-quality visuals and timely delivery.",
        },
        { user: "Sarah", rating: 5, comment: "Loved the branding elements!" },
        { user: "Mike", rating: 4, comment: "Very professional work." },
      ],
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      skills: [
        "adobe photoshop",
        "illustration",
        "adobe after effects",
        "indesign",
      ],
      services: [
        {
          name: "UI Animation Pack",
          category: "animation",
          price: 3000,
          revisions: 2,
          deadline: "5 days",
          description:
            "I animate UI elements and transitions to improve interaction, feedback, and engagement across screens.",
        },
        {
          name: "Visual Branding Pack",
          category: "branding",
          price: 4000,
          revisions: 3,
          deadline: "4 days",
          description:
            "I craft polished brand systems that are clean, professional, and made to stand out in any industry.",
        },
        {
          name: "Graphic Content Pack",
          category: "design",
          price: 3500,
          revisions: 2,
          deadline: "3 days",
          description:
            "I deliver versatile graphic content built for web, marketing, and product use with visual consistency.",
        },
      ],
      works: [
        "https://images.unsplash.com/photo-1612832021242-d41db902c4dd",
        "https://images.unsplash.com/photo-1623261271809-38b49d32a413",
        "https://images.unsplash.com/photo-1601987077094-8433a03f13b8",
        "https://images.unsplash.com/photo-1573497491208-6b1acb260507",
      ],
    },
    {
      id: 3,
      name: "Dianne Russell",
      title: "Landing page design",
      experience: 2,
      type: "project work",
      reviews: [
        { user: "Daniel", rating: 5, comment: "Exceptional UI/UX delivery." },
        {
          user: "Emma",
          rating: 4,
          comment: "Impressed with attention to detail.",
        },
        {
          user: "Leo",
          rating: 5,
          comment: "Great experience working with her.",
        },
      ],
      avatar: "https://randomuser.me/api/portraits/women/21.jpg",
      description:
        "Focused on enhancing user journeys through seamless UI/UX designs for web and mobile.",
      skills: ["html", "css", "javascript", "figma", "adobe xd"],
      services: [
        {
          name: "Modern UI Web Design",
          category: "design",
          price: 5000,
          revisions: 3,
          deadline: "4 days",
          description:
            "I create clean, functional interfaces that guide users effectively with balanced layouts and clarity.",
        },
        {
          name: "Mobile-First Web Design",
          category: "web design",
          price: 6000,
          revisions: 3,
          deadline: "5 days",
          description:
            "I design responsive mobile-first layouts optimized for loading speed and accessibility across devices.",
        },
        {
          name: "Interactive UI Kit",
          category: "frontend",
          price: 5500,
          revisions: 2,
          deadline: "6 days",
          description:
            "I build frontend elements and styles for reusable components with animations and clear interactions.",
        },
      ],
      works: [
        "https://images.unsplash.com/photo-1624413720885-77e7ec0c3ee9",
        "https://images.unsplash.com/photo-1559526324-593bc073d938",
        "https://images.unsplash.com/photo-1587614382346-acd977736f90",
        "https://images.unsplash.com/photo-1633113085065-b387ef6e8f3d",
      ],
    },
    {
      id: 4,
      name: "Jenny Wilson",
      title: "Landing page design",
      experience: 2,
      type: "project work",
      reviews: [
        {
          user: "Thomas",
          rating: 5,
          comment: "Amazing insights from research.",
        },
        { user: "Grace", rating: 4, comment: "Very thoughtful UX flows." },
        {
          user: "Olivia",
          rating: 4,
          comment: "Loved the minimalist logo design.",
        },
      ],
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      skills: ["wireframes", "user research", "figma", "prototyping"],
      services: [
        {
          name: "Research-Based UI Design",
          category: "design",
          price: 4500,
          revisions: 3,
          deadline: "5 days",
          description:
            "I design UI experiences driven by user research and tested layouts for maximum usability and appeal.",
        },
        {
          name: "Minimal Logo Design",
          category: "branding",
          price: 3000,
          revisions: 2,
          deadline: "3 days",
          description:
            "I deliver crisp, minimal logo designs that represent your brand with simplicity and strength.",
        },
        {
          name: "Print Collateral Graphics",
          category: "graphic design",
          price: 3500,
          revisions: 2,
          deadline: "4 days",
          description:
            "I create clean, effective print graphics including flyers, brochures, and posters that communicate clearly.",
        },
      ],
      works: [
        "https://images.unsplash.com/photo-1612831455543-77d102bdfb2c",
        "https://images.unsplash.com/photo-1600585154356-596af9009f17",
        "https://images.unsplash.com/photo-1627548621618-52e6c5fc4219",
        "https://images.unsplash.com/photo-1555431189-0fabf2959fc5",
      ],
    },
    {
      id: 5,
      name: "Daniel Kim",
      title: "MERN stack web app",
      experience: 3,
      type: "full-time",
      reviews: [
        { user: "Ethan", rating: 5, comment: "Super efficient backend API!" },
        {
          user: "Sophia",
          rating: 4,
          comment: "The web app exceeded expectations.",
        },
        {
          user: "Ryan",
          rating: 5,
          comment: "Clean code and great communication.",
        },
      ],
      avatar: "https://randomuser.me/api/portraits/men/17.jpg",
      skills: ["mongodb", "express", "react", "node.js", "typescript"],
      services: [
        {
          name: "MERN Web App",
          category: "programming",
          price: 8000,
          revisions: 2,
          deadline: "7 days",
          description:
            "I build fast and secure full-stack apps using MERN with authentication, APIs, and database logic.",
        },
        {
          name: "REST API Development",
          category: "backend",
          price: 7500,
          revisions: 2,
          deadline: "6 days",
          description:
            "I design REST APIs with secure endpoints, token-based auth, and easy client integration.",
        },
        {
          name: "Dynamic Web Dashboards",
          category: "web development",
          price: 8500,
          revisions: 3,
          deadline: "8 days",
          description:
            "I deliver fully functional dashboards with admin features, charts, and secure logins.",
        },
      ],
      works: [
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
        "https://images.unsplash.com/photo-1581090700227-1d9f0ff70d1b",
        "https://images.unsplash.com/photo-1611926653458-09294fc1a204",
        "https://images.unsplash.com/photo-1523473827532-56e9e0f4d94e",
      ],
    },
    {
      id: 6,
      name: "Sarah Lee",
      title: "React website design",
      experience: 2,
      type: "project work",
      reviews: [
        { user: "Liam", rating: 5, comment: "The animations were amazing!" },
        {
          user: "Maya",
          rating: 4,
          comment: "Great work on the React components.",
        },
        { user: "Chris", rating: 4, comment: "Responsive and quick delivery." },
      ],
      avatar: "https://randomuser.me/api/portraits/women/58.jpg",
      skills: [
        "react",
        "tailwind css",
        "framer motion",
        "next.js",
        "javascript",
      ],
      services: [
        {
          name: "Custom React Components",
          category: "programming",
          price: 6000,
          revisions: 3,
          deadline: "5 days",
          description:
            "I build dynamic, component-based UIs using React with props, hooks, and clean state management.",
        },
        {
          name: "Tailwind Layout Setup",
          category: "frontend",
          price: 5800,
          revisions: 2,
          deadline: "4 days",
          description:
            "I create responsive, utility-first layouts in Tailwind CSS that adapt and scale cleanly.",
        },
        {
          name: "Motion-Driven UI",
          category: "design",
          price: 6200,
          revisions: 2,
          deadline: "4 days",
          description:
            "I implement smooth animations and transitions using Framer Motion to enhance UI engagement.",
        },
      ],
      works: [
        "https://images.unsplash.com/photo-1633113214700-3ce7f7b06f2b",
        "https://images.unsplash.com/photo-1633113084032-c084e4eb50cb",
        "https://images.unsplash.com/photo-1611262588024-dc62c9184c1e",
        "https://images.unsplash.com/photo-1581093588401-62c178f4df1d",
      ],
    },
    {
      id: 7,
      name: "Ahmed Nasser",
      title: "YouTube video editing",
      experience: 4,
      type: "part-time",
      reviews: [
        { user: "Ava", rating: 5, comment: "Perfect cuts for YouTube." },
        { user: "Noah", rating: 4, comment: "Added energy to my videos!" },
        {
          user: "Chloe",
          rating: 4,
          comment: "Punctual and professional editor.",
        },
      ],
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      skills: [
        "adobe premiere pro",
        "final cut pro",
        "davinci resolve",
        "subtitles",
        "transitions",
      ],
      services: [
        {
          name: "YouTube Video Edit",
          category: "video editing",
          price: 3000,
          revisions: 2,
          deadline: "4 days",
          description:
            "I deliver sharp, paced edits tailored for YouTube with subtitles, pacing, and cuts for viewer retention.",
        },
        {
          name: "Animated Intros & Outros",
          category: "animation",
          price: 3500,
          revisions: 3,
          deadline: "5 days",
          description:
            "I add smooth intro/outro animations with motion graphics tailored to your channel’s tone.",
        },
        {
          name: "Social Content Cuts",
          category: "content creation",
          price: 3200,
          revisions: 2,
          deadline: "3 days",
          description:
            "I craft polished, vertical-first edits for Reels, Shorts, and TikToks that drive engagement fast.",
        },
      ],
      works: [
        "https://images.unsplash.com/photo-1612832021242-d41db902c4dd",
        "https://images.unsplash.com/photo-1573497491208-6b1acb260507",
        "https://images.unsplash.com/photo-1601987077094-8433a03f13b8",
        "https://images.unsplash.com/photo-1623261271809-38b49d32a413",
      ],
    },
    {
      id: 8,
      name: "Nina Patel",
      title: "Explainer video animation",
      experience: 3,
      type: "project work",
      reviews: [
        { user: "Isla", rating: 5, comment: "Incredible animation clarity!" },
        { user: "Zayn", rating: 4, comment: "Brand reveal was awesome." },
        {
          user: "Lucas",
          rating: 5,
          comment: "Helped boost our product pitch!",
        },
      ],
      avatar: "https://randomuser.me/api/portraits/women/50.jpg",
      skills: [
        "after effects",
        "illustrator",
        "storyboard",
        "2d animation",
        "explainer videos",
      ],
      services: [
        {
          name: "Animated Explainer Video",
          category: "animation",
          price: 4000,
          revisions: 3,
          deadline: "5 days",
          description:
            "I create voice-synced explainer videos with clean visuals and scripted clarity to sell your idea.",
        },
        {
          name: "Brand Reveal Animation",
          category: "branding",
          price: 3000,
          revisions: 2,
          deadline: "3 days",
          description:
            "I animate logos and brand assets into powerful, recognizable motion sequences.",
        },
        {
          name: "Motion Cut Edit",
          category: "video editing",
          price: 3500,
          revisions: 2,
          deadline: "4 days",
          description:
            "I blend motion graphics with edited video content to elevate presentation and storytelling.",
        },
      ],
      works: [
        "https://images.unsplash.com/photo-1603786843318-15d5ae1456d4",
        "https://images.unsplash.com/photo-1633113214092-540e7c74ff89",
        "https://images.unsplash.com/photo-1624413782770-fce2043c67f7",
        "https://images.unsplash.com/photo-1612178999896-1b2b9b7fc9e5",
      ],
    },
    {
      id: 9,
      name: "David Chen",
      title: "Social media marketing",
      experience: 5,
      type: "retainer",
      reviews: [
        { user: "Ella", rating: 5, comment: "Campaigns delivered great ROI." },
        { user: "Oscar", rating: 4, comment: "Knows the ad platforms well." },
        {
          user: "Mila",
          rating: 5,
          comment: "Strong grasp on marketing funnel.",
        },
      ],
      avatar: "https://randomuser.me/api/portraits/men/10.jpg",
      skills: [
        "instagram ads",
        "facebook ads",
        "analytics",
        "conversion tracking",
        "campaign strategy",
      ],
      services: [
        {
          name: "Social Ad Management",
          category: "marketing",
          price: 5000,
          revisions: 2,
          deadline: "5 days",
          description:
            "I manage paid ad funnels with optimized creative, targeting, and clear conversion metrics.",
        },
        {
          name: "Facebook/IG Campaign Setup",
          category: "ads",
          price: 4500,
          revisions: 2,
          deadline: "3 days",
          description:
            "I plan, structure, and launch effective ad sets on Meta platforms that scale results efficiently.",
        },
        {
          name: "Marketing Strategy Deck",
          category: "strategy",
          price: 5500,
          revisions: 3,
          deadline: "6 days",
          description:
            "I build full strategy decks with goals, audience targeting, and timelines to grow digital reach.",
        },
      ],
      works: [
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
        "https://images.unsplash.com/photo-1623261271809-38b49d32a413",
        "https://images.unsplash.com/photo-1612832021242-d41db902c4dd",
        "https://images.unsplash.com/photo-1623261271809-38b49d32a413",
      ],
    },
    {
      id: 10,
      name: "Emily Zhang",
      title: "On-page & off-page seo",
      experience: 3,
      type: "project work",
      reviews: [
        {
          user: "Leo",
          rating: 5,
          comment: "Organic traffic improved in 2 weeks!",
        },
        { user: "Aria", rating: 4, comment: "Insightful SEO audit." },
        { user: "Nathan", rating: 5, comment: "Reliable and transparent." },
      ],
      avatar: "https://randomuser.me/api/portraits/women/90.jpg",
      skills: [
        "seo",
        "keyword research",
        "google analytics",
        "backlinks",
        "content strategy",
      ],
      services: [
        {
          name: "SEO Campaign Plan",
          category: "marketing",
          price: 7000,
          revisions: 2,
          deadline: "7 days",
          description:
            "I design long-term SEO plans including content, backlinks, and analytics to grow rankings naturally.",
        },
        {
          name: "Full SEO Audit",
          category: "seo",
          price: 6800,
          revisions: 3,
          deadline: "6 days",
          description:
            "I provide detailed audits covering structure, tags, speed, and indexability for Google SEO readiness.",
        },
        {
          name: "Analytics & Insights Setup",
          category: "analytics",
          price: 6400,
          revisions: 2,
          deadline: "5 days",
          description:
            "I configure Google Analytics with reports that track real goals and help you improve site outcomes.",
        },
      ],
      works: [
        "https://images.unsplash.com/photo-1591696205602-2b6de8c4bd39",
        "https://images.unsplash.com/photo-1591696331117-3f2588c65194",
        "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7",
        "https://images.unsplash.com/photo-1559027615-38d88fb60583",
      ],
    },
  ];

  const freelancerUser = {
    id: 1,
    name: "Brad Pitt",
    title: "Landing page design",
    experience: 2,
    type: "project work",
    earnings: 7000,
    reviews: [
      { user: "Alex", rating: 5, comment: "Very responsive and talented!" },
      { user: "Maria", rating: 4, comment: "Clean design and on time." },
      { user: "John", rating: 5, comment: "Understood my needs perfectly." },
      { user: "Nina", rating: 4, comment: "Great to work with overall." },
    ],
    avatar:
      "https://cdn.britannica.com/61/137461-050-BB6C5D80/Brad-Pitt-2008.jpg",
    skills: [
      "wireframes",
      "spline",
      "figma",
      "illustration",
      "adobe photoshop",
    ],
    services: [
      {
        name: "UX Website Design",
        category: "design",
        price: 5000,
        revisions: 3,
        deadline: "5 days",
        description:
          "I design user-first web interfaces that prioritize clarity, visual balance, and conversion-oriented flows.",
      },
      {
        name: "Brand Identity Kit",
        category: "branding",
        price: 3500,
        revisions: 2,
        deadline: "3 days",
        description:
          "I create sleek, consistent brand systems that tell your story visually and build trust across platforms.",
      },
      {
        name: "Responsive Web Design",
        category: "web design",
        price: 6000,
        revisions: 4,
        deadline: "6 days",
        description:
          "I design responsive web layouts that adapt beautifully to screens of all sizes and devices with consistency.",
      },
    ],
    works: [
      "https://img.freepik.com/premium-vector/style-design-vector-typography-print-perfect-t-shirts-design-clothing-hoodies-etc_448004-668.jpg?semt=ais_hybrid&w=740",
      "https://img.freepik.com/premium-vector/summer-beach-logo_215413-77.jpg",
      "https://img.freepik.com/free-vector/cartoon-web-design-landing-page_52683-70880.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiQVf74oyC72uF5VjGv2wVFSKl9fZDJsY-6w&s",
    ],
  };

  const clientUser = {
    id: "client_101",
    name: "Sophia Anderson",
    email: "sophia.anderson@example.com",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
  };

  const projects = [
    {
      id: "cp101",
      title: "E-commerce Website UI",
      description: "Design a fully responsive e-commerce website interface.",
      status: "completed",
      type: "posted",
      category: "design",
      budget: 5000,
      createdAt: "2025-7-19T09:00:00Z",
      createdBy: {
        id: "client1",
        name: "Sophia Anderson",
        avatar: "https://randomuser.me/api/portraits/women/21.jpg",
      },
      interested: [
        {
          id: 1,
          name: "Ravi Kumar",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg",
          proposal:
            "I'm confident I can deliver this in 4 days with quality UI.",
          skills: ["React", "Figma", "Tailwind", "UX Design"],
          experience: "2 years",
        },
      ],
    },
    {
      id: "cp102",
      title: "Logo for Fintech Startup",
      description: "Modern logo with clean typography.",
      status: "active",
      type: "assigned",
      category: "branding",
      budget: 2500,
      createdAt: "2025-01-10T10:30:00Z",
      createdBy: {
        id: "client1",
        name: "Sophia Anderson",
        avatar: "https://randomuser.me/api/portraits/women/21.jpg",
      },
      assignedTo: {
        id: 1,
        name: "Brad Pitt",
        avatar:
          "https://cdn.britannica.com/61/137461-050-BB6C5D80/Brad-Pitt-2008.jpg",
      },
      acceptedAt: "2025-07-19T08:00:00Z",
      deadline: 3,
    },
    {
      id: "cp103",
      title: "Portfolio Website Concept",
      description: "Design concept for a personal portfolio brand.",
      status: "completed",
      type: "posted",
      category: "web",
      budget: 3500,
      createdAt: "2025-03-01T14:00:00Z",
      createdBy: {
        id: "client1",
        name: "Sophia Anderson",
        avatar: "https://randomuser.me/api/portraits/women/21.jpg",
      },
    },
  ];

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Try to fetch user from access token
  const fetchUser = async (accessToken) => {
    try {
      const res = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setUser(res.data.user);
    } catch (err) {
      console.error("Access token invalid or expired:", err.message);
      await tryRefreshToken();
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      console.log("Updated user:", user);
    }
  }, [user]);

  // Try to refresh token
  const tryRefreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return logout();

    try {
      const res = await API.post("/auth/refresh", { token: refreshToken });
      const newAccessToken = res.data.accessToken;

      localStorage.setItem("accessToken", newAccessToken);
      setToken(newAccessToken);
      await fetchUser(newAccessToken);
    } catch (err) {
      console.error("Refresh token expired or invalid:", err.message);
      logout();
    }
  };

  // On mount, try to fetch user
  useEffect(() => {
    const init = async () => {
      if (token) {
        await fetchUser(token);
      } else {
        setLoading(false); // ✅ handle missing token
      }
    };
    init();
  }, [token]);

  const login = async (form) => {
    const res = await API.post("/auth/login", form);
    const { accessToken, refreshToken, user, freelancer } = res.data;

    const loggedInUser = user || freelancer;
    if (!loggedInUser) throw new Error("No user returned from login");

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setToken(accessToken);
    setUser(loggedInUser);
    console.log(user);

    if (loggedInUser.role === "freelancer") {
      if (loggedInUser.profileCompleted) {
        navigate("/freelancer/dashboard");
      } else {
        navigate("/freelancer/complete-profile");
      }
    } else {
      navigate("/");
    }
  };

  const register = async (form) => {
    const { role, ...data } = form;
    const endpoint =
      role === "freelancer"
        ? "/auth/register-freelancer"
        : "/auth/register-user";

    const res = await API.post(endpoint, data);
    const { accessToken, refreshToken, user } = res.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setToken(accessToken);
    setUser(user);

    if (user.role === "freelancer") {
      navigate("/freelancer/complete-profile");
    } else {
      navigate("/");
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await API.post("/auth/logout", { token: refreshToken });
      }
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setToken(null);
      navigate("/auth");
    }
  };

  const getFreelancerRating = (id) => {
    const freelancer = allFreelancers.find((f) => f.id === id);
    if (!freelancer || !freelancer.reviews || freelancer.reviews.length === 0)
      return 0;

    const total = freelancer.reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / freelancer.reviews.length).toFixed(1);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        register,
        logout,
        isAuthenticated,
        loading,
        allFreelancers,
        getFreelancerRating,
        freelancerUser,
        clientUser,
        projects,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
