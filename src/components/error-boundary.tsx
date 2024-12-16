import { isRouteErrorResponse, useRouteError } from 'react-router';
import { NotFound } from 'src/components';

export const ErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status == 404) {
    return <NotFound />;
  } else {
    console.error(error);
    return <div>Something went horribly wrong!</div>;
  }
};
