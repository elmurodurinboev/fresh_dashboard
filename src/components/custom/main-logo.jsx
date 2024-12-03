import {cn} from "@/lib/utils.js";
// #A3D165
const MainLogo = ({className}) => {
  return (
    <div className={cn(className)}>
      <img src="/images/LogoFresh.svg" alt="Fresh" className={"object-cover"}/>
    </div>
  );
};

export default MainLogo;