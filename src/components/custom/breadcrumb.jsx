import * as React from "react"
import { cn } from "@/lib/utils"

const BreadcrumbContext = React.createContext(false)

const Breadcrumb = React.forwardRef(
  ({ className, children, separator, ...props }, ref) => {
    const validChildren = getValidChildren(children)

    const count = validChildren.length

    const clones = validChildren.map((child, index) =>
      React.cloneElement(child, {
        separator,
        isLastChild: count === index + 1
      })
    )

    return (
      <BreadcrumbContext.Provider value={true}>
        <nav ref={ref} aria-label="breadcrumb" className={className} {...props}>
          <ol className={cn(`flex`)}>{clones}</ol>
        </nav>
      </BreadcrumbContext.Provider>
    )
  }
)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbItem = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { separator, isLastChild, ...rest } = props

    // Check if BreadcrumbItem is used within Breadcrumb
    const isInsideBreadcrumb = React.useContext(BreadcrumbContext)
    if (!isInsideBreadcrumb) {
      throw new Error(
        `${BreadcrumbItem.displayName} must be used within ${Breadcrumb.displayName}.`
      )
    }

    return (
      <li ref={ref} className={cn(`group`, className)} {...rest}>
        {children}
        {!isLastChild && (
          <span className="mx-2 *:!inline-block">{separator ?? "/"}</span>
        )}
      </li>
    )
  }
)
BreadcrumbItem.displayName = "BreadcrumbItem"

/* ========== Util Func ========== */

const getValidChildren = children =>
  React.Children.toArray(children).filter(child => {
    if (React.isValidElement(child) && child.type === BreadcrumbItem) {
      return React.isValidElement(child)
    }
    throw new Error(
      `${Breadcrumb.displayName} can only have ${BreadcrumbItem.displayName} as children.`
    )
  })

export { Breadcrumb, BreadcrumbItem }
