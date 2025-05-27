import { observer } from "../../observer";
import "./Chatbot.css";
import { Databasefetch, getProductsDatabase } from "./core/Databasefetch";
const componentID = "chatbot";

export default function Chatbot() {
  observer(componentID, compLoaded);
  return /*html*/ `
   <div component="${componentID}">
    <div class="chatbot-container">
        <div id="chatbotToggleText" class="chatbot-label">
          <span class="d-none d-md-block">Psst… Our AI knows what fits you!</span>
        </div>
        
        <button class="chatbot-btn" id="chatbotToggle">
          <i class="fa-solid fa-robot"></i>
        </button>

        <div class="chatbot-window" id="chatbotWindow">
            <div class="chatbot-header">
              <span><i class="fa-solid fa-robot me-2"></i>Outfit Assistant</span>
            <button class="chatbot-close" id="chatbotClose">
                <i class="fas fa-times"></i>
            </button>
            </div>

            <div class="chatbot-messages" id="chatbotMessages">
            </div>

            <div class="chatbot-input" id="chatbotInput" style="display: none">
            <input
                type="text"
                id="userInput"
                placeholder="Type your message..."
            />
            <button id="sendMessage"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    </div>
   </div>
    `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = async () => {
  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotToggleText = document.getElementById("chatbotToggleText");
  const chatbotWindow = document.getElementById("chatbotWindow");
  const chatbotClose = document.getElementById("chatbotClose");
  const chatbotMessages = document.getElementById("chatbotMessages");
  const chatbotInput = document.getElementById("chatbotInput");
  const userInput = document.getElementById("userInput");
  const sendMessage = document.getElementById("sendMessage");

  // Skin tone
  const skinTonePalette = {
    "Very Fair": ["#FFDBB3", "#F5D0B8", "#EECEB3"],
    Fair: ["#E8C2A8", "#E0B89B", "#D9AE8E"],
    Light: ["#D1A37F", "#C9976B", "#C08B58"],
    Medium: ["#B87F4A", "#A57240", "#926536"],
    Tan: ["#7D4E24", "#6F451D", "#613C16"],
    Brown: ["#5C3213", "#4E2A10", "#40220D"],
    "Dark Brown": ["#32190A", "#2B1508", "#241106"],
    "Very Dark": ["#1A0D05", "#140A04", "#0D0602"],
  };

  // Chatbot status
  const chatbotState = {
    active: false,
    currentStep: 0,

    // Data to be collected
    userPreferences: {
      gender: null,
      height: null,
      weight: null,
      skinTone: null,
      size: null,
    },
  };

  // Toggle chatbot window
  chatbotToggle.addEventListener("click", () => {
    chatbotWindow.style.display = "flex";
    chatbotToggle.style.display = "none";
    chatbotToggleText.style.display = "none";
    if (!chatbotState.active) {
      chatbotState.active = true;
      Databasefetch();
      startChatbot();
    }
  });

  // Close chatbot
  chatbotClose.addEventListener("click", () => {
    chatbotWindow.style.display = "none";
    chatbotToggle.style.display = "flex";
    chatbotToggleText.style.display = "flex";
  });

  // Send message on button click
  sendMessage.addEventListener("click", sendUserMessage);

  // Send message on Enter key
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendUserMessage();
    }
  });

  function sendUserMessage() {
    const message = userInput.value.trim();
    if (message) {
      addMessage(message, "user");
    }
  }

  function addMessage(text, sender, callback = null) {
    messageQueue.push({ text, sender, callback });
    processMessageQueue();
  }

  // Message queue system
  let messageQueue = [];
  let isProcessingQueue = false;

  async function processMessageQueue() {
    if (isProcessingQueue || messageQueue.length === 0) return;
    isProcessingQueue = true;

    const { text, sender, callback } = messageQueue.shift();

    if (sender === "bot") {
      // Show typing indicator for bot messages
      const typingIndicator = document.createElement("div");
      typingIndicator.className = "typing-indicator bot-message";
      typingIndicator.innerHTML = "<span></span><span></span><span></span>";
      chatbotMessages.appendChild(typingIndicator);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

      // Calculate typing duration with max of 3s and min of 1s
      const typingDuration = Math.min(Math.max(1000, text.length * 30), 3000);

      await new Promise((resolve) => setTimeout(resolve, typingDuration));

      typingIndicator.remove();
    }

    const messageDiv = document.createElement("div");
    messageDiv.classList.add(
      sender === "user" ? "user-message" : "bot-message",
      "message-enter"
    );
    messageDiv.textContent = text;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    try {
      if (callback) callback();
    } catch (error) {
      // console.log(error);
    }

    // Process next message after a short delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    isProcessingQueue = false;
    processMessageQueue();
  }

  function addOptions(options, callback) {
    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add("options-container");

    options.forEach((option) => {
      const optionBtn = document.createElement("button");
      optionBtn.classList.add("option-btn");
      optionBtn.textContent = option;
      optionBtn.addEventListener("click", () => {
        addMessage(option, "user");
        optionsContainer.remove();
        callback(option);
      });
      optionsContainer.appendChild(optionBtn);
    });

    chatbotMessages.appendChild(optionsContainer);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function startChatbot() {
    chatbotMessages.innerHTML = "";
    messageQueue = []; // Clear any pending messages
    chatbotState.currentStep = 0;
    chatbotState.userPreferences = {
      gender: null,
      height: null,
      weight: null,
      skinTone: null,
      size: null,
    };

    addMessage(
      "Hi there! 👋 Would you like me to help you choose your new outfit?",
      "bot",
      () => {
        addOptions(["Yes, please!", "No, thanks"], (response) => {
          if (response === "Yes, please!") {
            askGender();
          } else {
            addMessage(
              "No problem! Feel free to ask if you change your mind. Have a great day! 😊",
              "bot",
              () => {
                addOptions(["I've reconsidered", "Close"], (response) => {
                  if (response == "I've reconsidered") askGender();
                  if (response == "Close") chatbotClose.click();
                });
              }
            );
          }
        });
      }
    );
  }

  function addMessageWithTyping(text, callback, hasInput = false) {
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator bot-message";
    typingIndicator.innerHTML = "<span></span><span></span><span></span>";
    chatbotMessages.appendChild(typingIndicator);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Remove typing indicator after delay
    setTimeout(() => {
      typingIndicator.remove();
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("bot-message", "message-enter");
      messageDiv.textContent = text;
      chatbotMessages.appendChild(messageDiv);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

      if (hasInput) {
        chatbotInput.style.display = "flex";
        userInput.focus();
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      }
      try {
        if (callback) callback();
      } catch (error) {
        // console.log(error);
      }
    }, 1000 + text.length * 30); // Adjust timing based on message length
  }

  function askGender() {
    chatbotState.currentStep = 1;
    addMessageWithTyping(
      "Great! Let's find your perfect outfit. First, what's your gender?",
      () => {
        addOptions(["Male", "Female"], (response) => {
          chatbotState.userPreferences.gender = response.toLowerCase();
          askHeight();
        });
      }
    );
  }

  function askHeight() {
    chatbotState.currentStep = 3;
    addMessageWithTyping(
      "What's your height in centimeters? (Please enter between 100cm and 250cm)",
      "bot",
      true
    );

    const handleHeightInput = (height) => {
      userInput.value = "";
      const heightNum = parseInt(height);

      if (isNaN(heightNum)) {
        addMessageWithTyping(
          "Please enter a valid number for your height.",
          "bot"
        );
        return;
      }

      if (heightNum < 100 || heightNum > 250) {
        addMessageWithTyping(
          "Please enter a height between 100cm and 250cm.",
          "bot"
        );
        return;
      }

      chatbotState.userPreferences.height = heightNum;
      chatbotInput.style.display = "none";
      askWeight();
    };

    sendMessage.onclick = () => {
      handleHeightInput(userInput.value.trim());
    };

    userInput.onkeypress = (e) => {
      if (e.key === "Enter") {
        handleHeightInput(userInput.value.trim());
      }
    };
  }

  function askWeight() {
    chatbotState.currentStep = 4;
    addMessageWithTyping(
      "What's your weight in kilograms? (Please enter between 20kg and 200kg)",
      "bot",
      true
    );

    const handleWeightInput = (weight) => {
      userInput.value = "";
      const weightNum = parseInt(weight);

      if (isNaN(weightNum)) {
        addMessageWithTyping(
          "Please enter a valid number for your weight.",
          "bot"
        );
        return;
      }

      if (weightNum < 20 || weightNum > 200) {
        addMessageWithTyping(
          "Please enter a weight between 20kg and 200kg.",
          "bot"
        );
        return;
      }

      chatbotState.userPreferences.weight = weightNum;
      chatbotInput.style.display = "none";
      calculateSize();
      askSkinTone();
    };

    sendMessage.onclick = () => {
      handleWeightInput(userInput.value.trim());
    };

    userInput.onkeypress = (e) => {
      if (e.key === "Enter") {
        handleWeightInput(userInput.value.trim());
      }
    };
  }

  function calculateSize() {
    const { height, weight } = chatbotState.userPreferences;

    // Store perfectFit
    let perfectFit = "";

    // Calculate BMI (Body Mass Index)
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    if (height < 150 && bmi < 16.5) {
      perfectFit = "XXS";
    } else if (height < 160 && bmi < 18.5) {
      perfectFit = "XS";
    } else if (bmi < 20) {
      perfectFit = "S";
    } else if (bmi < 23) {
      perfectFit = "M";
    } else if (bmi < 26) {
      perfectFit = "L";
    } else if (bmi < 29) {
      perfectFit = "XL";
    } else if (bmi < 32) {
      perfectFit = "2XL";
    } else if (bmi < 36) {
      perfectFit = "3XL";
    } else {
      perfectFit = "4XL";
    }

    chatbotState.userPreferences.size = perfectFit;
  }

  function askSkinTone() {
    chatbotState.currentStep = 5;
    addMessageWithTyping(
      "What's your skin tone? This will help me choose colors that look great on you!",
      () => {
        const skinTones = Object.keys(skinTonePalette);
        addOptions(skinTones, (response) => {
          chatbotState.userPreferences.skinTone = response;
          findOutfits();
        });
      }
    );
  }

  function hexToRgb(hex) {
    // Remove # if exists
    hex = hex.replace("#", "");

    // Parse r, g, b values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return [r, g, b];
  }

  function colorDistance(hex1, hex2) {
    const [r1, g1, b1] = hexToRgb(hex1);
    const [r2, g2, b2] = hexToRgb(hex2);

    // Euclidean distance between colors
    return Math.sqrt(
      Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
    );
  }

  function getComplementaryColors(baseHex) {
    // Convert to RGB
    const [r, g, b] = hexToRgb(baseHex);

    // Calculate complementary color (opposite on color wheel)
    const compR = 255 - r;
    const compG = 255 - g;
    const compB = 255 - b;

    // Return both the base and complementary colors
    return {
      analogous: [
        `#${((r + 30) % 256).toString(16).padStart(2, "0")}${g
          .toString(16)
          .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`,
        `#${((r - 30 + 256) % 256).toString(16).padStart(2, "0")}${g
          .toString(16)
          .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`,
      ],
      complementary: `#${compR.toString(16).padStart(2, "0")}${compG
        .toString(16)
        .padStart(2, "0")}${compB.toString(16).padStart(2, "0")}`,
      triadic: [
        `#${g.toString(16).padStart(2, "0")}${b
          .toString(16)
          .padStart(2, "0")}${r.toString(16).padStart(2, "0")}`,
        `#${b.toString(16).padStart(2, "0")}${r
          .toString(16)
          .padStart(2, "0")}${g.toString(16).padStart(2, "0")}`,
      ],
    };
  }

  function findOutfits() {
    chatbotState.currentStep = 6;

    // First show the analyzing message
    addMessage(
      `Analyzing colors that would complement your ${chatbotState.userPreferences.skinTone.toLowerCase()} skin tone...`,
      "bot",
      () => {
        // Get base skin tone colors
        const skinToneHexes =
          skinTonePalette[chatbotState.userPreferences.skinTone];
        const baseSkinColor = skinToneHexes[0];

        // Get color schemes that work well
        const colorSchemes = getComplementaryColors(baseSkinColor);

        // Create an array of all target colors to match against
        const targetColors = [
          ...colorSchemes.analogous,
          colorSchemes.complementary,
          ...colorSchemes.triadic,
        ];

        // Find products with closest color matches
        let recommendedProducts = getProductsDatabase()
          .map((product) => {
            // For each color variant, find closest match to recommended schemes
            const variantsWithScores = product.colors.map((color) => {
              const distances = targetColors.map((scheme) =>
                colorDistance(color.hex, scheme)
              );
              const minDistance = Math.min(...distances);
              return { ...color, distance: minDistance };
            });

            // Find the best variant for this product
            const bestVariant = variantsWithScores.reduce((best, current) =>
              current.distance < best.distance ? current : best
            );

            return {
              ...product,
              bestVariant,
              bestDistance: bestVariant.distance,
            };
          })
          // Filter by gender and size availability
          .filter((product) => {
            // Gender filter - allow unisex or matching gender
            if (
              // product.gender !== "unisex" &&
              product.gender !== chatbotState.userPreferences.gender
            ) {
              return false;
            }

            // Size availability - check if size exists and has stock > 0
            return (
              product.bestVariant.sizes &&
              product.bestVariant.sizes[chatbotState.userPreferences.size] > 0
            );
          })
          // Sort by best color match
          .sort((a, b) => a.bestDistance - b.bestDistance);

        // If no products found with strict matching, try relaxing color matching
        if (recommendedProducts.length === 0) {
          addMessage(
            "Finding alternatives with relaxed color matching...",
            "bot"
          );

          recommendedProducts = getProductsDatabase()
            .map((product) => {
              // Just pick the first available color in the right size
              const availableColor = product.colors.find(
                (color) =>
                  color.sizes &&
                  color.sizes[chatbotState.userPreferences.size] > 0
              );

              if (!availableColor) return null;

              return {
                ...product,
                bestVariant: availableColor,
                bestDistance: 1000, // High distance to sort these last
              };
            })
            .filter((product) => product !== null)
            .filter((product) => {
              // Only gender filter now
              return (
                product.gender === "unisex" ||
                product.gender === chatbotState.userPreferences.gender
              );
            });
        }

        // Display results
        if (recommendedProducts.length === 0) {
          addMessage(
            "I couldn't find any matching outfits. Please try adjusting your preferences.",
            "bot",
            () => {
              addOptions(["Start over", "Close"], (response) => {
                if (response === "Start over") startChatbot();
              });
            }
          );

          return;
        }

        addMessage(
          `Found ${recommendedProducts.length} outfit suggestions:`,
          "bot"
        );

        // Display each product with animation
        recommendedProducts.forEach((product, index) => {
          setTimeout(() => {
            const variant = product.bestVariant;
            const productDiv = document.createElement("div");
            productDiv.classList.add(
              "product-bot-card",
              "message-enter",
              "shadow",
              "rounded"
            );

            let matchQuality, matchClass;
            if (product.bestDistance < 100) {
              matchQuality = "Excellent match";
              matchClass = "excellent-match";
            } else if (product.bestDistance < 150) {
              matchQuality = "Good match";
              matchClass = "good-match";
            } else {
              matchQuality = "Alternative option";
              matchClass = "decent-match";
            }

            const productHTML = `<a href="/product/${product.id}" data-link>
                        <img src="${variant.image_urls[0]}" alt="${
              product.name
            }" class="product-bot-image">
                        <div class="product-bot-info">
                            <div class="product-bot-title">${product.name}</div>
                            <div>${product.brand} • ${product.category}</div>
                            <div>Color: ${variant.name} ${
              product.bestDistance < 1000
                ? `<span class="match-badge ${matchClass}">${matchQuality}</span>`
                : ""
            }</div>
                            <div>Size: ${
                              chatbotState.userPreferences.size
                            }</div>
                            <div class="product-bot-price">
                                $${
                                  product.price -
                                  product.price * (product.discount / 100)
                                }
                                ${
                                  product.discount > 0
                                    ? `<span class="product-bot-old-price">$${product.price}</span>`
                                    : ""
                                }
                            </div>
                        </div>
                    </a>`;

            productDiv.innerHTML = productHTML;
            chatbotMessages.appendChild(productDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
          }, index * 300); // Stagger animations
        });

        // Show options after all products are displayed
        setTimeout(() => {
          addMessage("Would you like to try different options?", "bot", () => {
            addOptions(["Start over", "Close"], (response) => {
              if (response === "Start over") startChatbot();
              if (response === "Close") chatbotClose.click();
            });
          });
        }, recommendedProducts.length * 300 + 500);
      }
    );
  }
};
