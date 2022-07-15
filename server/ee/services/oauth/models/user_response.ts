export default interface UserResponse {
  userSSOId: string;
  firstName?: string;
  lastName?: string;
  email: string;
  sso: string;
  is_admin?: boolean;
}
