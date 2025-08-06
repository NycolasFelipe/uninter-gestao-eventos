import { BiSolidSchool } from "react-icons/bi";
import { BsMailbox2Flag } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaRegCalendarPlus } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { MdOutlineManageAccounts } from "react-icons/md";

interface Action {
  path: string;
  label: string;
  icon: React.ComponentType;
  variant: string;
  requiredPermission?: string;
}

const ACTIONS: Action[] = [
  {
    path: "/manage/events",
    label: "Planejar Novo Evento",
    icon: FaRegCalendarPlus,
    variant: "primary",
    requiredPermission: "events.post"
  },
  {
    path: "/manage/subscriptions",
    label: "Gerenciar Inscrições",
    icon: BsMailbox2Flag,
    variant: "secondary",
    requiredPermission: "subscriptions.post"
  },
  {
    path: "/manage/users",
    label: "Gerenciar Usuários",
    icon: CgProfile,
    variant: "secondary",
    requiredPermission: "users.post"
  },
  {
    path: "/manage/schools",
    label: "Gerenciar Escolas",
    icon: BiSolidSchool,
    variant: "secondary",
    requiredPermission: "schools.post"
  },
  {
    path: "/manage/venues",
    label: "Gerenciar Locais",
    icon: FiHome,
    variant: "secondary",
    requiredPermission: "venues.post"
  },
  {
    path: "/manage/roles",
    label: "Gerenciar Permissões",
    icon: MdOutlineManageAccounts,
    variant: "secondary",
    requiredPermission: "roles.post"
  }
];

export default ACTIONS;