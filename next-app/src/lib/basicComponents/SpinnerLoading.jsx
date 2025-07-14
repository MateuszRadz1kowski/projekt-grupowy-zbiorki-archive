"use client";
import { Loader, LoaderCircle } from "lucide-react";
import React from "react";

export default function SpinnerLoading() {
  const YouTubeEmbed = ({ videoId }) => {
    return (
      <div className="video-container">
        <iframe
          width="1600"
          height="600"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>
    );
  };
  
  return (
    <div>
      <LoaderCircle className="animate-spin" />
      {/* <YouTubeEmbed videoId="7ghSziUQnhs" /> */}
    </div>
  );
}
