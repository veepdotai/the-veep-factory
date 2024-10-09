export interface recorderControls {
    startRecording: () => void;
    stopRecording: () => void;
    togglePauseResume: () => void;
    recordingBlob?: Blob;
    isRecording: boolean;
    isPaused: boolean;
    recordingTime: number;
    mediaRecorder?: MediaRecorder;
}
export type MediaAudioTrackConstraints = Pick<MediaTrackConstraints, "deviceId" | "groupId" | "autoGainControl" | "channelCount" | "echoCancellation" | "noiseSuppression" | "sampleRate" | "sampleSize">;
/**
 * @returns Controls for the recording. Details of returned controls are given below
 *
 * @param `audioTrackConstraints`: Takes a {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings#instance_properties_of_audio_tracks subset} of `MediaTrackConstraints` that apply to the audio track
 * @param `onNotAllowedOrFound`: A method that gets called when the getUserMedia promise is rejected. It receives the DOMException as its input.
 *
 * @details `startRecording`: Calling this method would result in the recording to start. Sets `isRecording` to true
 * @details `stopRecording`: This results in a recording in progress being stopped and the resulting audio being present in `recordingBlob`. Sets `isRecording` to false
 * @details `togglePauseResume`: Calling this method would pause the recording if it is currently running or resume if it is paused. Toggles the value `isPaused`
 * @details `recordingBlob`: This is the recording blob that is created after `stopRecording` has been called
 * @details `isRecording`: A boolean value that represents whether a recording is currently in progress
 * @details `isPaused`: A boolean value that represents whether a recording in progress is paused
 * @details `recordingTime`: Number of seconds that the recording has gone on. This is updated every second
 * @details `mediaRecorder`: The current mediaRecorder in use
 */
declare const useAudioRecorder: (audioTrackConstraints?: MediaAudioTrackConstraints, onNotAllowedOrFound?: (exception: DOMException) => any, mediaRecorderOptions?: MediaRecorderOptions) => recorderControls;
export default useAudioRecorder;
