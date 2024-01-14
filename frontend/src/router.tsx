import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
(
  <Suspense fallback={<SuspenseLoader noLoadProgress />} >
    <Component {...props} />
  </Suspense>
);

// Employees

const Employees = Loader(
  lazy(() => import('src/content/pages/Employees/Employees'))
);
const EmployeeEdit = Loader(
  lazy(() => import('src/content/pages/Employees/Edit'))
);
const EmployeeAdd = Loader(
  lazy(() => import('src/content/pages/Employees/Add'))
);

// Groups 
const Groups = Loader(
  lazy(() => import('src/content/pages/Groups/Groups'))
);

const GroupAdd = Loader(
  lazy(() => import('src/content/pages/Groups/Add'))
)

const GroupEdit = Loader(
  lazy(() => import('src/content/pages/Groups/Edit'))
)

// Auth
const AuthSignin = Loader(
  lazy(() => import('src/content/pages/Auth/Signin'))
);

// Dashboards

const TasksDashboard = Loader(lazy(() => import('src/content/dashboards/Tasks')));


// Status

const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/content/pages/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('src/content/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/content/pages/Status/Maintenance'))
);

const routes: RouteObject[] = [
  {
    path: '*',
    element: <BaseLayout />,
    children: [
      {
        path: '*',
        element: <Status404 />
      }
    ]
  },

  {
    path: 'auth',
    element: <BaseLayout />,
    children: [
      {
        path: 'signin',
        element: <AuthSignin />
      }
    ]
  },

  {
    path: 'employees',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Employees />
      },
      {
        path: 'edit/:id',
        element: <EmployeeEdit />
      }
    ]
  },
  {
    path: 'employees-add',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <EmployeeAdd />
      },
    ]
  },
  {
    path: 'groups',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Groups />
      },
      {
        path: 'edit/:id',
        element: <GroupEdit />
      }
    ]
  },
  {
    path: 'groups-add',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <GroupAdd />
      }
    ]
  },


  {
    path: '',
    element: <SidebarLayout />,
    children: [
      {
        path: 'overview',
        element: <Navigate to="/" replace />
      },
      {
        path: 'status',
        children: [
          {
            path: '',
            element: <Navigate to="404" replace />
          },
          {
            path: '500',
            element: <Status500 />
          },
          {
            path: 'maintenance',
            element: <StatusMaintenance />
          },
          {
            path: 'coming-soon',
            element: <StatusComingSoon />
          }
        ]
      }
    ]
  },

];

export default routes;
