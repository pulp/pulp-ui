export class ModelPermissionsType {
  [key: string]: {
    global_description: string;
    has_model_permission: boolean;
    name: string;
    object_description: string;
    ui_category: string;
  };
}

export class GroupType {
  id: number;
  name: string;
  object_roles?: string[];
}

export class UserType {
  auth_provider?: string[];
  date_joined?: string;
  email?: string;
  first_name?: string;
  groups: GroupType[];
  hidden_fields?;
  id?: number;
  is_active?: boolean;
  is_anonymous?: boolean;
  is_staff?: boolean;
  last_name?: string;
  model_permissions?: ModelPermissionsType;
  password?: string;
  prn?: string;
  pulp_href?: string;
  username: string;
}
