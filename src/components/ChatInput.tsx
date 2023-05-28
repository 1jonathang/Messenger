"use client";

import { FC, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./ui/Button";
import axios from "axios";
import { toast } from "react-hot-toast";

interface ChatInputProps {
  chatPartner: User;
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  // everything in the text editor will be the same as in the state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  
  const sendMessage = async () => {
    // so you cant send a blank message
    if (!input) {
      return;
    }
    setIsLoading(true);

    try {
      // mock api response
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // call to api endpoint, handles each message that is being sent to the user
      await axios.post("/api/message/send", { text: input, chatId });
      // usestate is chatinput so we can easily clear the chatinput by doing this
      setInput("");
      // focus is right back on the textbox when you click enter
      textareaRef.current?.focus();
    } catch (error) {
      toast.error(`Something went wrong. (${error})`);
    } finally {
      // usestates allow to easily change behaviour of component
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div className="shadow-md relative flex-1 overflow-hidden rounded-lg ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
        {/* npm install react-textarea-autosize */}
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className="block w-full border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring sm:p-y-1.5 sm:text-sm sm:leading-6"
        />

        <div className="absolute right-0 bottom-0 justify-between py-1.5 pr-2">
          <div className="flex-shrink-0">
            <Button
              isLoading={isLoading}
              onClick={sendMessage}
              size="chat"
              type="submit"
              className="text-xs w-20 bg-indigo-600 hover:bg-indigo-500"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

