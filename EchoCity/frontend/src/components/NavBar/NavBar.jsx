import { useContext } from 'react';
import Context from '../Context';
import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import Logo from './Logo';
import './NavBar.css';

const NavBar = ({ logout }) => {
    const {currentUser} = useContext(Context);
    
    return (
        <>
        {currentUser ? (
            <Navbar fixed='top' className='NavBar' dark expand="md">
                <NavbarBrand tag={Link} to='/' id='NavBar-echo-logo'><Logo /></NavbarBrand>
                <Nav className='ms-auto' navbar>
                    <NavItem>
                        <NavLink tag={Link} to={`/events`}>Discover</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to={`/my-artists`}>My Artists</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to='/'>My Concerts</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to={`/users/${currentUser.id}`}>My Profile</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to='/' onClick={logout}>Logout</NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
        ) : (
            <Navbar fixed='top' className='NavBar' dark expand="md">
                <NavbarBrand href='/' id='NavBar-echo-logo'><Logo /></NavbarBrand>
                <Nav className='ms-auto' navbar>
                    <NavItem>
                        <NavLink tag={Link} to='/signup'>Sign Up</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to='/login'>Login</NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
        )}
        </>
    )
}

export default NavBar;