import React, { type HTMLAttributes } from 'react';

interface IProps extends HTMLAttributes<HTMLDivElement> {
  text: string;
}

const HTMLComment = ({ text, ...props }: IProps) => (
  <div {...props} dangerouslySetInnerHTML={{ __html: `<!-- ${text} -->` }} />
);

export const UIVersion = () => (
  <HTMLComment
    id='pulp-ui-version'
    text={`pulp-ui ${JSON.stringify(UI_BUILD_INFO, null, 2)}`}
  />
);
