/* eslint react/jsx-key: off */
import * as React from 'react';
import { Admin, Resource } from 'shadmin';
import { createRoot } from 'react-dom/client';

import authProvider from './authProvider';
import comments from './comments';
import dataProvider from './dataProvider';
import i18nProvider from './i18nProvider';
import Layout from './Layout';
import posts from './posts';
import users from './users';
import tags from './tags';
import { queryClient } from './queryClient';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <Admin
            authProvider={authProvider}
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            queryClient={queryClient}
            title="Example Admin"
            layout={Layout}
        >
            <Resource {...posts} />
            <Resource {...comments} />
            <Resource {...users} />
            <Resource {...tags} />
        </Admin>
    </React.StrictMode>
);
