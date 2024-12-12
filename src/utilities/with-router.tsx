import { useLocation, useNavigate, useParams } from 'react-router';
import { ParamHelper } from './param-helper';

// compatibility layer between react-router v6 and class components

// differences from v5:
// history.push -> navigate
// location -> location
// match.params -> routeParams

export class RouteProps {
  location: ReturnType<typeof useLocation>;
  navigate: ReturnType<typeof useNavigate>;
  routeParams: Record<string, string>;
}

export const withRouter = (ClassComponent) => {
  const WithRouter = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    return (
      <ClassComponent
        location={location}
        navigate={navigate}
        routeParams={params}
      />
    );
  };

  WithRouter.displayName = `withRouter(${
    ClassComponent.displayName || ClassComponent.name
  })`;

  return WithRouter;
};

export function useQueryParams(): Record<string, string> {
  const location = useLocation();
  return ParamHelper.parseParamString(location.search);
}
