"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const REFRESH_INTERVAL_SECONDS = 300;

function formatSeconds(seconds) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

export default function AutoRefreshControls() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(REFRESH_INTERVAL_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          router.refresh();
          return REFRESH_INTERVAL_SECONDS;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const refreshNow = () => {
    router.refresh();
    setSecondsLeft(REFRESH_INTERVAL_SECONDS);
  };

  return (
    <div className="refresh-controls" aria-live="polite">
      <span>Auto refresh in: {formatSeconds(secondsLeft)}</span>
      <button type="button" onClick={refreshNow}>
        Refresh now
      </button>
    </div>
  );
}
