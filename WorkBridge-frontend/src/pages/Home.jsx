import React from "react";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import FilterSidebar from "../components/FilterSidebar";
import FreelancerCard from "../components/FreelancerCard";

const allFreelancers = [
  {
    id: 1,
    name: "Jason Holls",
    work: "ux/ui designer",
    title: "Landing page design",
    price: 5000,
    experience: 2,
    type: "project work",
    rating: 4.9,
    reviews: 21,
    description:
      "I’m creating high-quality landing page quickly and professionally. I’ll be happy to help you with your project.",
    category: "design",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    skills: [
      "wireframes",
      "spline",
      "figma",
      "illustration",
      "adobe photoshop",
    ],
  },
  {
    id: 2,
    name: "Alice Murphy",
    work: "graphic designer",
    title: "Animated landing page design",
    price: 3000,
    experience: 4,
    type: "part-time",
    rating: 4.8,
    reviews: 67,
    description:
      "As a freelance graphic designer, I offer everything from logo design and brand identity to marketing materials like flyers.",
    category: "Animation",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    skills: [
      "adobe photoshop",
      "illustration",
      "adobe after effects",
      "indesign",
    ],
  },
  {
    id: 3,
    name: "Dianne Russell",
    work: "web designer",
    title: "Landing page design",
    price: 6000,
    experience: 2,
    type: "project work",
    rating: 5.0,
    reviews: 21,
    description:
      "Transform user experiences into engaging, intuitive journeys. I specialize in ui/ux design for web and mobile apps.",
    category: "design",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    skills: ["html", "css", "javascript", "figma", "adobe xd"],
  },
  {
    id: 4,
    name: "Jenny Wilson",
    work: "ux/ui designer",
    title: "Landing page design",
    price: 2000,
    experience: 2,
    type: "project work",
    rating: 4.9,
    reviews: 14,
    description:
      "I craft clean, conversion-focused landing pages that combine strategic layout, persuasive copy, and compelling visuals.",
    category: "design",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    skills: ["wireframes", "user research", "figma", "prototyping"],
  },
  {
    id: 5,
    name: "Daniel Kim",
    work: "full stack developer",
    title: "MERN stack web app",
    price: 8000,
    experience: 3,
    type: "full-time",
    rating: 4.7,
    reviews: 30,
    description:
      "I build robust mern stack applications, including admin dashboards, apis, and authentication systems.",
    category: "programming",
    avatar: "https://randomuser.me/api/portraits/men/17.jpg",
    skills: ["mongodb", "express", "react", "node.js", "typescript"],
  },
  {
    id: 6,
    name: "Sarah Lee",
    work: "frontend developer",
    title: "React website design",
    price: 6000,
    experience: 2,
    type: "project work",
    rating: 4.9,
    reviews: 22,
    description:
      "I specialize in building responsive react websites with animations and dynamic components.",
    category: "programming",
    avatar: "https://randomuser.me/api/portraits/women/58.jpg",
    skills: ["react", "tailwind css", "framer motion", "next.js", "javascript"],
  },
  {
    id: 7,
    name: "Ahmed Nasser",
    work: "video editor",
    title: "YouTube video editing",
    price: 3000,
    experience: 4,
    type: "part-time",
    rating: 4.6,
    reviews: 40,
    description:
      "I provide professional video editing services for content creators including subtitles, transitions, and color grading.",
    category: "video editing",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    skills: [
      "adobe premiere pro",
      "final cut pro",
      "davinci resolve",
      "subtitles",
      "transitions",
    ],
  },
  {
    id: 8,
    name: "Nina Patel",
    work: "motion graphics artist",
    title: "Explainer video animation",
    price: 4000,
    experience: 3,
    type: "project work",
    rating: 4.8,
    reviews: 29,
    description:
      "I create high-quality 2d animated explainer videos to present your product or service with clarity and style.",
    category: "animation",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
    skills: [
      "after effects",
      "illustrator",
      "storyboard",
      "2d animation",
      "explainer videos",
    ],
  },
  {
    id: 9,
    name: "David Chen",
    work: "digital marketer",
    title: "Social media marketing",
    price: 5000,
    experience: 5,
    type: "retainer",
    rating: 5.0,
    reviews: 51,
    description:
      "Expert in running instagram & facebook ad campaigns to grow engagement, traffic, and conversions.",
    category: "marketing",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    skills: [
      "instagram ads",
      "facebook ads",
      "analytics",
      "conversion tracking",
      "campaign strategy",
    ],
  },
  {
    id: 10,
    name: "Emily Zhang",
    work: "seo specialist",
    title: "On-page & off-page seo",
    price: 7000,
    experience: 3,
    type: "project work",
    rating: 4.9,
    reviews: 38,
    description:
      "I optimize websites for higher google rankings through content optimization and quality backlink strategies.",
    category: "marketing",
    avatar: "https://randomuser.me/api/portraits/women/90.jpg",
    skills: [
      "seo",
      "keyword research",
      "google analytics",
      "backlinks",
      "content strategy",
    ],
  },
];

const Home = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [open, setOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef();
  const [filteredFreelancers, setFilteredFreelancers] =
    useState(allFreelancers);

  const [searchTerm, setSearchTerm] = useState("");
  //   const searchLower = searchTerm.toLowerCase();

  const [designCount, setDesignCount] = useState(0);
  const [programmingCount, setProgrammingCount] = useState(0);
  const [videoEditingCount, setVideoEditingCount] = useState(0);
  const [animationCount, setAnimationCount] = useState(0);
  const [marketingCount, setMarketingCount] = useState(0);

  const [currentFilters, setCurrentFilters] = useState({
    category: "",
    availability: "",
    salaryRange: [0, Infinity],
    expRange: [0, Infinity],
    selectedSkills: [],
  });

  const handleFilter = (filters, search = "") => {
    // Save the current filter state for future search input
    setCurrentFilters((prev) => ({
      ...prev,
      ...filters,
    }));

    const {
      category = "",
      availability = "",
      salaryRange = [0, Infinity],
      expRange = [0, Infinity],
      selectedSkills = [],
    } = { ...currentFilters, ...filters }; // use merged filters

    const searchLower = search.toLowerCase();
    const categoryLower = category.toLowerCase();
    const availabilityLower = availability.toLowerCase();
    const selectedSkillsLower = selectedSkills.map((s) => s.toLowerCase());

    const matches = allFreelancers.filter((freelancer) => {
      const freelancerCategory = freelancer.category?.toLowerCase() || "";
      const freelancerType = freelancer.type?.toLowerCase() || "";
      const freelancerSkills =
        freelancer.skills?.map((s) => s.toLowerCase()) || [];

      const matchesSearch =
        !searchLower ||
        freelancer.name?.toLowerCase().includes(searchLower) ||
        freelancer.work?.toLowerCase().includes(searchLower) ||
        freelancer.title?.toLowerCase().includes(searchLower) ||
        freelancer.description?.toLowerCase().includes(searchLower);

      const matchesCategory =
        !categoryLower ||
        freelancerCategory.includes(categoryLower) ||
        categoryLower.includes(freelancerCategory);

      const matchesAvailability =
        !availabilityLower || freelancerType === availabilityLower;

      const matchesSalary =
        freelancer.price >= salaryRange[0] &&
        freelancer.price <= salaryRange[1];

      const matchesExperience =
        freelancer.experience >= expRange[0] &&
        freelancer.experience <= expRange[1];

      const matchesSkills =
        selectedSkillsLower.length === 0 ||
        selectedSkillsLower.every((skill) => freelancerSkills.includes(skill));

      return (
        matchesCategory &&
        matchesAvailability &&
        matchesSalary &&
        matchesExperience &&
        matchesSkills &&
        matchesSearch
      );
    });

    setFilteredFreelancers(matches);
  };

  useEffect(() => {
    setDesignCount(
      allFreelancers.filter((f) => f.category.toLowerCase() === "design").length
    );
    setProgrammingCount(
      allFreelancers.filter((f) => f.category.toLowerCase() === "programming")
        .length
    );
    setVideoEditingCount(
      allFreelancers.filter((f) => f.category.toLowerCase() === "video editing")
        .length
    );
    setAnimationCount(
      allFreelancers.filter((f) => f.category.toLowerCase() === "animation")
        .length
    );
    setMarketingCount(
      allFreelancers.filter((f) => f.category.toLowerCase() === "marketing")
        .length
    );

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showSidebar ? "hidden" : "";
  }, [showSidebar]);

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 p-1 z-50 transition-transform duration-300 ease-in-out bg-white
        ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-[20vw] md:block`}
      >
        {/* Filter Content */}
        <div className="h-full scrollable-no-scrollbar overflow-y-auto">
          <FilterSidebar onFilter={handleFilter} />
        </div>
      </aside>

      {/* Backdrop */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Content */}
      <main className="md:w-[80vw] flex flex-col h-screen overflow-hidden md:border-gray-300 md:border-l-2">
        {/* Navbar */}
        <header className="h-20 md:h-24 p-4 flex items-center justify-between relative flex-shrink-0">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden mr-2"
            >
              <Menu className="w-6 h-6 text-gray-800" />
            </button>
            <img className="w-22 md:w-26" src="/logo.png" alt="Logo" />
            <h1 className="text-3xl md:text-5xl font-[Outfit] font-semibold">
              WorkBridge
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center bg-[#EDEDED] rounded-md px-3 py-2 w-70">
              <Search className="text-gray-700 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent h-5 text-[12px] outline-none text-gray-700 w-full placeholder:text-gray-500"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  handleFilter(currentFilters, value);
                }}
              />
            </div>

            <div className="relative inline-block text-left" ref={dropdownRef}>
              <div className="flex items-center space-x-3">
                <img
                  src="https://i.pravatar.cc/150?img=32"
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="w-10 h-10 bg-[#EDEDED] rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  <ChevronDown className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-10">
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                    Settings
                  </button>
                  <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-left">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-b-2 px-4 py-4 space-y-4">
            <div className="flex items-center bg-gray-200 rounded-md px-3 py-2">
              <Search className="text-gray-700 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  handleFilter(currentFilters, value); // pass current filters and new search term
                }}
                className="bg-transparent h-5 text-[12px] outline-none text-gray-700 w-full placeholder:text-gray-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src="https://i.pravatar.cc/150?img=32"
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                  Profile
                </button>
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                  Settings
                </button>
                <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-left">
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Section */}
        <section className="h-14 md:h-16 flex items-center px-4 py-2 border-y-2 border-gray-300 overflow-x-auto whitespace-nowrap scrollable-no-scrollbar">
          <div
            onClick={() => {
              const updatedFilters = { ...currentFilters, category: "design" };
              handleFilter(updatedFilters, searchTerm);
            }}
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Design ({designCount})
          </div>
          <div
            onClick={() => {
              const updatedFilters = {
                ...currentFilters,
                category: "programming",
              };
              handleFilter(updatedFilters, searchTerm);
            }}
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Programming ({programmingCount})
          </div>
          <div
            onClick={() => {
              const updatedFilters = {
                ...currentFilters,
                category: "video editing",
              };
              handleFilter(updatedFilters, searchTerm);
            }}
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Video Editing ({videoEditingCount})
          </div>
          <div
            onClick={() => {
              const updatedFilters = {
                ...currentFilters,
                category: "animation",
              };
              handleFilter(updatedFilters, searchTerm);
            }}
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Animation ({animationCount})
          </div>
          <div
            onClick={() => {
              const updatedFilters = {
                ...currentFilters,
                category: "marketing",
              };
              handleFilter(updatedFilters, searchTerm);
            }}
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Marketing ({marketingCount})
          </div>
        </section>

        {/* Filtered Content Section */}
        <section className="flex-1 overflow-y-auto p-4 scrollable-no-scrollbar flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-screen-xl justify-center">
            {filteredFreelancers.map((freelancer, index) => (
              <React.Fragment key={freelancer.id}>
                {/* Render FreelancerCard */}
                <div className="flex justify-center">
                  <FreelancerCard freelancer={freelancer} />
                </div>

                {index === 3 && (
                  <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                    <div className="relative w-full h-60 overflow-hidden">
                      <img
                        src="/card-image.jpeg"
                        alt="Extra"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute h-full w-full bg-black/40 flex flex-col justify-end top-0 px-6 py-4">
                        <span className="text-white text-4xl">
                          Connecting You
                        </span>
                        <span className="text-white text-4xl">
                          with Trusted Freelancers, Fast.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Mobile filter button */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="md:hidden fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-40"
          >
            Filter
          </button>
        )}
      </main>
    </div>
  );
};

export default Home;
