import type { IResourceItem } from "@refinedev/core";

import {
  AuditOutlined,
  BookOutlined,
  CalendarOutlined,
  ContainerOutlined,
  CrownOutlined,
  DashboardOutlined, FormOutlined,
  ProjectOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";

export const resources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Dashboard",
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <DashboardOutlined />,
    },
  },
  {
    name: "knowledge base",
    list: "/knowledge-base",
    // create: "/contacts/create",
    // edit: "/contacts/edit/:id",
    // show: "/contacts/show/:id",
    meta: {
      label: "Knowledge base",
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <BookOutlined />,
    },
  },
  {
    name: "Emission factor",
    list: "/emission-factor",
    meta: {
      label: "Emission factor",
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <AuditOutlined />,
    },
  },
  {
    name: "blog",
    list: "/blogs",
    meta: {
      label: "Blogs",
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <FormOutlined />,
    },
  },
  {
    name: "contacts",
    list: "/contacts",
    create: "/contacts/create",
    edit: "/contacts/edit/:id",
    show: "/contacts/show/:id",
    meta: {
      label: "Contacts",
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <TeamOutlined />,
    },
  },
];
