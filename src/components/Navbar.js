import "../styles/Navbar.css";

export default function Navbar() {
  return `
    <nav id="navbar">
        <input type="checkbox" id="mobile-menu-toggle">

        <label for="mobile-menu-toggle" class="hamburger-menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </label>

        <div class="navbar-logo">
            <a href="#">${App.title}<span class="amazon-style">.</span></a>
        </div>

        <div class="search-container">
            <input type="text" placeholder="Search for products, brands and more">
            <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
        </div>

        <div class="navbar-links">
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.76 3.76a6 6 0 0 0-7.52 0C2.38 6.62 1.85 10.8 4.37 13.97l6.9 7.47a1 1 0 0 0 1.46 0l6.9-7.47c2.52-3.18 2-7.35-1.04-10.21zM12 12.32a2.32 2.32 0 1 1 0-4.64 2.32 2.32 0 0 1 0 4.64z"></path></svg>
                    Wishlist
                </a>
            </div>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zm-1.45-5c.59 0 1.08-.36 1.29-.87L21.7 4.96c.09-.24.04-.53-.13-.73s-.44-.29-.7-.23H5.21l-.94-2H1v2h2l3.6 7.59L5.25 14.03A2 2 0 0 0 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45z"></path></svg>
                    Cart
                    <span style="background-color: #FF9900; color: #131921; border-radius:50%; padding: 2px 6px; font-size: 0.7rem; margin-left: 5px; font-weight: bold;">1</span>
                </a>
            </div>
        </div>

        <div class="user-profile">
            <input type="checkbox" id="user-dropdown-toggle">

            <label for="user-dropdown-toggle" class="user-profile-trigger">
                <div class="avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
                </div>
                <span class="username">Can</span> <svg class="arrow-down" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </label>

            <div class="dropdown-content">
                <a href="/profile" data-link>Profile</a>
                <a href="/" data-link>Logout</a>
            </div>
        </div>
    </nav>
        `;
}
