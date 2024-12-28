import { LuAlignLeft } from "react-icons/lu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserIcon from "./UserIcon";
import { links } from "@/utils/links";
import SignOutLink from "./SignOutLink";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { checkUserRole } from "@/utils/actions";
import { createElement } from "react";

const SheetLinks = async () => {
  const { isAdminUser } = await checkUserRole();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex max-w-[100px] gap-4">
          <LuAlignLeft className="h-6 w-6" />
          <UserIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="font-antonio tracking-wide">Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-4">
          <SignedOut>
            <div className="flex flex-col gap-2">
              <SignInButton mode="modal">
                <SheetClose asChild>
                  <Button variant="outline" className="w-full justify-start">
                    Login
                  </Button>
                </SheetClose>
              </SignInButton>
              <SignUpButton mode="modal">
                <SheetClose asChild>
                  <Button variant="outline" className="w-full justify-start">
                    Register
                  </Button>
                </SheetClose>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <nav className="flex flex-col gap-2">
              {links.map((link) => {
                if (link.label === "admin" && !isAdminUser) return null;
                return (
                  <SheetClose asChild key={link.href}>
                    <Link href={link.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 capitalize"
                      >
                        {link.label === "profile" ? (
                          <UserIcon />
                        ) : (
                          createElement(link.icon, { size: 20 })
                        )}
                        {link.label}
                      </Button>
                    </Link>
                  </SheetClose>
                );
              })}
              <Separator className="my-4" />
              <SheetClose asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <SignOutLink />
                </Button>
              </SheetClose>
            </nav>
          </SignedIn>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetLinks;
