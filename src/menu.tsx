import { t } from '@lingui/macro';
import { Nav, NavExpandable, NavItem } from '@patternfly/react-core';
import { reject, some } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ExternalLink, NavList } from 'src/components';
import { plugin_versions } from 'src/utilities';
import { Paths, formatPath } from './paths';
import { useUserContext } from './user-context';

const menuItem = (name, options = {}) => ({
  active: false,
  condition: () => true,
  ...options,
  type: 'item',
  name,
});

const menuSection = (name, options = {}, items = []) => ({
  active: false,
  condition: (...params) => some(items, (item) => item.condition(...params)), // any visible items inside
  ...options,
  type: 'section',
  name,
  items,
});

const altPath = (p) => formatPath(p, {}, null, { ignoreMissing: true });

// condition: loggedIn OR condition: and(loggedIn, hasPlugin('rpm'))
const loggedIn = ({ user }) => !!user;
const hasPlugin =
  (name) =>
  ({ plugins }) =>
    !!plugins[name];
const and =
  (...conditions) =>
  (context) =>
    conditions.every((condition) => condition(context));
// const or = (...conditions) => (context) => conditions.some((condition) => condition(context));

// FIXME: fix those screens
const BROKEN = () => false;

function standaloneMenu() {
  return [
    menuItem(t`Status`, {
      url: formatPath(Paths.core.status),
    }),
    menuItem(t`Login`, {
      url: formatPath(Paths.meta.login),
      condition: ({ user }) => !user, // not logged in
    }),
    menuItem(t`Search`, {
      url: formatPath(Paths.meta.search),
      condition: and(BROKEN, loggedIn),
    }),
    menuSection(
      'Pulp Ansible',
      { condition: and(loggedIn, hasPlugin('ansible')) },
      [
        menuItem(t`Collections`, {
          url: formatPath(Paths.ansible.collection.list),
          alternativeUrls: [altPath('/repo/:repo')],
          condition: BROKEN,
        }),
        menuItem(t`Namespaces`, {
          url: formatPath(Paths.ansible.namespace.list),
          alternativeUrls: [altPath(Paths.ansible.namespace.mine)],
          condition: BROKEN,
        }),
        menuItem(t`Repositories`, {
          url: formatPath(Paths.ansible.repository.list),
        }),
        menuItem(t`Remotes`, {
          url: formatPath(Paths.ansible.remote.list),
        }),
        menuItem(t`Approvals`, {
          url: formatPath(Paths.ansible.approvals),
          condition: BROKEN,
        }),
        menuItem(t`Imports`, {
          url: formatPath(Paths.ansible.imports),
          condition: BROKEN,
        }),
      ],
    ),
    menuSection(
      'Pulp Container',
      { condition: and(loggedIn, hasPlugin('container')) },
      [
        menuItem(t`Containers`, {
          url: formatPath(Paths.container.repository.list),
          condition: BROKEN,
        }),
        menuItem(t`Remote Registries`, {
          url: formatPath(Paths.container.remote.list),
          condition: BROKEN,
        }),
      ],
    ),
    menuSection('Pulp RPM', { condition: and(loggedIn, hasPlugin('rpm')) }, [
      menuItem(t`Search`, {
        url: formatPath(Paths.rpm.search),
      }),
      menuItem(t`RPMs`, {
        url: formatPath(Paths.rpm.package.list),
      }),
    ]),
    menuItem(t`Task Management`, {
      url: formatPath(Paths.core.task.list),
      alternativeUrls: [altPath(Paths.core.task.detail)],
      condition: loggedIn,
    }),
    menuItem(t`Signature Keys`, {
      url: formatPath(Paths.core.signature_keys),
      condition: loggedIn,
    }),
    menuSection(t`User Access`, { condition: loggedIn }, [
      menuItem(t`Users`, {
        url: formatPath(Paths.core.user.list),
      }),
      menuItem(t`Groups`, {
        url: formatPath(Paths.core.group.list),
        alternativeUrls: [altPath(Paths.core.group.detail)],
      }),
      menuItem(t`Roles`, {
        url: formatPath(Paths.core.role.list),
        alternativeUrls: [altPath(Paths.core.role.edit)],
      }),
    ]),
    menuItem(t`About project`, {
      url: formatPath(Paths.meta.about),
    }),
  ];
}

function activateMenu(items, pathname) {
  // ensure no /:var at the end
  const normalize = (s) => s.replace(/\/$/, '').replace(/(\/:[^/:]+)+$/, '');
  const normalizedPathname = normalize(pathname).replace(
    /\/repo\/[^/]+\//,
    '/repo/:repo/',
  );

  items.forEach((item) => {
    item.active =
      item.type === 'section'
        ? activateMenu(item.items, pathname)
        : normalizedPathname.startsWith(normalize(item.url)) ||
          (item.alternativeUrls?.length &&
            item.alternativeUrls.some((url) =>
              normalizedPathname.startsWith(normalize(url)),
            ));
  });

  return some(items, 'active');
}

function ItemOrSection({
  item,
  context,
  expandedSections,
}: {
  item;
  context;
  expandedSections;
}) {
  return item.type === 'section' ? (
    <MenuSection
      section={item}
      context={context}
      expandedSections={expandedSections}
    />
  ) : (
    <MenuItem item={item} context={context} />
  );
}

function MenuItem({ item, context }: { item; context }) {
  return item.condition(context) ? (
    <NavItem
      isActive={item.active}
      onClick={(e) => {
        if (item.onclick) {
          item.onclick();
        }
        e.stopPropagation();
      }}
    >
      {item.url && item.external ? (
        <ExternalLink
          data-cy={`pulp-menu-item-${item.name}`}
          href={item.url}
          variant='nav'
        >
          {item.name}
        </ExternalLink>
      ) : item.url ? (
        <Link to={item.url} data-cy={`pulp-menu-item-${item.name}`}>
          {item.name}
        </Link>
      ) : (
        item.name
      )}
    </NavItem>
  ) : null;
}

function MenuSection({
  section,
  context,
  expandedSections,
}: {
  section;
  context;
  expandedSections;
}) {
  if (!section.condition(context)) {
    return null;
  }

  if (
    !section.items ||
    !section.items.find((item) => item.condition(context))
  ) {
    return null;
  }

  return (
    <NavExpandable
      title={section.name}
      groupId={section.name}
      isActive={section.active}
      isExpanded={expandedSections.includes(section.name)}
      data-cy={`pulp-menu-section-${section.name}`}
    >
      <Menu
        items={section.items}
        context={context}
        expandedSections={expandedSections}
      />
    </NavExpandable>
  );
}

function Menu({
  items,
  context,
  expandedSections,
}: {
  items;
  context;
  expandedSections;
}) {
  return (
    <>
      {items.map((item) => (
        <ItemOrSection
          key={item.url || item.name}
          item={item}
          context={context}
          expandedSections={expandedSections}
        />
      ))}
    </>
  );
}

function usePlugins() {
  const [plugins, setPlugins] = useState({});

  useEffect(() => {
    plugin_versions().then((arr) =>
      setPlugins(
        Object.fromEntries(arr.map(({ name, version }) => [name, version])),
      ),
    );
  }, []);

  return plugins;
}

export const StandaloneMenu = () => {
  const [expandedSections, setExpandedSections] = useState([]);

  const location = useLocation();
  const [menu, setMenu] = useState([]);

  const { credentials } = useUserContext();

  const plugins = usePlugins();

  useEffect(() => {
    setMenu(standaloneMenu());
  }, []);

  useEffect(() => {
    activateMenu(menu, location.pathname);
    setExpandedSections(
      menu.filter((i) => i.type === 'section' && i.active).map((i) => i.name),
    );
  }, [menu, location.pathname]);

  const onToggle = ({ groupId, isExpanded }) => {
    setExpandedSections(
      isExpanded
        ? [...expandedSections, groupId]
        : reject(expandedSections, (name) => name === groupId),
    );
  };

  return (
    <Nav onToggle={(_event, data) => onToggle(data)}>
      <NavList>
        <Menu
          items={menu}
          context={{ user: credentials, plugins }}
          expandedSections={expandedSections}
        />
      </NavList>
    </Nav>
  );
};
