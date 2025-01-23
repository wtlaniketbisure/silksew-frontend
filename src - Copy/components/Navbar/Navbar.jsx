import React, { useState, useContext, useEffect } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import profile_icon from "../Assets/profile_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cartItems } = useContext(ShopContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Check if screen size is below the mobile threshold (768px)
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    };

    // Set initial view
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogoutClick = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const calculateTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Close mobile menu when an option is clicked (only on mobile view)
  const handleMenuClick = (menuOption) => {
    setMenu(menuOption);
    if (isMobileView) {
      setIsMobileMenuOpen(false); // Close menu only on mobile view
    }
  };

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <p>SILKSEW</p>
      </div>

      <ul className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <li onClick={() => handleMenuClick("shop")}>
          <Link to="/">Shop</Link>
          {menu === "shop" && <hr />}
        </li>
        <li onClick={() => handleMenuClick("mens")}>
          <Link to="/mens">Men</Link>
          {menu === "mens" && <hr />}
        </li>
        <li onClick={() => handleMenuClick("womens")}>
          <Link to="/womens">Women</Link>
          {menu === "womens" && <hr />}
        </li>
        <li onClick={() => handleMenuClick("kids")}>
          <Link to="/kids">Kids</Link>
          {menu === "kids" && <hr />}
        </li>
      </ul>

      {/* Search bar now comes after menu in desktop view */}
      <div className="nav-search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products"
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="nav-login-cart">
        {user ? (
          <>
            <Link to="/cart" className="cart-icon-wrapper">
              <img src={cart_icon} alt="Cart" className="cart-icon" />
              {calculateTotalCartItems() > 0 && (
                <div className="cart-item-count">{calculateTotalCartItems()}</div>
              )}
            </Link>

            <div className="profile-info" onClick={toggleDropdown}>
              <span className="username-display">Hi, {user.name}</span>
              <img
                src={profile_icon}
                alt="Profile"
                className="profile-icon clickable"
              />
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                  <div
                    className="dropdown-item"
                    onClick={handleLogoutClick}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <button onClick={() => navigate("/login")} className="login-btn">
            Login
          </button>
        )}
      </div>

      {/* Hamburger Menu */}
      <div className="hamburger-menu" onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};


export default Navbar;
