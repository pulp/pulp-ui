import { t } from '@lingui/macro';
import {
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  ExpandableSection,
} from '@patternfly/react-core';
import React from 'react';
import { PulpCopyButton } from 'src/components/pulp-copy-button';
import { PulpDownloadButton } from 'src/components/pulp-download-button';

export const PulpCodeBlock = ({
  code,
  filename,
}: {
  code: string;
  filename?: string;
}) => {
  const name = filename ? filename : 'pulpui-codeblock-download';
  const actions = (
    <CodeBlockAction>
      <PulpDownloadButton text={code} filename={name} />
      <PulpCopyButton text={code} />
    </CodeBlockAction>
  );

  return (
    <ExpandableSection
      variant='truncate'
      truncateMaxLines={3}
      toggleTextCollapsed={t`Show more`}
      toggleTextExpanded={t`Show less`}
    >
      <CodeBlock actions={actions}>
        <CodeBlockCode>{code}</CodeBlockCode>
      </CodeBlock>
    </ExpandableSection>
  );
};
