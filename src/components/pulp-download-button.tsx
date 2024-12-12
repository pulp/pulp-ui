import { t } from '@lingui/macro';
import { Button } from '@patternfly/react-core';
import DownloadIcon from '@patternfly/react-icons/dist/esm/icons/download-icon';
import { downloadString } from 'src/utilities';

export const PulpDownloadButton = ({
  text,
  filename,
}: {
  text: string;
  filename: string;
}) => {
  return (
    <Button
      variant='plain'
      aria-label={t`Download ${filename}`}
      onClick={() => downloadString(text, filename)}
    >
      <DownloadIcon />
    </Button>
  );
};
