import { useState, useEffect } from "react";
// import { generateResponse } from "./connection";
import { MessageModal } from "./models/message";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Flame } from "lucide-react";
import { Sun, Moon, User } from 'lucide-react'; 
import { GridLoader } from "react-spinners";
import { MyConst, MyRoutes } from "./backend/const";
import { useNavigate } from "react-router-dom";
// import {Navbar} form "reactstrap"
export default function ChatApp() {
  // State to store the conversation
  const [messages, setMessages] = useState([]);
  const [botmessage, setBotMessage] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  // const [input, setInput] = useState("");

  let messageVariabel = "";
  let navigate = useNavigate();

  console.log('Darkmode: ', isDarkMode);
  

  async function generateResponse(history) {
    let chunk, text;
    const requestBody = {
      contents: history.map((message) => {
        return {
          parts: [{ text: message.message }],
          role: message.role,
        };
      }),
    };
    console.log("request body for gen-res, ", requestBody);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:streamGenerateContent?key=${MyConst.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const reader = response.body.getReader();
      // console.log('reader: ', reader)
      setIsLoading(false);
      while (true) {
        let { done, value } = await reader.read();
        // console.log('done: ', done)
        // console.log('value: ', value)
        if (done) break;
        chunk = new TextDecoder().decode(value);
        chunk = chunk.trim();
        // console.log('first', chunk[0])
        // console.log('original chunk:', chunk);
        // console.log("len: ", chunk.length);
        let startInd, endInd;
        for (let i = 0; i < chunk.length; i++) {
          if (chunk[i] == "{") {
            startInd = i;
            break;
          }
        }
        for (let i = chunk.length - 1; i >= 0; i--) {
          if (chunk[i] == "}") {
            endInd = i;
            break;
          }
        }

        chunk = chunk.substring(startInd, endInd + 1);
        if (chunk.length == 0) break;

        chunk = "[" + chunk + "]";
        text = "";
        let msg = JSON.parse(chunk);

        console.log("updated chunk: ", msg);
        // console.log('msg: ', msg);
        msg.forEach((element) => {
          // console.log('element: ', element);
          text += element.candidates[0].content?.parts?.[0]?.text || "";
        });
        // console.log('text: ', text);

        setBotMessage((prev) => prev + text);
        messageVariabel += text;
        // console.log('bot message: ', botmessage);

        // return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
      }

      // return "hello";
      // print('reader data', )

      // const data = await response.json();
      // console.log('return AI response, ', data);
    } catch (error) {
      console.error("Error generating response:", error);
      console.log("chunk", chunk);

      return "Error generating response.";
    }
  }

  const sendMessage = async () => {
    let input = document.getElementById("input");
    if (!input.value.trim()) return;

    // console.log('User Input:', input.value);
    // setInput("");
    document.getElementById("input").focus();

    const updatedMessages = [
      ...messages,
      new MessageModal(input.value, "user"),
    ];

    setMessages(updatedMessages);
    // console.log('Updated History (after adding user message):', updatedMessages);
    input.value = "";
    setIsLoading(true);

    await generateResponse(updatedMessages);
    console.log("Bot Reply:", messageVariabel);

    const finalMessages = [
      ...updatedMessages,
      new MessageModal(messageVariabel, "model"),
    ];
    setMessages(finalMessages);
    setBotMessage("");
    // console.log('Updated History (after bot reply):', finalMessages);
  };

  const toggleDarkMode = () => {
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
    setIsDarkMode(prevMode => !prevMode);
  };

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token == undefined) navigate(MyRoutes.login);

    let savedTheme = localStorage.getItem("theme");
    console.log('theme: ', savedTheme);
    
    if (savedTheme == undefined){
      setIsDarkMode(
        'dark' === (window.matchMedia?.("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
      );
    } else {
      setIsDarkMode(savedTheme == 'dark');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(botmessage);
  useEffect(() => {
    // console.log("Final Messages State:", messages);
    let last_pos = document.getElementById("chat-log").scrollHeight;
    // console.log('last_pos', last_pos)
    document.getElementById("chat-log").scrollTo({ top: last_pos });
  }, [messages, botmessage]);

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <nav className={`flex justify-between w-full top-0 transition-all duration-300 items-center p-4 ${isDarkMode? 'bg-gray-800 text-white' : 'bg-[#ececec] text-gray-800'}`}>
        {/* Left side icon */}
        <div className="text-xl flex gap-3 ">
          <Flame /> Flame
        </div>

        {/* Right side icons */}
        <div className="flex space-x-4">
          {/* Dark-Light Mode Toggle */}
          {/* Dark-Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          aria-label="Toggle Dark Mode"
          className="relative w-6 h-6"
        >
          <div className="relative w-6 h-6">
            {/* Moon Icon */}
            <Moon
              className={`absolute inset-0 transition-all duration-300 ${
                isDarkMode ? "opacity-0 scale-90 rotate-90" : "opacity-100 scale-100 rotate-0"
              }`}
            />
            
            {/* Sun Icon */}
            <Sun
              className={`absolute inset-0 transition-all duration-300 ${
                isDarkMode ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-90 -rotate-90"
              }`}
            />
          </div>
        </button>

          {/* Profile Icon */}
          <button aria-label="Profile">
            <User />
          </button>
        </div>
      </nav>
      <div className={`flex flex-col flex-1 overflow-y-scroll transition-all scrollbar-hide duration-300 p-4`} id={"chat-log"}>
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="flex flex-col justify-center items-center h-full text-gray-500 text-lg font-semibold">
            <Flame size={100} color="#ffeac9" />
            👋 Hello! How can I assist you today?
          </div>
        )}

        {/* Chat Messages */}
        <div
          className={`p-4 max-w-3xl w-full self-center transition-all duration-300 border ${isDarkMode? 'border-gray-900' : 'border-gray-200'} rounded-lg shadow-md ${isDarkMode ? 'bg-[#0f1c30]' : 'bg-gray-50'}`}
          style={{ display: messages.length != 0 ? "inline" : `none` }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col mb-4 ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div className="text-sm text-gray-400 mb-1">
                {msg.role === "user" ? "You" : <Flame size={17} />}
              </div>
              <div
                // max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl
                className={`p-3 text-[14px] 
                max-w-[80%]
                overflow-x-auto
                rounded-2xl shadow-md ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : `rounded-bl-none ${isDarkMode ? "bg-gray-700 text-white": "bg-gray-200 text-gray-900"}` 
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.message}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {/* Bot Streaming Message */}
          {botmessage && (
            <div className="flex flex-col items-start mb-4">
              <div className="text-sm text-gray-400 mb-1"> <Flame size={17} /></div>
              <div className={`p-3 text-[14px] max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl ${isDarkMode ? "bg-gray-700 text-white": "bg-gray-200 text-gray-900"} rounded-2xl shadow-md rounded-bl-none`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {botmessage}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isloading && (
            <div className="flex justify-center mt-4">
              <GridLoader size={8} color="#3b82f6" />
            </div>
          )}
        </div>
        
      </div>
      {/* Input Field */}
      <div className={`flex self-center mb-3 max-w-3xl w-full items-center gap-2 mt-4 p-3 rounded-xl shadow-lg border ${ isDarkMode? 'border-gray-800 bg-gray-900'  : 'border-gray-200 bg-white'}`}>
          <input
            id="input"
            type="text"
            autoComplete="off"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className={`flex-1 px-4 min-w-0 py-2   ${isDarkMode ? 'bg-[#151f35] text-white' : 'bg-gray-100 text-gray-900'} rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-gray-400`}
            placeholder="Type your message..."
          />
          <button
            onClick={() => sendMessage()}
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition-all"
          >
            Send
          </button>
        </div>
    </div>
  );
}
