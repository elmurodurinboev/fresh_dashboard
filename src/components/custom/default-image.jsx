import {cn} from "@/lib/utils";
import {IconPhoto} from "@tabler/icons-react";

function DefaultImage({className}) {
  return (
    <span
      className={cn("flex items-center justify-center w-[48px] min-w-[48px] h-10 min-h-10 bg-brandbg text-brand rounded-md", className)}
    >
      <IconPhoto className={"w-4 h-4"}/>
    </span>
  );
}

export default DefaultImage;