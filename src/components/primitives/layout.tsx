import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

type SectionHeaderProps = {
  title: string;
  caption?: string;
  actions?: ReactNode;
};

type SectionShellProps = {
  children: ReactNode;
  className?: string;
};

type SplitLayoutProps = {
  primary: ReactNode;
  secondary: ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return <div className={cn("page-shell", className)}>{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header__copy">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{description}</p>
      </div>
      {actions ? <div>{actions}</div> : null}
    </header>
  );
}

export function SectionHeader({ title, caption, actions }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        <h2 className="section-title">{title}</h2>
        {caption ? <p className="section-caption">{caption}</p> : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}

export function SectionShell({ children, className }: SectionShellProps) {
  return <section className={cn("section-shell", className)}>{children}</section>;
}

export function SplitLayout({
  primary,
  secondary,
  className,
}: SplitLayoutProps) {
  return <div className={cn("split-layout", className)}>{primary}{secondary}</div>;
}
