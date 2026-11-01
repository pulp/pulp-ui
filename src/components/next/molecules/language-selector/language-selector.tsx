import {
  MenuToggle,
  Select,
  SelectList,
  SelectOption,
} from '@patternfly/react-core';
import GlobeIcon from '@patternfly/react-icons/dist/esm/icons/globe-icon';
import { type FC, useState } from 'react';
import { isLanguageCode } from '../../../../lib/l10n/is-language-code';
import {
  type LanguageCode,
  languageNames,
} from '../../../../lib/l10n/languages';
import './language-selector.css';

interface LanguageSelectorProps {
  lang: LanguageCode;
  onChange: (lang: LanguageCode) => void;
}

const LanguageSelector: FC<LanguageSelectorProps> = ({ lang, onChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Select
      className='pulp-language-selector__menu'
      isOpen={isOpen}
      selected={lang}
      onOpenChange={setIsOpen}
      onSelect={(_, value) => {
        if (isLanguageCode(value)) {
          onChange(value);
        }
        setIsOpen(false);
      }}
      toggle={(toggleRef) => (
        <MenuToggle
          ref={toggleRef}
          icon={<GlobeIcon />}
          variant='plainText'
          className='pulp-language-selector__toggle'
          isExpanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {languageNames[lang]}
        </MenuToggle>
      )}
    >
      <SelectList>
        {Object.entries(languageNames).map(([code, name], idx) => (
          <SelectOption
            key={`${code}-${idx}`}
            value={code}
            isSelected={code === lang}
          >
            {name}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};

export { LanguageSelector };
