import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import { useMediaQuery } from "react-responsive";
import "./NavbarHook.css";

const NavbarHook = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: "1150px" });
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve userEmail from local storage on component mount
    const storedEmail = localStorage.getItem("userEmail");
    setUserEmail(storedEmail);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMobileMenu = () => {
    if (isMobile) setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    closeMobileMenu();
    navigate("/login");
  };

  // const handleOrdersNavigation = () => {
  //   if (userEmail?.includes("@courier.com")) {
  //     navigate("/CourierOrders");
  //   } else if (userEmail?.includes("@admin.com")) {
  //     navigate("/OrderManagement");
  //   } else {
  //     navigate("/user-orders");
  //   }
  // };

  const renderNavLinks = () => {
    const listClassName = isMobile ? "nav__list" : "nav__list__web";
    const linkClassName = "nav__link";
    const buttonClassName = "nav__cta";

    return (
      <ul className={listClassName}>
        <li>
          <NavLink  className={linkClassName} onClick={closeMobileMenu}>
            Home
          </NavLink>
        </li>
        
        <li>
          <NavLink  className={linkClassName} onClick={closeMobileMenu}>
            orders
          </NavLink>
        </li>
        
        <li>
          <NavLink
            to="/favorite"
            className={linkClassName}
            onClick={closeMobileMenu}
          >
            Favorite
          </NavLink>
        </li>
        
        <li>
          <NavLink
            to="/location"
            className={linkClassName}
            onClick={closeMobileMenu}
          >
            Location
          </NavLink>
        </li>
        
        <li>
          <button
            className={`${linkClassName} ${buttonClassName}`}
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    );
  };

  return (
    <header className="header">
      <nav className="nav container">
        <NavLink  className="nav__logo">
          Navigation Bar
        </NavLink>

        {isMobile && (
          <div className="nav__toggle" onClick={toggleMenu}>
            <IoMenu />
          </div>
        )}

        {isMobile ? (
          <div className={`nav__menu ${isMenuOpen ? "show-menu" : ""}`}>
            {renderNavLinks()}
            <div className="nav__close" onClick={toggleMenu}>
              <IoClose />
            </div>
          </div>
        ) : (
          renderNavLinks()
        )}
      </nav>
    </header>
  );
};

export default NavbarHook;
