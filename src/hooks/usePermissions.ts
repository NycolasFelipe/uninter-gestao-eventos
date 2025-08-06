import { useQuery } from '@tanstack/react-query';
import UserController from '../controllers/UserController';

export const usePermissions = () => {
  const { data: myDetails } = useQuery({
    queryKey: ["my-details"],
    queryFn: async () => await UserController.getMyDetails()
  });

  const permissions = myDetails?.role.permissions ?? [];

  const hasPermission = (permissionName: string) =>
    permissions.some(p => p.permissionName === permissionName);

  return { hasPermission };
}