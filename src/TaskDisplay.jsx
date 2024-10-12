// import React, { useState, useEffect } from 'react';
// import { Button, Typography, Box } from '@mui/material';

// const TaskDisplay = () => {
//     const [tasks, setTasks] = useState([]);
//     const [currentTask, setCurrentTask] = useState(null);
//     const [taskIndex, setTaskIndex] = useState(0);

//     useEffect(() => {
//         // Retrieve tasks from localStorage and split them
//         const tasksFromStorage = localStorage.getItem('tasks');
//         const tasksArray = tasksFromStorage ? tasksFromStorage.split(',').map(task => task.trim()) : [];
//         setTasks(tasksArray);
//         setCurrentTask(tasksArray[0]); // Set the first task
//     }, []);

//     useEffect(() => {
//         if (currentTask) {
//             speakTask(currentTask);
//         }
//     }, [currentTask]);

//     useEffect(() => {
//         const intervalId = setInterval(() => {
//             const nextIndex = (taskIndex + 1) % tasks.length;
//             setCurrentTask(tasks[nextIndex]);
//             setTaskIndex(nextIndex);
//         }, 20000);

//         return () => clearInterval(intervalId);
//     }, [taskIndex, tasks]);

//     const speakTask = (text) => {
//         if ('speechSynthesis' in window) {
//             const utterance = new SpeechSynthesisUtterance(text);
//             speechSynthesis.speak(utterance);
//         } else {
//             console.error('Text-to-speech not supported in this browser.');
//         }
//     };

//     const handleTaskComplete = () => {
//         // Remove the current task from the tasks array
//         const updatedTasks = tasks.filter((_, index) => index !== taskIndex);
//         setTasks(updatedTasks);

//         // Update the current task to the next one, or null if no tasks are left
//         setCurrentTask(updatedTasks[taskIndex] || null);

//         // Update localStorage with the updated tasks
//         localStorage.setItem('tasks', updatedTasks.join(', '));
//     };

//     const handleContactHelper = () => {
//         const helperEmail = localStorage.getItem('helperEmail');
//         if (helperEmail) {
//             window.location.href = `mailto:${helperEmail}`;
//         } else {
//             console.error('Helper email not found.');
//         }
//     };

//     return (
//         <Box>
//             {currentTask && (
//                 <>
//                     <Typography variant="h5" component="div" gutterBottom>
//                         {currentTask}
//                     </Typography>
//                     <Button variant="contained" onClick={handleTaskComplete} sx={{ mr: 2 }}>
//                         Completed
//                     </Button>
//                     <Button variant="contained" onClick={handleContactHelper}>
//                         Contact Helper
//                     </Button>
//                 </>
//             )}
//         </Box>
//     );
// };

// export default TaskDisplay;

import React, { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import './TaskDisplay.css';

const TaskDisplay = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskIndex, setTaskIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [speechResult, setSpeechResult] = useState('');

  const recognition = new window.webkitSpeechRecognition(); // For Chrome

  useEffect(() => {
    // Retrieve tasks from localStorage and split them
    const tasksFromStorage = localStorage.getItem('tasks');
    const tasksArray = tasksFromStorage ? tasksFromStorage.split(',').map(task => task.trim()) : [];
    setTasks(tasksArray);
    setCurrentTask(tasksArray[0]); // Set the first task
  }, []);

  useEffect(() => {
    if (currentTask) {
      speakTask(currentTask);
    }
  }, [currentTask]);

  useEffect(() => {
    recognition.continuous = false; // Get one phrase at a time
    recognition.interimResults = false; // Get final results only

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpeechResult(transcript);
      console.log('Speech recognized:', transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }, [recognition]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextIndex = (taskIndex + 1) % tasks.length;
      setCurrentTask(tasks[nextIndex]);
      setTaskIndex(nextIndex);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [taskIndex, tasks]);

  const speakTask = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    } else {
      console.error('Text-to-speech not supported in this browser.');
    }
  };

  const handleTaskComplete = () => {
    // Remove the current task from the tasks array
    const updatedTasks = tasks.filter((_, index) => index !== taskIndex);
    setTasks(updatedTasks);

    // Update the current task to the next one, or null if no tasks are left
    setCurrentTask(updatedTasks[taskIndex] || null);

    // Update localStorage with the updated tasks
    localStorage.setItem('tasks', updatedTasks.join(', '));
  };

  const handleContactHelper = () => {
    const helperEmail = localStorage.getItem('helperEmail');
    if (helperEmail) {
      window.location.href = `mailto:${helperEmail}`;
    } else {
      console.error('Helper email not found.');
    }
  };

  const handleStartListening = () => {
    setIsListening(true);
    recognition.start();
  };

  const handleStopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  return (
    <div className="task-display-container"> {/* Add a container for styling */}
      <Box className="task-box"> {/* Add a class to the Box */}
        {currentTask && (
          <>
            <Typography variant="h5" component="div" gutterBottom>
              {currentTask}
            </Typography>
            <Button variant="contained" onClick={handleTaskComplete} sx={{ mr: 2 }}>
              Completed
            </Button>
            <Button variant="contained" onClick={handleContactHelper}>
              Contact Helper
            </Button>
          </>
        )}
        <Button
          variant="contained"
          onClick={isListening ? handleStopListening : handleStartListening}
          sx={{ mt: 2 }}
        >
          {isListening ? 'Stop Microphone' : 'Start Microphone'}
        </Button>

        {speechResult && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            You said: {speechResult}
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default TaskDisplay;