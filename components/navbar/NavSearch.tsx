"use client";

import { Input } from "../ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";

function NavSearch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [search, setSearch] = useState(
    searchParams?.get("search")?.toString() || "",
  );
  // dont search on every keypress but
  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value) {
      // if search is not empty, add it to the url
      params.set("search", value);
    } else {
      params.delete("search");
    }
    replace(`/?${params.toString()}`);
  }, 300);
  useEffect(() => {
    if (!searchParams?.get("search")) {
      setSearch("");
    }
  }, [searchParams]);
  return (
    <Input
      type="search"
      placeholder="find an event in..."
      className="max-w-xs dark:bg-muted"
      onChange={(e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
      }}
      value={search}
    />
  );
}
export default NavSearch;
