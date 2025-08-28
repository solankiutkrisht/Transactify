import { TbInvoice } from "react-icons/tb";
import { Link } from "react-router";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-logo">
        <TbInvoice />
        <h1>Transactify</h1>
      </Link>
      <Link to="/register" className="navbar-icon" >Register</Link>
    </nav>
  );
};

export default Navbar;
