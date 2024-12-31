import { t } from '@lingui/core/macro';
import {
  DropdownItem,
  DropdownSeparator,
} from '@patternfly/react-core/deprecated';
import { StatefulDropdown } from 'src/components';
import { availableLanguages, language, languageNames } from 'src/l10n';

export function LanguageSwitcher(_props) {
  const currentLanguage = languageNames[language] || language;

  return (
    <StatefulDropdown
      ariaLabel={t`Select language`}
      data-cy='language-dropdown'
      defaultText={currentLanguage}
      toggleType='icon'
      items={[
        <DropdownItem isDisabled key='current'>
          {window.localStorage.override_l10n
            ? t`${currentLanguage} (current)`
            : t`${currentLanguage} (browser default)`}
        </DropdownItem>,
        <DropdownSeparator key='separator1' />,
        ...availableLanguages.map((lang) => (
          <DropdownItem
            key={lang}
            href={`?lang=${lang}`}
            isDisabled={lang === language}
          >
            {languageNames[lang] || lang}
          </DropdownItem>
        )),
        <DropdownSeparator key='separator2' />,
        <DropdownItem
          key='unset'
          href='?lang='
          isDisabled={!window.localStorage.override_l10n}
        >
          {t`Reset to browser defaults`}
        </DropdownItem>,
      ]}
    />
  );
}
