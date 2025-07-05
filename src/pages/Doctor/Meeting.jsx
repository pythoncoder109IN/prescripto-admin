import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
import { 
  Users, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff,
  PhoneOff,
  Settings,
  Sparkles
} from "lucide-react";

export const MeetingRoomUI = ({ appointmentId }) => {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();

  if (callingState !== CallingState.JOINED) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-6"
          >
            <Video className="text-white mx-auto" size={48} />
          </motion.div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Connecting to Meeting...</h2>
          <p className="text-blue-200 mb-8 text-sm sm:text-base">Please wait while we set up your video consultation</p>
          <motion.div 
            className="flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-white rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <StreamTheme>
      <motion.section 
        className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div 
          className="bg-black/50 backdrop-blur-sm p-3 sm:p-4 border-b border-gray-700"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between max-w-7xl mx-auto gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <Video className="text-white" size={18} />
              </div>
              <div>
                <h1 className="text-white font-bold text-base sm:text-lg">Medical Consultation</h1>
                <p className="text-gray-300 text-xs sm:text-sm">Secure video meeting</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs sm:text-sm font-medium">Live</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-300">
                <Users size={14} />
                <span className="text-xs sm:text-sm">{participants.length} participant{participants.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Participant Container */}
        <div className="flex-grow p-3 sm:p-4 overflow-auto">
          <div className="max-w-7xl mx-auto h-full">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 h-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {participants.map((participant, index) => (
                <motion.div 
                  key={participant.sessionId} 
                  className="relative bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <ParticipantView 
                    participant={participant} 
                    className="w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px]"
                  />
                  
                  {/* Participant Info Overlay */}
                  <motion.div 
                    className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <p className="text-white font-medium text-xs sm:text-sm">
                      {participant.name || `Participant ${index + 1}`}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {participant.audioEnabled ? (
                        <Mic className="text-green-400" size={10} />
                      ) : (
                        <MicOff className="text-red-400" size={10} />
                      )}
                      {participant.videoEnabled ? (
                        <Video className="text-green-400" size={10} />
                      ) : (
                        <VideoOff className="text-red-400" size={10} />
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Call Controls */}
        <motion.div 
          className="bg-black/80 backdrop-blur-sm border-t border-gray-700 p-3 sm:p-4 sticky bottom-0"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <div className="bg-gray-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-600">
              <CallControls
                onLeave={() => navigate(`/appointments/${appointmentId}`)}
              />
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-6 sm:top-8 right-6 sm:right-8 opacity-20 hidden sm:block"
        >
          <Sparkles className="text-white" size={24} />
        </motion.div>
      </motion.section>
    </StreamTheme>
  );
};

const MeetingRoom = () => {
  const { meetingData } = useContext(DoctorContext);
  
  if (!meetingData || !meetingData.client || !meetingData.call) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <PhoneOff className="text-white mx-auto mb-4" size={48} />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Meeting Not Available</h2>
          <p className="text-red-200 text-sm sm:text-base">Unable to connect to the meeting. Please try again.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <StreamVideo client={meetingData.client}>
      <StreamCall call={meetingData.call}>
        <MeetingRoomUI appointmentId={meetingData.appointmentId} />
      </StreamCall>
    </StreamVideo>
  );
};

export default MeetingRoom;