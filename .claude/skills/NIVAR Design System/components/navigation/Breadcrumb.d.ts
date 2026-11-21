/**
 * Breadcrumb em mono versalete, separado por barra. O último item é o atual e não é link.
 */
export interface BreadcrumbItem { label: string; href?: string }
export interface BreadcrumbProps { items: BreadcrumbItem[]; className?: string }
export declare function Breadcrumb(props: BreadcrumbProps): JSX.Element;
