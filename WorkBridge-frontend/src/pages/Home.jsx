import React from "react";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import FilterSidebar from "../components/FilterSidebar";
import FreelancerCard from "../components/FreelancerCard";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { allFreelancers, logout } = useAppContext();
  const [showSidebar, setShowSidebar] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef();
  const [filteredFreelancers, setFilteredFreelancers] =
    useState(allFreelancers);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
    type: "post",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  //   const searchLower = searchTerm.toLowerCase();

  const [designCount, setDesignCount] = useState(0);
  const [brandingCount, setBrandingCount] = useState(0);
  const [webDesignCount, setWebDesignCount] = useState(0);
  const [frontendCount, setFrontendCount] = useState(0);
  const [programmingCount, setProgrammingCount] = useState(0);
  const [backendCount, setBackendCount] = useState(0);
  const [webDevelopmentCount, setWebDevelopmentCount] = useState(0);
  const [videoEditingCount, setVideoEditingCount] = useState(0);
  const [animationCount, setAnimationCount] = useState(0);
  const [contentCreationCount, setContentCreationCount] = useState(0);
  const [marketingCount, setMarketingCount] = useState(0);
  const [adsCount, setAdsCount] = useState(0);
  const [strategyCount, setStrategyCount] = useState(0);
  const [seoCount, setSeoCount] = useState(0);
  const [analyticsCount, setAnalyticsCount] = useState(0);

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
  });

  const categories = [
    "Web Development",
    "Design",
    "Marketing",
    "Video Editing",
    "Writing",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        "http://localhost:4000/api/projects/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Project created successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        budget: "",
        deadline: "",
        type: "open",
      });

      // Redirect after short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("❌ Project creation failed", err);
      setMessage("❌ Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const [currentFilters, setCurrentFilters] = useState({
    category: "",
    availability: "",
    salaryRange: [0, Infinity],
    expRange: [0, Infinity],
    selectedSkills: [],
  });

  const handleFilter = (filters, search = "") => {
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
    } = { ...currentFilters, ...filters };

    const searchLower = search.toLowerCase();
    const categoryLower = category?.toLowerCase() || "";
    const availabilityLower = availability?.toLowerCase() || "";
    const selectedSkillsLower = selectedSkills.map((s) => s.toLowerCase());

    const matches = allFreelancers.filter((freelancer) => {
      const freelancerType = freelancer.type?.toLowerCase() || "";
      const freelancerSkills =
        freelancer.skills?.map((s) => s.toLowerCase()) || [];

      const services = freelancer.services || [];

      // Extract all categories from services
      const serviceCategories = services.map((s) => s.category.toLowerCase());

      const matchesSearch =
        !searchLower ||
        freelancer.name?.toLowerCase().includes(searchLower) ||
        freelancer.work?.toLowerCase().includes(searchLower) ||
        freelancer.title?.toLowerCase().includes(searchLower) ||
        freelancer.description?.toLowerCase().includes(searchLower) ||
        freelancer.services?.some(
          (s) =>
            s.name.toLowerCase().includes(searchLower) ||
            s.description.toLowerCase().includes(searchLower)
        );

      const matchesCategory =
        !categoryLower || serviceCategories.includes(categoryLower);

      // Find relevant services based on selected category
      const servicesInCategory = categoryLower
        ? services.filter((s) => s.category.toLowerCase() === categoryLower)
        : services;

      const minServicePrice = servicesInCategory.length
        ? Math.min(...servicesInCategory.map((s) => s.price))
        : null;

      const matchesSalary =
        minServicePrice === null ||
        (minServicePrice >= salaryRange[0] &&
          minServicePrice <= salaryRange[1]);

      const matchesExperience =
        freelancer.experience >= expRange[0] &&
        freelancer.experience <= expRange[1];

      const matchesAvailability =
        !availabilityLower || freelancerType === availabilityLower;

      const matchesSkills =
        selectedSkillsLower.length === 0 ||
        selectedSkillsLower.every((skill) => freelancerSkills.includes(skill));

      return (
        matchesCategory &&
        matchesSalary &&
        matchesAvailability &&
        matchesExperience &&
        matchesSkills &&
        matchesSearch
      );
    });

    setFilteredFreelancers(matches);
  };

  useEffect(() => {
    const categoryCounts = {
      design: 0,
      branding: 0,
      "web design": 0,
      frontend: 0,
      programming: 0,
      backend: 0,
      "web development": 0,
      "video editing": 0,
      animation: 0,
      "content creation": 0,
      marketing: 0,
      ads: 0,
      strategy: 0,
      seo: 0,
      analytics: 0,
    };

    allFreelancers.forEach((freelancer) => {
      freelancer.services?.forEach((service) => {
        const cat = service.category?.toLowerCase();
        if (categoryCounts.hasOwnProperty(cat)) {
          categoryCounts[cat]++;
        }
      });
    });

    setDesignCount(categoryCounts["design"]);
    setBrandingCount(categoryCounts["branding"]);
    setWebDesignCount(categoryCounts["web design"]);
    setFrontendCount(categoryCounts["frontend"]);
    setProgrammingCount(categoryCounts["programming"]);
    setBackendCount(categoryCounts["backend"]);
    setWebDevelopmentCount(categoryCounts["web development"]);
    setVideoEditingCount(categoryCounts["video editing"]);
    setAnimationCount(categoryCounts["animation"]);
    setContentCreationCount(categoryCounts["content creation"]);
    setMarketingCount(categoryCounts["marketing"]);
    setAdsCount(categoryCounts["ads"]);
    setStrategyCount(categoryCounts["strategy"]);
    setSeoCount(categoryCounts["seo"]);
    setAnalyticsCount(categoryCounts["analytics"]);
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
                  <button
                    onClick={() => navigate("/client/dashboard")}
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    Profile
                  </button>
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-left"
                  >
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
                <button
                  onClick={() => navigate("/client/dashboard")}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                >
                  Profile
                </button>
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-left"
                >
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
              setSearchTerm("");
              handleFilter(
                { ...currentFilters, category: "design" },
                searchTerm
              );
            }}
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Design ({designCount})
          </div>
          <div
            onClick={() => {
              setSearchTerm("");
              handleFilter(
                { ...currentFilters, category: "branding" },
                searchTerm
              );
            }}
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Branding ({brandingCount})
          </div>
          <div
            onClick={() => {
              setSearchTerm("");
              handleFilter(
                { ...currentFilters, category: "web design" },
                searchTerm
              );
            }}
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Web Design ({webDesignCount})
          </div>
          <div
            onClick={() => {
              setSearchTerm("");
              handleFilter(
                { ...currentFilters, category: "frontend" },
                searchTerm
              );
            }}
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Frontend ({frontendCount})
          </div>
          <div
            onClick={() => {
              setSearchTerm("");
              handleFilter(
                { ...currentFilters, category: "programming" },
                searchTerm
              );
            }}
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Programming ({programmingCount})
          </div>
          <div
            onClick={() => {
              setSearchTerm("");
              handleFilter(
                { ...currentFilters, category: "backend" },
                searchTerm
              );
            }}
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Backend ({backendCount})
          </div>
          <div
            onClick={() =>
              handleFilter(
                { ...currentFilters, category: "web development" },
                searchTerm
              )
            }
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Web Development ({webDevelopmentCount})
          </div>
          <div
            onClick={() =>
              handleFilter(
                { ...currentFilters, category: "video editing" },
                searchTerm
              )
            }
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Video Editing ({videoEditingCount})
          </div>
          <div
            onClick={() =>
              handleFilter(
                { ...currentFilters, category: "animation" },
                searchTerm
              )
            }
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Animation ({animationCount})
          </div>
          <div
            onClick={() =>
              handleFilter(
                { ...currentFilters, category: "content creation" },
                searchTerm
              )
            }
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Content Creation ({contentCreationCount})
          </div>
          <div
            onClick={() =>
              handleFilter(
                { ...currentFilters, category: "marketing" },
                searchTerm
              )
            }
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Marketing ({marketingCount})
          </div>
          <div
            onClick={() =>
              handleFilter({ ...currentFilters, category: "ads" }, searchTerm)
            }
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Ads ({adsCount})
          </div>
          <div
            onClick={() =>
              handleFilter(
                { ...currentFilters, category: "strategy" },
                searchTerm
              )
            }
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Strategy ({strategyCount})
          </div>
          <div
            onClick={() =>
              handleFilter({ ...currentFilters, category: "seo" }, searchTerm)
            }
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            SEO ({seoCount})
          </div>
          <div
            onClick={() =>
              handleFilter(
                { ...currentFilters, category: "analytics" },
                searchTerm
              )
            }
            className="text-lg md:text-3xl mr-5 md:mr-10 cursor-pointer"
          >
            Analytics ({analyticsCount})
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
        <div className="fixed bottom-5 right-5 flex flex-col space-y-2 items-center">
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden w-20 bg-black text-white px-4 py-2 rounded-full shadow-lg z-40"
            >
              Filter
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-40"
            >
              Post a Project
            </button>

            {showForm && (
              <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl relative">
                  <button
                    onClick={() => setShowForm(false)}
                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-lg"
                  >
                    ✕
                  </button>

                  <h2 className="text-xl font-semibold mb-4">
                    Post a New Project
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block font-medium">Title</label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="e.g., Logo for Fintech Startup"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block font-medium">Description</label>
                      <textarea
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        rows={3}
                        placeholder="Describe your project..."
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block font-medium">Category</label>
                      <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Select Category</option>
                        <option value="design">Design</option>
                        <option value="branding">Branding</option>
                        <option value="web design">Web Design</option>
                        <option value="frontend">Frontend</option>
                        <option value="programming">Programming</option>
                        <option value="backend">Backend</option>
                        <option value="web development">Web Development</option>
                        <option value="video editing">Video Editing</option>
                        <option value="animation">Animation</option>
                        <option value="content creation">
                          Content Creation
                        </option>
                        <option value="marketing">Marketing</option>
                        <option value="ads">Ads</option>
                        <option value="strategy">Strategy</option>
                        <option value="seo">SEO</option>
                        <option value="analytics">Analytics</option>
                      </select>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block font-medium">Budget ($)</label>
                      <input
                        type="number"
                        name="budget"
                        required
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="e.g., 2500"
                      />
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="block font-medium">
                        Deadline (days)
                      </label>
                      <input
                        type="number"
                        name="deadline"
                        required
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="e.g., 3"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      {loading ? "Creating..." : "Create Project"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
