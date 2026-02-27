import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import darkIcon from "../assets/Image/icon/dark.svg";
import optionIcon from "../assets/Image/icon/option.svg";
import back from "../assets/Image/icon/back.svg";
import cart from "../assets/Image/icon/cart.svg";
import searchicon from "../assets/Image/icon/searchicon.svg";

function Navbar({ search, setSearch }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const menuRef = useRef(null);
  const inputRef = useRef(null); 

  /* ---------- DARK MODE ---------- */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  /* ---------- LOAD CATEGORIES FROM BACKEND ---------- */
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();

    // Auto refresh when category added
    const interval = setInterval(fetchCategories, 5000); // refresh every 5 sec

    return () => clearInterval(interval);
  }, []);
  /* ---------- CLICK OUTSIDE ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------- SEARCH ---------- */
  const doSearch = () => {
    if (search.trim() === "") return;
    navigate(`/productsearch?q=${encodeURIComponent(search)}`);
    setShowMenu(false);
  };

  return (
  <>
    {/* FIXED WRAPPER */}
    <div className="fixed top-0 left-0 w-full z-50 shadow-md">

      {/* ===== NAVBAR ===== */}
      <div className="bg-gray-400 dark:bg-gray-800">
        <div className="flex items-center justify-between py-3 px-8 text-black dark:text-white">
          
          {/* LEFT */}
          <div className="relative flex items-center space-x-4" ref={menuRef}>
            <img
              src={optionIcon}
              alt="Options"
              onClick={() => setShowMenu(!showMenu)}
              className={`w-6 h-6 cursor-pointer transition filter brightness-0 dark:invert ${
                darkMode ? "invert" : ""
              }`}
            />

            {showMenu && (
              <div className="absolute top-[60px] left-0 bg-gray-300 dark:bg-gray-800 shadow-lg rounded-lg w-44 py-2 z-50 max-h-[220px] overflow-y-auto">
                {categories.length === 0 ? (
                  <p className="px-4 py-2 text-sm text-gray-500">
                    No categories
                  </p>
                ) : (
                  categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      onClick={() => setShowMenu(false)}
                      className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {cat.name}
                    </Link>
                  ))
                )}
              </div>
            )}

            <img
              src={back}
              alt="Back"
              onClick={() => navigate(-1)}
              className="w-6 h-6 cursor-pointer transition filter brightness-0 dark:invert"
            />
          </div>

          {/* RIGHT */}
          <nav className="flex items-center space-x-4">
            <Link to="/cart" className="hover:scale-110 transition">
              <img
                src={cart}
                alt="Cart"
                className="w-6 h-6 cursor-pointer transition filter brightness-0 dark:invert"
              />
            </Link>

            <Link to="/contect" className="hover:text-orange-400 font-medium">
              Contact
            </Link>

            <Link to="/login" className="hover:text-orange-400 font-medium">
              Login
            </Link>

            <img
              src={darkIcon}
              alt="Dark mode"
              onClick={() => setDarkMode(!darkMode)}
              className="w-6 h-6 cursor-pointer hover:scale-110 transition"
            />
          </nav>
        </div>
      </div>

      {/* ===== SEARCH BAR (DIFFERENT STYLE) ===== */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
        <form
          className="flex justify-center py-3 px-5"
          onSubmit={(e) => {
            e.preventDefault();
            doSearch();
          }}
        >
          <div className="relative w-[300px] sm:w-[450px] md:w-[550px]">
            <input
              type="text"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              ref={inputRef}
              className="w-full h-[35px] px-4 pr-10 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <img
              src={searchicon}
              alt="search icon"
              className={`w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition ${
                darkMode ? "invert" : ""
              }`}
              onClick={() => inputRef.current.focus()}
            />
          </div>
        </form>
      </div>

    </div>
  </>
);

}

export default Navbar;
