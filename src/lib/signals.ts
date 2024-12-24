export interface Signal {
  name: string;
  time: string;
  action: "CALL" | "PUT";
}

export interface SignalData {
  "Live Signal": Signal[];
  "OTC Market": Signal[];
}

export const fetchSignals = async (): Promise<SignalData> => {
  try {
    const response = await fetch(
      "https://dl.dropboxusercontent.com/scl/fi/jrmjs3tkx7hdauvx7frft/SignalList.txt?rlkey=r4hhwrmpm6msoz88fx4nwih4k&st=1ljdyrjn",
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching signals:", error);
    return {
      "Live Signal": [],
      "OTC Market": [],
    };
  }
};

export const getNextLiveSignal = (
  signals: Signal[],
  currentTime: string,
): Signal | null => {
  // Convert current time to minutes for comparison
  const [currentHours, currentMinutes] = currentTime.split(":").map(Number);
  const currentTotalMinutes = currentHours * 60 + currentMinutes;

  // Sort signals by time
  const sortedSignals = [...signals].sort((a, b) => {
    const [aHours, aMinutes] = a.time.split(":").map(Number);
    const [bHours, bMinutes] = b.time.split(":").map(Number);
    return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
  });

  // Find the next signal after current time
  const nextSignal = sortedSignals.find((signal) => {
    const [signalHours, signalMinutes] = signal.time.split(":").map(Number);
    const signalTotalMinutes = signalHours * 60 + signalMinutes;
    return signalTotalMinutes > currentTotalMinutes;
  });

  // If no next signal found today, return the first signal of the list (for next day)
  return nextSignal || sortedSignals[0];
};
