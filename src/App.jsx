import { useState, useEffect } from "react";
// import { generateResponse } from "./connection";
import { MessageModal } from "./models/message"
import ReactMarkdown from 'react-markdown';
import { GridLoader } from "react-spinners";

export default function ChatApp() {
  // State to store the conversation
  const [messages, setMessages] = useState([]);
  const [botmessage, setBotMessage] = useState("")
  const [isloading, setIsLoading] = useState(false);
  // const [input, setInput] = useState("");  

  let messageVariabel = '';
  const apiKey = "AIzaSyDFFYwNoaY5Fz0GXfu3Fn5z8JHhu8yk4vE";

  async function generateResponse(history) {

    let chunk, text;
      const requestBody = {
          contents: history.map( message => {
          return {
                  parts: [{ text: message.message }],
                  role: message.role,
              };
          }),
      };
      console.log('request body for gen-res, ', requestBody);
  
      try {
          const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:streamGenerateContent?key=${apiKey}`,
          {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody),
          }
          );
  
          const reader = response.body.getReader();
          // console.log('reader: ', reader)
          setIsLoading(false)
          while (true) {
              let {done, value} = await reader.read()
              // console.log('done: ', done)
              // console.log('value: ', value)
              if(done) break;
              chunk = new TextDecoder().decode(value);
              chunk = chunk.trim();
              // console.log('first', chunk[0])
              // console.log('original chunk:', chunk);
              // console.log("len: ", chunk.length);
              let startInd, endInd;
              for( let i=0; i<chunk.length; i++){
                  if(chunk[i] == '{'){
                      startInd = i;
                      break;
                  }
              }
              for(let i=chunk.length-1; i>=0; i--){
                  if(chunk[i] == '}'){
                      endInd = i;
                      break;
                  }
              }
  
              chunk = chunk.substring(startInd, endInd+1);
              if(chunk.length == 0)   
                  break;

              chunk = '[' + chunk + ']';
              text = '';
              let msg = JSON.parse(chunk);
              
              console.log('updated chunk: ', msg);
              // console.log('msg: ', msg);
              msg.forEach(element => {
                // console.log('element: ', element);
                text += element.candidates[0].content?.parts?.[0]?.text || "";
              });
              // console.log('text: ', text);
              
              setBotMessage(prev => prev + text)
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
          console.log('chunk', chunk);

          
          return "Error generating response.";
      }
  }

  const sendMessage = async () => {
    let input = document.getElementById('input')
    if (!input.value.trim()) return;
  
    // console.log('User Input:', input.value);
    // setInput(""); 
    document.getElementById('input').focus();

    const updatedMessages = [...messages, new MessageModal(input.value, "user")];

  
    setMessages(updatedMessages);
    // console.log('Updated History (after adding user message):', updatedMessages);
    input.value = "";
    setIsLoading(true)

    await generateResponse(updatedMessages);
    console.log('Bot Reply:', messageVariabel);
    
    
    const finalMessages = [...updatedMessages, new MessageModal(messageVariabel, "model")];
    setMessages(finalMessages);
    setBotMessage("")
    // console.log('Updated History (after bot reply):', finalMessages);
  };
  
  // console.log(botmessage);
  useEffect(() => {
    // console.log("Final Messages State:", messages);
    let last_pos = document.getElementById('chat-log').scrollHeight;
    // console.log('last_pos', last_pos)
    document.getElementById('chat-log').scrollTo({top: last_pos})

  }, [messages,botmessage]);

  
  return (
    <div className="flex flex-col h-screen p-4">
      {messages.length == 0 && <div className="flex justify-center items-center h-full">Hello there! How may I help you?</div>}
      <div className="flex-1  p-2 overflow-y-auto scrollbar-hide" id="chat-log">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col justify-start mb-2">
            <div className="ml-2 text-gray-500">{msg.role === "user" ? "You" : "model"}</div>
            <div className={`flex flex-col p-2 rounded-lg ${msg.role === "user" ? "bg-blue-100 text-blue-500" : "bg-green-100 text-green-500"}`}>
              <ReactMarkdown>{msg.message}</ReactMarkdown>
            </div>
          </div>
        ))}
        {
          botmessage.length != 0 && <div key={messages.length} className="flex flex-col justify-start mb-2">
            <div className="ml-2 text-gray-500">model</div>
            <div className={`flex flex-col p-2 rounded-lg $bg-green-100 text-green-500 bg-green-100`}>
              {botmessage}
            </div>
          </div>
        }{
          isloading && <GridLoader size={5} />
        }

      </div>
      <div className="flex mt-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded-lg shadow-md"
          // const [input, setInput] = useState("");
          autoComplete="off"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          id="input"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-lg shadow-md">
          Send
        </button>
      </div>
    </div>
  );
}

