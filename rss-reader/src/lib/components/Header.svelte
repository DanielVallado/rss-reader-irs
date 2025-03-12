<script>
    let isMenuActive = false;
    let animateMenu = false;
  
    function toggleMenu() {
      animateMenu = true;
      isMenuActive = !isMenuActive;
    }
      
    function handleResize() {
      if (window.innerWidth >= 768) {
        isMenuActive = false;
        animateMenu = false;
      }
    }
</script>

<svelte:window on:resize={handleResize} />

<div>
    <header class="header">
      <div class="logo">
        <a href="/">RSS Reader</a>
      </div>

      <button class="hamburger {isMenuActive ? 'is-active' : ''}" on:click={toggleMenu} aria-label="Abrir menú de navegación">
        <div class="_layer -top"></div>
        <div class="_layer -mid"></div>
        <div class="_layer -bottom"></div>
      </button>

      <nav class="menuppal {isMenuActive ? 'is_active' : ''} {animateMenu ? 'animate' : ''}">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/">Feeds</a></li>
          <li><a href="/">Settings</a></li>
          <li><a href="/">Log out</a></li>
        </ul>
      </nav>
    </header>
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
  
    .logo a {
      color: white;
      text-decoration: none;
    }

    /* Hamburger Button */
    .hamburger {
      position: fixed;
      background-color: transparent;
      right: 3rem;
      top: 1rem;
      padding: 2rem 2rem;
      -webkit-transform:translate3d(0, 0, 0);
      transform:translate3d(0, 0, 0);
      -webkit-transition:-webkit-transform 0.25s cubic-bezier(0.05, 1.04, 0.72, 0.98);
      transition:transform 0.25s cubic-bezier(0.05, 1.04, 0.72, 0.98);
      z-index:1002;
      cursor:pointer;
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
      border: none;
    }
    @media (min-width: 768px) {
      .hamburger {
        display: none;
      }
    }
    .hamburger.is-active { 
      background-color:none;
    }
    ._layer {
      background:var(--white);
      margin-bottom: 0.4rem;
      border-radius: 0.2rem;
      width: 2.8rem;
      height: 0.4rem;
      opacity: 1;
      -webkit-transform:translate3d(0, 0, 0);
      transform:translate3d(0, 0, 0);
      -webkit-transition:all 0.25s cubic-bezier(0.05, 1.04, 0.72, 0.98);
      transition:all 0.25s cubic-bezier(0.05, 1.04, 0.72, 0.98);
    }
    .hamburger:hover .-top {
      -webkit-transform:translateY(-100%);
      -ms-transform:translateY(-100%);
      transform:translateY(-100%);
    }
    .hamburger:hover .-bottom {
      -webkit-transform:translateY(50%);
      -ms-transform:translateY(100%);
      transform:translateY(100%);
      }
    .hamburger.is-active .-top {
      -webkit-transform:translateY(200%) rotate(45deg) !important;
      -ms-transform:translateY(200%) rotate(45deg) !important;
      transform:translateY(200%) rotate(45deg) !important;
    }
    .hamburger.is-active .-mid {
      opacity:0;
    }
    .hamburger.is-active .-bottom {
      -webkit-transform:translateY(-200%) rotate(135deg) !important;
      -ms-transform:translateY(-200%) rotate(135deg) !important;
      transform:translateY(-200%) rotate(135deg) !important;
    }

    /* Mobile Menu */
    .menuppal {
      background-color: var(--primary);
      bottom: 0;
      height: 100%;
      left: 0;
      overflow-y: scroll;
      position: fixed;
      top: 0;
      transform: translate3d(0px, -100%, 0px);
      transition: none;
      width: 100%;
      z-index: 1001;
    }
    .menuppal.animate {
      transition: transform 0.35s cubic-bezier(0.05, 1.04, 0.72, 0.98);
    }
    .menuppal.is_active {
      transform: translate3d(0px, 0px, 0px);
    }
    .menuppal ul {
      margin: 10rem 0;
      padding: 0;
    }
    .menuppal ul li { 
      list-style: none;
      text-align:center;
      color: var(--primary);
      font-size: 3.5rem;
      line-height: 3em;
      height: 3em;
      text-transform:none;
      font-weight:bold;
    }
    .menuppal ul li a {
      text-decoration:none;
      color:var(--white);
    }
    .menuppal ul li a:hover {
      text-decoration:none;
      color: var(--lightGray);
    }

    /* Desktop Menu */
    @media (min-width: 768px) {
      .menuppal {
        position: static;
        height: auto;
        transform: none;
        transition: none;
        background-color: transparent;
        width: auto;
        overflow: visible;
      }
      .menuppal ul {
        display: flex;
        margin: 0;
        gap: 4rem;
        align-items: center;
        justify-content: flex-end;
      }
      .menuppal ul li {
        font-size: 1.8rem;
        line-height: normal;
        height: auto;
      }
    }
</style>  