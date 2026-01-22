const AdogmeHeader = () => {
  return (
    <header className="flex sticky top-0 z-30 bg-white justify-between items-center px-5 py-3 border-y-2 border-gray-200">
      <div>
        <h3 className="font-black text-xl">aDOGme</h3>
      </div>
      <div className="hidden md:flex justify-between items-center gap-5">
        <a>Catálogo</a>
        <a>Proceso</a>
        <a>Refugios</a>
        <a>Acerca</a>
        <button className="btn btn-primary">Entrar</button>
        <button className="btn btn-secondary text-black">Registrarse</button>
      </div>
      <div className="md:hidden">
        <div className="drawer drawer-end">
          <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label
              htmlFor="my-drawer-5"
              className="drawer-button btn btn-primary"
            >
              <span className="material-symbols-outlined">menu</span>
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-5"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu bg-base-200 min-h-full w-80 p-4">
              {/* Sidebar content here */}
              <li>
                <a>Catálogo</a>
              </li>
              <li>
                <a>Proceso</a>
              </li>
              <li>
                <a>Refugios</a>
              </li>
              <li>
                <a>Acerca</a>
              </li>
              <li className="text-primary font-bold">
                <a>Entrar</a>
              </li>
              <li className="font-bold">
                <a>Registrarse</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdogmeHeader;
