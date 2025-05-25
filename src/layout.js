import Chatbot from "./components/Chatbot/Chatbot";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";

export default function layout(view) {
  // Init chatbot only once
  if (!App.chatbotInit) {
    const chatBotDiv = document.createElement("div");
    document.body.append(chatBotDiv);
    chatBotDiv.innerHTML = Chatbot();
    App.chatbotInit = true;
  }
  //return layout
  return `
        ${Navbar()}
        ${view}
        ${Footer()}
    `;
}
