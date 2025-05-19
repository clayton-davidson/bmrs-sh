"use client";

import { useState, useEffect, useRef } from "react";

type SSEState = {
  isS1: boolean;
  isS2: boolean;
  isS3: boolean;
  isS4: boolean;
  isS5: boolean;
  isS6: boolean;
  isS7: boolean;
  isS7Hmd: boolean;
  isS8: boolean;
  isS9: boolean;
  isS9Hmd: boolean;
  isS10: boolean;
  isS11: boolean;
  isS11Hmd: boolean;
  isS12: boolean;
  isS13: boolean;
  isS13Hmd: boolean;
  isS14: boolean;
  isS15: boolean;
  isS15Hmd: boolean;
  isRt2: boolean;
  isRt2Hmd: boolean;
  layerCount: number;
  barCount: number;
  cs1BladeCuts: number;
  cs2BladeCuts: number;
  cs1DiameterInches: number;
  cs2DiameterInches: number;
  cs1Length: { feet: number; inches: number };
  cs2Length: { feet: number; inches: number };
  stackerALength: { feet: number; inches: number };
  stackerBLength: { feet: number; inches: number };
};

const plcPathToStateMap = {
  "MILLSPD.RMTRK.Mac[1].bStatoMac.3": "isS1",
  "MILLSPD.RMTRK.Mac[2].bStatoMac.3": "isS2",
  "MILLSPD.RMTRK.Mac[3].bStatoMac.3": "isS3",
  "MILLSPD.RMTRK.Mac[4].bStatoMac.3": "isS4",
  "MILLSPD.RMTRK.Mac[5].bStatoMac.3": "isS5",
  "MILLSPD.RMTRK.Mac[6].bStatoMac.3": "isS6",
  "MILLSPD.RMTRK.Mac[7].bStatoMac.3": "isS7",
  "MILLSPD.RMTRK.Mac[8].bStatoMac.3": "isS8",
  "MILLSPD.RMTRK.Mac[9].bStatoMac.3": "isS9",
  "MILLSPD.RMTRK.Mac[10].bStatoMac.3": "isS10",
  "MILLSPD.RMTRK.Mac[11].bStatoMac.3": "isS11",
  "MILLSPD.RMTRK.Mac[12].bStatoMac.3": "isS12",
  "MILLSPD.RMTRK.Mac[13].bStatoMac.3": "isS13",
  "MILLSPD.RMTRK.Mac[14].bStatoMac.3": "isS14",
  "MILLSPD.RMTRK.Mac[15].bStatoMac.3": "isS15",
  "MILLSPD.RMTRK.Local:12:I.Data.7": "isRt2Hmd",
  "MILLSPD.RMTRK.Local:12:I.Data.8": "isRt2",
  "MILLSPD.RMTRK.Local:12:I.Data.9": "isS7Hmd",
  "MILLSPD.RMTRK.Local:12:I.Data.11": "isS9Hmd",
  "MILLSPD.RMTRK.Local:12:I.Data.13": "isS11Hmd",
  "MILLSPD.RMTRK.Local:12:I.Data.16": "isS13Hmd",
  "MILLSPD.RMTRK.Local:12:I.Data.23": "isS15Hmd",
  "SAWS.SAWS.N814[32]": "layerCount",
  "SAWS.SAWS.N814[33]": "barCount",
  "SAWS.SAWS.N220[67]": "cs1BladeCuts",
  "SAWS.SAWS.N220[162]": "cs2BladeCuts",
  "SAWS.SAWS.N220[66]": "cs1DiameterInches",
  "SAWS.SAWS.N220[160]": "cs2DiameterInches",
  "SAWS.SAWS.N201[41]": "cs1Length",
  "SAWS.SAWS.N201[42]": "cs2Length",
  "STACKER.STACKER.N201[12]": "stackerALength",
  "STACKER.STACKER.N201[14]": "stackerBLength",
};

// Initial state
const initialState: SSEState = {
  isS1: false,
  isS2: false,
  isS3: false,
  isS4: false,
  isS5: false,
  isS6: false,
  isS7: false,
  isS7Hmd: false,
  isS8: false,
  isS9: false,
  isS9Hmd: false,
  isS10: false,
  isS11: false,
  isS11Hmd: false,
  isS12: false,
  isS13: false,
  isS13Hmd: false,
  isS14: false,
  isS15: false,
  isS15Hmd: false,
  isRt2: false,
  isRt2Hmd: false,
  layerCount: 0,
  barCount: 0,
  cs1BladeCuts: 0,
  cs2BladeCuts: 0,
  cs1DiameterInches: 0,
  cs2DiameterInches: 0,
  cs1Length: { feet: 0, inches: 0 },
  cs2Length: { feet: 0, inches: 0 },
  stackerALength: { feet: 0, inches: 0 },
  stackerBLength: { feet: 0, inches: 0 },
};

export function useSSEConnection(apiUrl: string) {
  const [state, setState] = useState<SSEState>(initialState);
  const [loading, setLoading] = useState(true);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Function to connect to SSE
    function connect() {
      setLoading(true);

      // Close any existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Create new connection
      const eventSource = new EventSource(apiUrl);
      eventSourceRef.current = eventSource;

      // Connection opened successfully
      eventSource.onopen = () => {
        setLoading(false);
      };

      // Handle connection errors
      eventSource.onerror = () => {
        console.error("SSE connection error");
        eventSource.close();

        // Reconnect after 10 seconds
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
        }

        reconnectTimerRef.current = setTimeout(() => {
          connect();
        }, 10000);
      };

      // Set up event listeners for each PLC path
      Object.entries(plcPathToStateMap).forEach(([path, stateProp]) => {
        eventSource.addEventListener(path, (e) => {
          try {
            const data = JSON.parse(e.data);

            setState((prevState) => {
              // Handle length values with feet and inches
              if (path.includes("N201[")) {
                return {
                  ...prevState,
                  [stateProp]: { feet: data.feet, inches: data.inches },
                };
              }
              // Handle other values
              else {
                return {
                  ...prevState,
                  [stateProp]: data.value,
                };
              }
            });
          } catch (err) {
            console.error(`Error parsing data for ${path}:`, err);
          }
        });
      });
    }

    // Start initial connection
    connect();

    // Handle visibility changes
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        if (
          !eventSourceRef.current ||
          eventSourceRef.current.readyState === EventSource.CLOSED
        ) {
          console.log("Page visible - reconnecting");
          connect();
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [apiUrl]); // Only apiUrl as dependency

  return { state, loading };
}
