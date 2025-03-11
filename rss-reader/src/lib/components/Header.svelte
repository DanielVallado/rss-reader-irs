<script>
    let isMenuActive = false;
    let isSearchCollapsed = false;
  
    function toggleMenu() {
      isMenuActive = !isMenuActive;
    }
  
    function toggleSearch() {
      isSearchCollapsed = !isSearchCollapsed;
    }
  </script>

<div>
    <header class="header">
      <div class="logo">
        <span>RSS Reader</span>
      </div>
      <div class="search-container {isSearchCollapsed ? 'collapsed' : ''}">
        <input class="search-bar" type="text" placeholder="Search" />
        <button class="search-btn" on:click={toggleSearch}>
          <img src="/assets/search.png" alt="search icon" />
        </button>
      </div>
      <button class="hamburger {isMenuActive ? 'is-active' : ''}" on:click={toggleMenu} aria-label="Abrir menú de navegación">
        <div class="_layer -top"></div>
        <div class="_layer -mid"></div>
        <div class="_layer -bottom"></div>
      </button>
    </header>
  
    <nav class="menuppal {isMenuActive ? 'is_active' : ''}">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/">Feeds</a></li>
        <li><a href="/">Settings</a></li>
        <li><a href="/">Log out</a></li>
      </ul>
    </nav>
</div>

<style>
    .header {
      background-color: var(--primary);
      border-bottom: 0.2rem solid var(--secondary);
      color: white;
      padding: 2rem 6rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: nowrap;
    }
  
    .header .logo {
      font-size: 2.4rem;
      font-weight: bold;
      flex-grow: 1;
    }
  
    .search-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 350px;
      background-color: #2c2f38;
      border-radius: 30px;
      padding: 5px 15px;
      margin-top: 10px;
      transition: all 0.3s ease;
      flex-grow: 0;
    }
  
    .search-bar {
      padding: 10px;
      border: none;
      background-color: transparent;
      color: white;
      flex-grow: 1;
      font-size: 16px;
      border-radius: 30px;
      outline: none;
      transition: all 0.3s ease;
      display: block;
    }
  
    .search-container.collapsed {
      max-width: 80px;
      padding: 5px 10px;
    }
  
    .search-bar {
      transition: width 0.3s ease;
    }
  
    .search-container.collapsed .search-bar {
      visibility: hidden;
      width: 0;
    }
  
    .search-btn {
      background-color: transparent;
      border: none;
      padding: 0;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 10px;
    }
  
    .search-btn img {
      width: 20px;
      height: 20px;
      transition: width 0.3s ease, height 0.3s ease;
    }
  
    .hamburger {
      display: flex;
      position: relative;
      background-color: transparent;
      top: 0;
      right: 0;
      height: 30px;
      width: 30px;
      padding: 5px;
      z-index: 1002;
      cursor: pointer;
      align-self: center;
    }
  
    ._layer {
      background: #333;
      margin-bottom: 4px;
      border-radius: 2px;
      width: 28px;
      height: 4px;
      opacity: 1;
      transition: all 0.25s cubic-bezier(0.05, 1.04, 0.72, 0.98);
    }
  
    .hamburger.is-active .-top {
      transform: translateY(200%) rotate(45deg) !important;
    }
  
    .hamburger.is-active .-mid {
      opacity: 0;
    }
  
    .hamburger.is-active .-bottom {
      transform: translateY(-200%) rotate(135deg) !important;
    }
  
    .menuppal {
      background-color: rgba(255, 255, 255, 0.95);
      bottom: 0;
      height: 100%;
      left: 0;
      overflow-y: scroll;
      position: fixed;
      top: 0;
      transform: translate3d(0px, -100%, 0px);
      transition: transform 0.35s cubic-bezier(0.05, 1.04, 0.72, 0.98);
      width: 100%;
      z-index: 1001;
    }
  
    .menuppal.is_active {
      transform: translate3d(0px, 0px, 0px);
    }
  
    .menuppal ul {
      margin: 0;
      padding: 0;
    }
  
    .menuppal ul li {
      list-style: none;
      text-align: center;
      font-family: Verdadna, Arial, Helvetica;
      color: #369;
      font-size: 1.5rem;
      line-height: 3em;
      height: 3em;
      text-transform: none;
      font-weight: bold;
    }
  
    .menuppal ul li a {
      text-decoration: none;
      color: #369;
    }
  
    .menuppal ul li a:hover {
      text-decoration: none;
      color: #333;
    }
</style>  