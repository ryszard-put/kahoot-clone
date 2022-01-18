import {Outlet} from 'react-router-dom';

const Layout = () => {
  return <>
    <main className="container" style={{minHeight: 'calc(100vh - 2rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <Outlet />
    </main>
  </>
}

export default Layout;