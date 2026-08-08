import { UserButton } from "@clerk/react";

export function AppUserMenu() {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "size-8",
        },
      }}
    />
  );
}
