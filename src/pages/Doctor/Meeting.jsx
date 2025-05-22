import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import {
  CallControls,
  CallingState,
  ParticipantView,
  StreamCall,
  StreamTheme,
  StreamVideo,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { DoctorContext } from "../../context/doctorContext";

export const MeetingRoomUI = ({ appointmentId }) => {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();

  if (callingState !== CallingState.JOINED) {
    return <div className="loading text-white p-4">Waiting for participants to join...</div>;
  }

  return (
    <StreamTheme>
      <section className="relative min-h-[70vh] max-h-screen w-screen md:w-[80vw] md:rounded-2xl m-auto overflow-hidden pt-4 text-white bg-black flex flex-col items-center px-4">
        {/* Participant Container */}
        <div className="flex-grow w-full p-4 overflow-auto">
          <div className="flex flex-col items-center w-full md:flex-row md:justify-evenly">
            {participants.map((participant) => (
              <div key={participant.sessionId} className="w-full max-w-md my-3">
                <ParticipantView participant={participant} />
              </div>
            ))}
          </div>
        </div>

        {/* Call Controls */}
        <div className="w-screen bg-gray-800 py-4 sticky bottom-0 flex items-center justify-center">
          <CallControls
            onLeave={() => navigate(`/appointments/${appointmentId}`)}
          />
        </div>
      </section>
    </StreamTheme>
  );
};

const MeetingRoom = () => {
  const { meetingData } = useContext(DoctorContext);
  return (
    <StreamVideo client={meetingData.client}>
      <StreamCall call={meetingData.call}>
        <MeetingRoomUI appointmentId={meetingData.appointmentId} />
      </StreamCall>
    </StreamVideo>
  );
};

export default MeetingRoom;