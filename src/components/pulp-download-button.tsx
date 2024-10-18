import React from 'react';
import DownloadIcon from '@patternfly/react-icons/dist/esm/icons/download-icon';
import { Button } from '@patternfly/react-core';
import { downloadString } from "src/utilities";

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
      aria-label={filename + '-download'}
      onClick={() => downloadString(text, filename)}
    >
      <DownloadIcon />
    </Button>
  );
};
