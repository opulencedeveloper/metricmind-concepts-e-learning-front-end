import { ReactNode } from 'react';

export interface CourseBrowseSidebarProps {
  categories: string[];
}

export interface BrowseLayoutProps {
  children: ReactNode;
}

export interface NavLinkProps {
  href: string;
  label: string;
  icon: string;
}

export interface AdminLayoutProps {
  children: ReactNode;
}
