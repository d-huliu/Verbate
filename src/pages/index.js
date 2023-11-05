import Head from "next/head";
import styles from "@/styles/Home.module.css";
import React, { useState, useEffect, useRef } from "react";
import Console from "src/components/Console";

const MediaStreamWrapper = ({ children }) => {
  const [userMediaStream, setUserMediaStream] = useState(null);

  useEffect(() => {

    const initMediaStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      setUserMediaStream(stream);
    };

    initMediaStream();
  }, []);

  return children({ userMediaStream, setUserMediaStream });
};

export default function Home() {
  function introduction() {
    return {
      role: "assistant",
      content: "Please wait while the system initializes...",
    };
  }

  const [textInput, setTextInput] = useState("");

  const audioRefs = useRef(Array(512).fill(null));

  const sessionMessages = useRef([introduction()]);

  const detectionSettings = useRef({
    activityDetection: true,
    activityDetectionThreshold: 10,
  });

  const [promptOpen, setPromptOpen] = useState(false);

  const [activityDetection, setActivityDetection] = useState(0);

  const [preprocessedJobDescription, setPreprocessedJobDescription] =
    useState("");

  const [playQueue, setPlayQueue] = useState([]);

  const [currentAIAudio, setCurrentAIAudio] = useState(null);

  const [currentAudio, setCurrentAudio] = useState(null);

  const currentSession = useRef(null);

  const micQuiet = useRef(3000);

  const [rerender, setRerender] = useState(0);

  const selectedPrompt = useRef("");

  const interviewSettings = useRef({
    personalityOptions: [
      {
        label: "Friendly",
        value: "friendly and warm",
        enabled: true,
      },
      {
        label: "Formal",
        value: "formal, boring, and concise",
        enabled: false,
      },
      {
        label: "Challenging",
        value: "Critical, pessimistic, constantly looking for the negatives and what could be done better",
        enabled: false,
      },
      {
        label: "Encouraging",
        value: "encouraging and supportive",
        enabled: false,
      },
      {
        label: "Enthusiastic",
        value: "enthusiastic and energetic",
        enabled: false,
      },
    ],
    questionTypes: [
      {
        label: "Behavioral",
        value: "behavioral",
        enabled: true,
      },
      {
        label: "Technical",
        value: "technical",
        enabled: true,
      },
      {
        label: "Culture Fit",
        value: "culture",
        enabled: true,
      },
      {
        label: "Situational",
        value: "situational",
        enabled: true,
      },
    ],
    feedback: true,
  });

  function resetPlaceholderPrompt() {
    sessionMessages.current = [
      {
        role: "welcome",
        content: "",

      },
    ];
    setRerender(rerender + 1);
  }

  useEffect(() => {
    fetch("/api/credentials").then((response) => {
      response.json().then((data) => {
        if (data.messages.length > 0) {
          sessionMessages.current = [introduction, ...data.messages];
          setRerender(rerender + 1);
        } else {
          resetPlaceholderPrompt();
        }
      });
    });
  }, []);

  return (
    <>
      <Head>
        <title>Verbate-main</title>
        
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <MediaStreamWrapper>
            {({ userMediaStream, setUserMediaStream }) => (
              <>
                <Console
                  selectedPrompt={selectedPrompt}
                  rerender={rerender}
                  setRerender={setRerender}
                  sessionMessages={sessionMessages}
                  textInput={textInput}
                  setTextInput={setTextInput}
                  detectionSettings={detectionSettings}
                  currentAudio={currentAudio}
                  setCurrentAudio={setCurrentAudio}
                  activityDetection={activityDetection}
                  setActivityDetection={setActivityDetection}
                  currentAIAudio={currentAIAudio}
                  setCurrentAIAudio={setCurrentAIAudio}
                  playQueue={playQueue}
                  setPlayQueue={setPlayQueue}
                  audioRefs={audioRefs}
                  userMediaStream={userMediaStream}
                  currentSession={currentSession}
                  promptOpen={promptOpen}
                  setPromptOpen={setPromptOpen}
                  micQuiet={micQuiet}
                  resetPlaceholderPrompt={resetPlaceholderPrompt}
                  preprocessedJobDescription={preprocessedJobDescription}
                  setPreprocessedJobDescription={setPreprocessedJobDescription}
                  interviewSettings={interviewSettings}
                ></Console>
              </>
            )}
          </MediaStreamWrapper>
        </div>
      </main>
    </>
  );
}