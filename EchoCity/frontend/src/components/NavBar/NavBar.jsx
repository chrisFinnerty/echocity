import { useContext, useState } from 'react';
import Context from '../Context';
import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, NavbarToggler, Collapse } from 'reactstrap';
import { FaToggleOn, FaToggleOff, FaMoon, FaSun }  from 'react-icons/fa6';
import Logo from './Logo';
import './NavBar.css';
import Loader from '../Loader/Loader';

const NavBar = ({ logout, isLoading }) => {
    const { currentUser, theme, toggleTheme } = useContext(Context);
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(prev => !prev);

    if(isLoading) return <Loader />;
    
    return (
        <Navbar fixed="top" className={` NavBar ${isOpen ? 'menu-open' : '' }`} dark expand="md">
          <NavbarBrand tag={Link} to="/" id="NavBar-echo-logo">
            <Logo />
          </NavbarBrand>
          
          <div className="navbar-right-section">
            <button onClick={toggleTheme} className="Navbar-theme-button">
              {theme === 'dark' ? (
                <>
                  <FaMoon className="FaMoon" /> <FaToggleOff className="FaDisplayToggle" />
                </>
              ) : (
                <>
                  <FaSun className="FaSun" /> <FaToggleOn className="FaDisplayToggle" />
                </>
              )}
            </button>
            
            <NavbarToggler onClick={toggle} />
            
            <Collapse isOpen={isOpen} navbar>
              <Nav className="ms-auto" navbar>
                {currentUser ? (
                  <>
                    <NavItem>
                      <NavLink tag={Link} to="/concerts">Discover</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/my-artists">My Artists</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/my-concerts">My Concerts</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to={`/users/${currentUser.id}`}>My Profile</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/" onClick={logout}>Logout</NavLink>
                    </NavItem>
                  </>
                ) : (
                  <>
                    <NavItem>
                      <NavLink tag={Link} to="/signup">Sign Up</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/login">Login</NavLink>
                    </NavItem>
                  </>
                )}
              </Nav>
            </Collapse>
          </div>
        </Navbar>
      );
}

export default NavBar;