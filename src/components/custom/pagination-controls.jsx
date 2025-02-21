import {Button} from "@/components/ui/button.jsx";
import {IconChevronLeft, IconChevronRight} from "@tabler/icons-react";
import Pagination from "rc-pagination";

export const PaginationControls = ({total, page_size, current_page, onPageChange}) => {
  const handlePage = (page_number) => {
    onPageChange(page_number)
  }

  const itemRender = (current, type, element) => {
    if (type === 'page') {
      return (
        <Button
          className={"w-8 h-8"}
          variant={current === current_page ? "default" : "ghost"}
        >
          {current}
        </Button>
      )
    }

    if (type === 'prev') {
      return (
        <Button
          variant={"secondary"}
          size={"icon"}
          className={"w-8 h-8"}
        >
          <IconChevronLeft className={"icon-sm"}/>
        </Button>
      )
    }

    if (type === "next") {
      return (
        <Button
          variant={"secondary"}
          size={"icon"}
          className={"w-8 h-8"}
        >
          <IconChevronRight className={"icon-sm"}/>
        </Button>
      )
    }

    if (type === "jump-prev") {
      return (
        <Button
          variant={"ghost"}
          size={"icon"}
          className={"w-8 h-8"}
        >
          ...
        </Button>
      )
    }

    if (type === "jump-next") {
      return (
        <Button
          variant={"ghost"}
          size={"icon"}
          className={"w-8 h-8"}
        >
          ...
        </Button>
      )
    }

    return element
  }


  return (
    <div className={"flex items-center gap-2"}>
      <Pagination
        total={total}
        pageSize={Number(page_size)}
        className={"flex gap-2"}
        current={Number(current_page)}
        onChange={handlePage}
        itemRender={itemRender}
        showPrevNextJumpers={true}
        showLessItems={true}
        showSizeChanger={false}
        showTitle={false}
        hideOnSinglePage={true}
      />
    </div>
  );
};