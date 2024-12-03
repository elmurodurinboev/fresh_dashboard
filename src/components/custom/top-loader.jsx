import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {Progress} from "@/components/ui/progress.jsx";

export default function TopLoader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setProgress(0);
    setIsLoading(true);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 15;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [location]);
  return (
    isLoading && (
      <div className="fixed top-0 left-0 w-full z-50">
        <Progress value={progress} className="w-full h-[3px] bg-transparent" />
      </div>
    )
  );
}