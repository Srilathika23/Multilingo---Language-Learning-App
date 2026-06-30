// A simple module to manage a single, globally active audio playback.
// This ensures that only one audio clip plays at a time across all AudioButton components.

// Holds the stop function of the currently playing audio.
let activeStopCallback: (() => void) | null = null;

/**
 * Stops any currently playing audio by invoking its registered stop callback.
 * This is called before a new audio playback is initiated.
 */
export const stopCurrentAudio = (): void => {
  if (activeStopCallback) {
    activeStopCallback();
    // The callback itself is responsible for un-registering, but we can clear it here too for safety.
    activeStopCallback = null;
  }
};

/**
 * Registers the stop callback for the audio that is about to start playing.
 * This overwrites any previously registered callback. `stopCurrentAudio` should be called first.
 * @param stopCallback - The function to call to stop the current audio playback.
 */
export const setActiveAudio = (stopCallback: () => void): void => {
  activeStopCallback = stopCallback;
};

/**
 * Clears the currently active audio callback.
 * This should be called when playback stops for any reason (natural end, user stop, error).
 */
export const clearActiveAudio = (): void => {
    activeStopCallback = null;
};
