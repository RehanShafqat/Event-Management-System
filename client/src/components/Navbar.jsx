import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
  } from "@/components/ui/navigation-menu"
  import { Button } from "@/components/ui/button"
  import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
  import { Menu } from "lucide-react"
  import softec from "../assets/Softec_pic.png"
  const Navbar = () => {
    const navCom=["Home","About","Contact","Details","LogOut","Login"]
    return (
      <header className="ml-[2px] border-b px-4 py-3 flex bg-black rounded-sm mr-[2px]"> 
      <img src={softec} className="xl:w-[10vw] l:w-[15vw] md:w-[20vw] sm:w-[20vw] w-[40vw]" alt="" />
  
        <NavigationMenu className="hidden md:flex md:justify-center md:items-center w-screen ">
          <NavigationMenuList className="flex md:justify-between md:items-center xl:w-[88vw] l:w-[83vw] md:w-[78vw] pl-[5px] pr-[5px]">
            {navCom.map((item, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink href={`/${item.toLowerCase()}`}>{item}</NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
  
        <Sheet className="md:hidden w-60vw">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden absolute right-2 top-1.5 bg-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pl-[9px]">
            <nav className="flex flex-col space-y-4 mt-6">
                {navCom.map((item,index)=>{
                    return (<>
                    <a href={`/${item.toLowerCase()}`} key={index} className="hover:bg-black hover:text-white border-b text-sm hover:text-lg">{item}</a>
                    
                    </>)
                })}
            </nav>
          </SheetContent>
        </Sheet>
      </header>
    );
  };
  
  export default Navbar;