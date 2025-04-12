import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { DownloadIcon, Bell } from "lucide-react";

interface HeaderProps {
  activePage: "create" | "saved";
}

export default function Header({ activePage }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Proposal Builder</h1>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activePage === "create" 
                    ? "border-primary text-gray-900" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}>
                  Create Proposal
                </a>
              </Link>
              <Link href="/saved-proposals">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activePage === "saved" 
                    ? "border-primary text-gray-900" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}>
                  Saved Proposals
                </a>
              </Link>
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              size="sm"
              className="ml-3 flex items-center gap-1"
              disabled={activePage !== "create"}
              onClick={() => window.print()}
            >
              <DownloadIcon className="h-4 w-4" />
              <span>Export PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
