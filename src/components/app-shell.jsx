import {Outlet} from 'react-router-dom';
import Sidebar from './sidebar';
import useIsCollapsed from '@/hooks/use-is-collapsed';
import SkipToMain from './skip-to-main';

export default function AppShell() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  // ToDo
  // Add navigate to this for each user
  return (
    <div className='relative h-screen overflow-hidden bg-background'>
      <SkipToMain />
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
      >
        <Outlet />
      </main>
    </div>
  );
}

