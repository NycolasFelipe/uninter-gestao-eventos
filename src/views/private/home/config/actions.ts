// Icons
import { BiSolidSchool } from "react-icons/bi";
import { BsMailbox2Flag } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaRegCalendarPlus } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { MdOutlineManageAccounts } from "react-icons/md";

const ACTIONS = [
  {
    path: "/manage/events",
    label: "Planejar Novo Evento",
    icon: FaRegCalendarPlus,
    variant: "primary"
  },
  {
    path: "/manage/subscriptions",
    label: "Gerenciar Inscrições",
    icon: BsMailbox2Flag,
    variant: "secondary"
  },
  {
    path: "/manage/users",
    label: "Gerenciar Usuários",
    icon: CgProfile,
    variant: "secondary"
  },
  {
    path: "/manage/schools",
    label: "Gerenciar Escolas",
    icon: BiSolidSchool,
    variant: "secondary"
  },
  {
    path: "/manage/venues",
    label: "Gerenciar Locais",
    icon: FiHome,
    variant: "secondary"
  },
  {
    path: "/manage/roles",
    label: "Gerenciar Permissões",
    icon: MdOutlineManageAccounts,
    variant: "secondary"
  }
];

export default ACTIONS;