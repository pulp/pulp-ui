import { t } from '@lingui/macro';
import { Nav, NavExpandable, NavItem } from '@patternfly/react-core';
import { reject, some } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ExternalLink, NavList } from 'src/components';
import { Paths, formatPath } from 'src/paths';

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

function standaloneMenu() {
  return [
    menuItem(t`Status`, {
      url: formatPath(Paths.status),
    }),
    menuItem(t`Search`, {
      url: formatPath(Paths.search),
      condition: ({ user }) => !!user,
    }),
    menuSection('Pulp Ansible', { condition: ({ user }) => !!user }, [
      /* menuItem(t`Collections`, {
        url: formatPath(Paths.collections),
        alternativeUrls: [altPath('/repo/:repo')],
      }),*/
      /* menuItem(t`Namespaces`, {
        url: formatPath(Paths.namespaces),
        alternativeUrls: [altPath(Paths.myNamespaces)],
      }), */
      menuItem(t`Repositories`, {
        url: formatPath(Paths.ansibleRepositories),
      }),
      menuItem(t`Remotes`, {
        url: formatPath(Paths.ansibleRemotes),
      }),
      /*menuItem(t`Approvals`, {
        url: formatPath(Paths.approvals),
      }),*/
      /*menuItem(t`Imports`, {
        url: formatPath(Paths.myImports),
      }),*/
    ]),
    /* menuSection('Pulp Container', { condition: ({ user }) => !!user }, [
      menuItem(t`Containers`, {
        url: formatPath(Paths.executionEnvironments),
      }),
      menuItem(t`Remote Registries`, {
        url: formatPath(Paths.executionEnvironmentsRegistries),
      }),
    ]),*/
    menuItem(t`Task Management`, {
      url: formatPath(Paths.taskList),
      alternativeUrls: [altPath(Paths.taskDetail)],
      condition: ({ user }) => !!user,
    }),
    menuItem(t`API token`, {
      url: formatPath(Paths.token),
      condition: ({ user }) => !!user,
    }),
    menuItem(t`Signature Keys`, {
      url: formatPath(Paths.signatureKeys),
      condition: ({ user }) => !!user,
    }),
    menuSection(t`User Access`, { condition: ({ user }) => !!user }, [
      menuItem(t`Users`, {
        url: formatPath(Paths.userList),
      }),
      menuItem(t`Groups`, {
        url: formatPath(Paths.groupList),
        alternativeUrls: [altPath(Paths.groupDetail)],
      }),
      menuItem(t`Roles`, {
        url: formatPath(Paths.roleList),
        alternativeUrls: [altPath(Paths.roleEdit)],
      }),
    ]),
    menuItem(t`About project`, {
      url: formatPath(Paths.aboutProject),
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
  return section.condition(context) ? (
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
  ) : null;
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

export const StandaloneMenu = ({ context }: { context }) => {
  const [expandedSections, setExpandedSections] = useState([]);

  const location = useLocation();
  const [menu, setMenu] = useState([]);

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
          context={context}
          expandedSections={expandedSections}
        />
      </NavList>
    </Nav>
  );
};
