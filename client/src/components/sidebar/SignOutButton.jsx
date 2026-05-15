import { LogOut } from "lucide-react";

function SignOutButton() {
  return (
    <button className="flex w-full cursor-pointer items-center rounded-md px-2 hover:bg-[#ebebeb] md:h-8">
      <LogOut color="#7c7c7c" size={20} strokeWidth={2} />
      <h3 className="ms-3.5 text-sm">Sign out</h3>
    </button>
  );
}

export default SignOutButton;
