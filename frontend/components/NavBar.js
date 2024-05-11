
"use client";

import Link from "next/link";
import { Navbar } from "flowbite-react";

export function MyNavBar() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">The ultimate land and real estate marketplace</span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Link href="/">
          Home
        </Link>
        <Link  href="/MyListings">
          My Listings
        </Link>
        
        <Link href="/MyProposals">My Proposals</Link>
        <Link href="oracle">Oracle</Link>

      </Navbar.Collapse>
    </Navbar>
  );
}
