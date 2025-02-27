import * as React from 'react';
import {cn} from '@/lib/utils';
import TopLoader from "@/components/custom/top-loader.jsx";
import ThemeSwitch from "@/components/theme-switch.jsx";
import LanguageSwitch from "@/components/language-switch.jsx";
import {UserNav} from "@/components/user-nav.jsx";
import RestaurantBalanceSheet from "@/components/custom/restaurant-balance-sheet.jsx";

const LayoutContext = React.createContext(null);

const Layout = ({className, fixed = false, ...props}) => {
  const divRef = React.useRef(null);
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const div = divRef.current;

    if (!div) return;
    const onScroll = () => setOffset(div.scrollTop);

    div.removeEventListener('scroll', onScroll);
    div.addEventListener('scroll', onScroll, {passive: true});
    return () => div.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <LayoutContext.Provider value={{offset, fixed}}>
      <div
        ref={divRef}
        data-layout='layout'
        className={cn(
          'h-full overflow-auto',
          fixed && 'flex flex-col',
          className
        )}
        {...props}
      />
      <TopLoader/>
    </LayoutContext.Provider>
  );
};
Layout.displayName = 'Layout';

const Header = React.forwardRef(({className, sticky = true, ...props}, ref) => {
  const contextVal = React.useContext(LayoutContext);
  if (contextVal === null) {
    throw new Error(`Layout.Header must be used within ${Layout.displayName}.`);
  }

  return (
    <div
      ref={ref}
      data-layout='header'
      className={cn(
        `z-10 flex h-[var(--header-height)] items-center gap-4 bg-white p-3 md:px-8`,
        contextVal.offset > 10 && sticky ? 'shadow' : 'shadow',
        contextVal.fixed && 'flex-none',
        sticky && 'sticky top-0',
        className
      )}
      {...props}
    >
      <div className="ml-auto flex items-center space-x-4">
        <RestaurantBalanceSheet/>
        <ThemeSwitch/>
        <LanguageSwitch/>
        <UserNav/>
      </div>
    </div>
  );
});
Header.displayName = 'Header';

const Body = React.forwardRef(({className, ...props}, ref) => {
  const contextVal = React.useContext(LayoutContext);
  if (contextVal === null) {
    throw new Error(`Layout.Body must be used within ${Layout.displayName}.`);
  }

  return (
    <div
      ref={ref}
      data-layout='body'
      className={cn(
        'px-4 py-6 md:overflow-hidden md:px-8 min-h-screen',
        contextVal && contextVal.fixed && 'flex-1',
        className
      )}
      {...props}
    />
  );
});
Body.displayName = 'Body';

Layout.Header = Header;
Layout.Body = Body;

export {Layout};