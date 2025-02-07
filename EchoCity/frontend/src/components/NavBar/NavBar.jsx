import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import Logo from './Logo';
import './NavBar.css';

const NavBar = () => {
    return (
        <>
        <Navbar fixed='top' className='NavBar' color='dark' dark expand="md">
            <NavbarBrand href='/' id='NavBar-echo-logo'><Logo /></NavbarBrand>
            <Nav className='ms-auto' navbar>
                <NavItem>
                    <NavLink href='/register'>Signup</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href='/login'>Login</NavLink>
                </NavItem>
            </Nav>
        </Navbar>
        </>
    )
}

export default NavBar;