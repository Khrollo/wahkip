"use client";
import HorizontalRow from "./HorizontalRow";

export default function ExploreRows() {
  return (
    <>
      <HorizontalRow title="Music in Kingston" query="city=Kingston&tags=music&limit=12" />
      <HorizontalRow title="Food & Markets" query="city=Kingston&tags=food&limit=12" />
      <HorizontalRow title="Culture & Wellness" query="city=Kingston&tags=mental%20health,culture&limit=12" />
    </>
  );
}

