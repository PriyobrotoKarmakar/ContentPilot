const sendButton = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const imageUpload = document.getElementById("image-upload");
const imageUploadLabel = document.getElementById("image-upload-label");
const chatContainer = document.querySelector(".chat-container");
const contentButton = document.getElementById("content-btn");
const thumbnailButton = document.getElementById("thumbnail-btn");
const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

// Set initial mode states
let contentModeActive = false;
let thumbnailModeActive = false;
let selectedImage = null;

// Check for saved theme preference, otherwise use system preference
const savedTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");
html.setAttribute("data-theme", savedTheme);

// Theme toggle event listener
themeToggle.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

// Toggle content generation mode
contentButton.addEventListener("click", function () {
  contentModeActive = !contentModeActive;
  thumbnailModeActive = false;
  contentButton.classList.toggle("active", contentModeActive);
  thumbnailButton.classList.remove("active");
});

// Toggle thumbnail generation mode
thumbnailButton.addEventListener("click", function () {
  thumbnailModeActive = !thumbnailModeActive;
  contentModeActive = false;
  thumbnailButton.classList.toggle("active", thumbnailModeActive);
  contentButton.classList.remove("active");
});

// Handle image upload
imageUpload.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    selectedImage = file;
    // Create preview if it doesn't exist
    let previewContainer = document.querySelector(".image-preview-container");
    if (!previewContainer) {
      previewContainer = document.createElement("div");
      previewContainer.className = "image-preview-container";
      previewContainer.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 20px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 10px;
        padding: 10px;
        z-index: 1000;
      `;
      document.body.appendChild(previewContainer);
    }

    // Create image preview
    const reader = new FileReader();
    reader.onload = function (e) {
      previewContainer.innerHTML = `
        <img src="${e.target.result}" alt="Preview" style="max-width: 150px; max-height: 150px; border-radius: 5px;">
        <button onclick="removeImage()" style="position: absolute; top: -5px; right: -5px; background: #ff4444; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer;">×</button>
      `;
    };
    reader.readAsDataURL(file);

    // Update upload button style
    imageUploadLabel.style.background = "rgba(79, 70, 229, 0.8)";
  }
});

// Function to remove selected image
function removeImage() {
  selectedImage = null;
  imageUpload.value = "";
  const previewContainer = document.querySelector(".image-preview-container");
  if (previewContainer) {
    previewContainer.remove();
  }
  imageUploadLabel.style.background = "rgba(79, 70, 229, 0.4)";
}

// Handle Enter key press
userInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSend();
  }
});

// Handle send button click
sendButton.addEventListener("click", handleSend);

// Handle send functionality
async function handleSend() {
  const message = userInput.value.trim();

  if (!message && !selectedImage) {
    alert("Please enter a message or select an image");
    return;
  }

  // Set the user message
  user.message = message;

  // Create user chat box
  const userChatBox = document.createElement("div");
  userChatBox.className = "user-chat-box";

  let userContent = message;

  // Handle image upload
  if (selectedImage) {
    // Keep a local copy of the selected image before any clearing happens
    const imageToProcess = selectedImage;

    const reader = new FileReader();
    reader.onload = function (e) {
      userContent = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <img src="${
            e.target.result
          }" alt="Uploaded" style="max-width: 200px; border-radius: 8px;">
          ${message ? `<p>${message}</p>` : ""}
        </div>
      `;
      userChatBox.innerHTML = `
        <div class="userImg">
          <img src="static/images/user.png" alt="User" class="chooseImg">
        </div>
        <div class="user-chat-area">${userContent}</div>
      `;

      // Add user message to chat
      chatContainer.appendChild(userChatBox);

      // Create AI chat box
      const aiChatBox = document.createElement("div");
      aiChatBox.className = "ai-chat-box";
      aiChatBox.innerHTML = `
        <div class="aiImg-wrapper">
          <img src="static/images/Jarvis.gif" alt="AI" class="aiImg">
        </div>
        <div class="ai-chat-area">Processing your request...</div>
      `;
      chatContainer.appendChild(aiChatBox);

      // Clear input field
      userInput.value = "";

      // Scroll to bottom
      chatContainer.scrollTop = chatContainer.scrollHeight;

      // Generate response with the saved image copy
      generateResponse(aiChatBox, imageToProcess);

      // Now remove the image preview
      removeImage();
    };
    reader.readAsDataURL(selectedImage);
  } else {
    userChatBox.innerHTML = `
      <div class="userImg">
        <img src="static/images/user.png" alt="User" class="chooseImg">
      </div>
      <div class="user-chat-area">${userContent}</div>
    `;

    // Add user message to chat
    chatContainer.appendChild(userChatBox);

    // Create AI chat box
    const aiChatBox = document.createElement("div");
    aiChatBox.className = "ai-chat-box";
    aiChatBox.innerHTML = `
      <div class="aiImg-wrapper">
        <img src="static/images/Jarvis.gif" alt="AI" class="aiImg">
      </div>
      <div class="ai-chat-area">Processing your request...</div>
    `;
    chatContainer.appendChild(aiChatBox);

    // Clear input
    userInput.value = "";

    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Generate response
    generateResponse(aiChatBox);

    // Clear image if any
    removeImage();
  }
}

function creatChatBox(HTML, className) {
  let div = document.createElement("div");
  div.innerHTML = HTML;
  div.classList.add(className);
  return div;
}

let user = {
  message: "",
  file: {
    mime_type: null,
    data: null,
  },
};

// Track selected hashtags separately for each container
let currentChatId = 0;

function toggleHashtag(buttonElement, chatId) {
  // Find the container for this specific chat
  const container = document.querySelector(
    `.hashtags-container[data-chat-id="${chatId}"]`
  );
  if (!container) return;

  const tag = buttonElement.dataset.tag;

  // Toggle the selected class on this button
  buttonElement.classList.toggle("selected");

  // Update the textarea in this specific container
  updateSelectedHashtagsTextarea(chatId);
}

function updateSelectedHashtagsTextarea(chatId) {
  // Find the container for this specific chat
  const container = document.querySelector(
    `.hashtags-container[data-chat-id="${chatId}"]`
  );
  if (!container) return;

  // Get all selected buttons within this container
  const selectedButtons = container.querySelectorAll(".hashtag-btn.selected");

  // Update the textarea in this container
  const textarea = container.querySelector(".selected-hashtags");
  if (textarea) {
    textarea.value = Array.from(selectedButtons)
      .map((btn) => btn.textContent)
      .join(" ");
  }
}

// Copy selected hashtags
function copySelectedHashtags(chatId) {
  // Find the container for this specific chat
  const container = document.querySelector(
    `.hashtags-container[data-chat-id="${chatId}"]`
  );
  if (!container) return;

  // Get all selected buttons within this container
  const selectedButtons = container.querySelectorAll(".hashtag-btn.selected");
  const selectedText = Array.from(selectedButtons)
    .map((btn) => btn.textContent)
    .join(" ");

  if (selectedText.trim() === "") {
    // If nothing is selected, show a message or do nothing
    return;
  }

  // Create a temporary textarea for clipboard operations
  const textArea = document.createElement("textarea");
  textArea.value = selectedText;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let copySuccess = false;
  try {
    // Try the execCommand approach (works in most browsers)
    copySuccess = document.execCommand("copy");
  } catch (err) {
    copySuccess = false;
  }

  // Clean up
  document.body.removeChild(textArea);

  // Show feedback if successful
  if (copySuccess) {
    const copySelectedBtn = container.querySelector(".copy-selected-btn");
    const originalHTML = copySelectedBtn.innerHTML;
    copySelectedBtn.innerHTML = `
      <img src="static/images/copy-selected-icon.svg" class="copy-btn-icon" alt="Copy">
      <span style="color: #2ecc71;">Copied Selected</span>
    `;
    copySelectedBtn.style.backgroundColor = "rgba(46, 204, 113, 0.2)";
    copySelectedBtn.style.border = "1px solid rgba(46, 204, 113, 0.5)";

    setTimeout(() => {
      copySelectedBtn.innerHTML = originalHTML;
      copySelectedBtn.style.backgroundColor = "";
      copySelectedBtn.style.border = "";
    }, 1500);
  }
}

// Copy all hashtags
function copyAllHashtags(chatId) {
  // Find the container for this specific chat
  const container = document.querySelector(
    `.hashtags-container[data-chat-id="${chatId}"]`
  );
  if (!container) return;

  // Get all buttons within this container
  const buttons = container.querySelectorAll(".hashtag-btn");
  const allHashtags = Array.from(buttons)
    .map((btn) => btn.textContent)
    .join(" ");

  // Create a temporary textarea for clipboard operations
  const textArea = document.createElement("textarea");
  textArea.value = allHashtags;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let copySuccess = false;
  try {
    // Try the execCommand approach (works in most browsers)
    copySuccess = document.execCommand("copy");
  } catch (err) {
    copySuccess = false;
  }

  // Clean up
  document.body.removeChild(textArea);

  // Show feedback if successful
  if (copySuccess) {
    const copyAllBtn = container.querySelector(".copy-all-btn");
    const originalHTML = copyAllBtn.innerHTML;
    copyAllBtn.innerHTML = `
      <img src="static/images/copy-all-icon.svg" class="copy-btn-icon" alt="Copy">
      <span style="color: #2ecc71;">Copied All</span>
    `;
    copyAllBtn.style.backgroundColor = "rgba(46, 204, 113, 0.2)";
    copyAllBtn.style.border = "1px solid rgba(46, 204, 113, 0.5)";

    setTimeout(() => {
      copyAllBtn.innerHTML = originalHTML;
      copyAllBtn.style.backgroundColor = "";
      copyAllBtn.style.border = "";
    }, 1500);
  }
}

// Copy generated content
function copyContent(chatId, isContent) {
  const contentText = document.getElementById(`content-text-${chatId}`);
  if (!contentText) return;

  let textToCopy;

  // Get the original content if available
  if (contentText.hasAttribute("data-original-content")) {
    // Decode the URL-encoded content
    textToCopy = decodeURIComponent(
      contentText.getAttribute("data-original-content")
    );
  } else {
    // Fallback to innerText if data attribute is not available
    textToCopy = contentText.innerText;
  }

  // Create a temporary textarea for clipboard operations
  const textArea = document.createElement("textarea");
  textArea.value = textToCopy;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let copySuccess = false;
  try {
    // Try the execCommand approach (works in most browsers)
    copySuccess = document.execCommand("copy");
  } catch (err) {
    copySuccess = false;
  }

  // Clean up
  document.body.removeChild(textArea);

  // Show feedback if successful
  if (copySuccess) {
    const copyBtn = contentText
      .closest(".content-container, .thumbnail-container")
      .querySelector(".content-copy-btn");

    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = `
      <img src="static/images/copy-selected-icon.svg" class="copy-btn-icon" alt="Copy">
      <span style="color: #2ecc71;">Copied!</span>
    `;
    copyBtn.style.backgroundColor = "rgba(46, 204, 113, 0.2)";
    copyBtn.style.border = "1px solid rgba(46, 204, 113, 0.5)";

    setTimeout(() => {
      copyBtn.innerHTML = originalHTML;
      copyBtn.style.backgroundColor = "";
      copyBtn.style.border = "";
    }, 1500);
  }
}

// Function to parse markdown for content generation
function parseMarkdown(text) {
  // Handle bold (**text**)
  text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

  // Handle italic (*text*)
  text = text.replace(/\*(?!\s)(.*?)\*/g, "<i>$1</i>");

  // Handle inline code (`code`)
  text = text.replace(/\`(.*?)\`/g, "<code>$1</code>");

  // Handle bullet points (single star at the beginning of a line)
  text = text.replace(/^\* (.*?)(\n|$)/gm, "<ul><li>$1</li></ul>");

  // Handle new lines (\n) for proper line breaks
  text = text.replace(/\n/g, "<br>");

  return text;
}

async function generateResponse(aiChatBox, imageToProcess) {
  let aiChatArea = aiChatBox.querySelector(".ai-chat-area");

  // Create a unique ID for this chat container
  const chatId = ++currentChatId;
  aiChatBox.dataset.chatId = chatId;

  // Get user message (topic)
  const userMessage = user.message;

  // Use the explicitly passed image if available, otherwise use selectedImage
  const imageToUse = imageToProcess || selectedImage;

  // Check if we have either a message or file
  if (!userMessage && !imageToUse) {
    aiChatArea.innerHTML = `<p style="color: red;">Please provide either a topic or an image.</p>`;
    return;
  }

  let formData = new FormData();

  // If we have a file, add it to formData
  if (imageToUse) {
    formData.append("image", imageToUse);
  }

  // If we have a message, add it to formData
  if (userMessage) {
    formData.append("topic", userMessage);
  }

  try {
    // Check if we're running locally or on production
    const isLocalDevelopment =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.startsWith("172.") ||
      window.location.hostname.startsWith("192.168.");

    // Define possible API endpoints to try
    const API_ENDPOINTS = [
      // First try local endpoint if in development
      isLocalDevelopment ? "http://127.0.0.1:5000" : null,
      // Then try production endpoint
      "https://content-pilot.onrender.com",
      // Fallback to local endpoint even in production if Railway is down
      "http://127.0.0.1:5000"
    ].filter(Boolean); // Remove null values
    
    let endpoint = "/generate_hashtags"; // Default endpoint
    let responseTypeText = "Generating hashtags...";

    // Handle different modes
    if (contentModeActive) {
      endpoint = "/generate_content";
      responseTypeText = "Creating viral content...";
      formData.append("platform", "linkedin"); // Default to LinkedIn
    } else if (thumbnailModeActive) {
      endpoint = "/generate_thumbnail";
      responseTypeText = "Generating thumbnail idea...";
    }

    // Update loading message
    aiChatArea.innerHTML = responseTypeText;

    // Try each API endpoint until one works
    let response = null;
    let lastError = null;
    
    for (const baseUrl of API_ENDPOINTS) {
      const fullUrl = baseUrl + endpoint;
      console.log(`Attempting to connect to: ${fullUrl}`);
      
      try {
        response = await fetch(fullUrl, {
          method: "POST",
          body: formData,
          // Add these options to help with CORS issues
          mode: 'cors',
          credentials: 'same-origin'
        });
        
        console.log(`Response status: ${response.status}`);
        
        if (response.ok) {
          // We got a successful response, break the loop
          break;
        } else {
          lastError = new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.log(`Connection failed to ${fullUrl}: ${error.message}`);
        lastError = error;
        // Continue to the next endpoint
      }
    }
    
    if (!response || !response.ok) {
      // If we exhausted all endpoints and none worked
      throw lastError || new Error('Failed to connect to any API endpoint');
    }

    const data = await response.json();
    console.log("Response data received successfully");
    
    // Handle different types of responses based on the mode
    if (contentModeActive && data.content) {
      // Store original content for copying
      const originalContent = data.content;

      // Parse markdown for content generation
      const formattedContent = parseMarkdown(data.content);

      // Display generated content
      const contentHTML = `
        <div class="content-container">
          <div class="content-header">
            <div class="content-title">Generated Content</div>
            <button class="content-copy-btn" onclick="copyContent(${chatId}, true)">
              <img src="static/images/copy-selected-icon.svg" class="copy-btn-icon" alt="Copy">
              Copy
            </button>
          </div>
          <div class="content-text" id="content-text-${chatId}" data-original-content="${encodeURIComponent(
        originalContent
      )}">${formattedContent}</div>
        </div>
      `;
      aiChatArea.innerHTML = contentHTML;
    } else if (thumbnailModeActive && data.prompt) {
      // Store original prompt for copying
      const originalPrompt = data.prompt;

      // Check if image generation was successful
      if (data.success && data.image) {
        // Display only the generated image when successful
        const thumbnailHTML = `
          <div class="thumbnail-container">
            <div class="thumbnail-header">
              <div class="thumbnail-title">Generated Thumbnail</div>
              <div class="thumbnail-buttons">
                <button class="download-btn" onclick="downloadImage('${
                  data.image
                }', 'thumbnail-${Date.now()}.png')">
                  <img src="static/images/download-icon.svg" class="copy-btn-icon" alt="Download">
                  Download
                </button>
              </div>
            </div>
            <div class="thumbnail-preview">
              <img src="data:image/png;base64,${
                data.image
              }" alt="Generated Thumbnail" class="thumbnail-image">
            </div>
          </div>
        `;
        aiChatArea.innerHTML = thumbnailHTML;
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: "smooth",
        });
      } else {
        // Display only prompt if image generation failed
        const thumbnailHTML = `
          <div class="thumbnail-container">
            <div class="thumbnail-header">
              <div class="thumbnail-title">Thumbnail Prompt</div>
              <button class="content-copy-btn" onclick="copyContent(${chatId}, false)">
                <img src="static/images/copy-selected-icon.svg" class="copy-btn-icon" alt="Copy">
                Copy Prompt
              </button>
            </div>
            <div class="content-text" id="content-text-${chatId}" data-original-content="${encodeURIComponent(
          originalPrompt
        )}">
              ${data.prompt.replace(/\n/g, "<br>")}
            </div>
            <div class="thumbnail-message">${
              data.message ||
              "Image generation failed. You can use this prompt with another tool."
            }</div>
          </div>
        `;
        aiChatArea.innerHTML = thumbnailHTML;
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    } else if (data.hashtags) {
      // This is the hashtag generation mode - use existing code
      // Generate random post counts for each hashtag
      const hashtagsWithCounts = data.hashtags
        .map((tag) => {
          const cleanTag = tag.trim();
          const formattedTag = cleanTag.startsWith("#")
            ? cleanTag
            : `#${cleanTag}`;

          // Skip empty tags
          if (formattedTag === "#") return null;

          // Generate a random post count (in a real app, this would come from the API)
          const randomCount = Math.floor(Math.random() * 50) + 1;
          const displayCount =
            randomCount < 10
              ? `${randomCount}M posts`
              : randomCount < 30
              ? `${randomCount}K posts`
              : `${randomCount * 100}K posts`;

          return {
            tag: formattedTag,
            postCount: displayCount,
          };
        })
        .filter((item) => item !== null);

      // Create buttons for each hashtag
      let hashtagsHTML = hashtagsWithCounts
        .map((item) => {
          return `<button class="hashtag-btn" data-tag="${item.tag}" data-post-count="${item.postCount}" onclick="toggleHashtag(this, ${chatId})">${item.tag}</button>`;
        })
        .join(" ");

      let HTML = `<div class="hashtags-container" data-chat-id="${chatId}">
        <b>Generated Hashtags:</b><br>
        
        <div class="hashtags-buttons">
          ${hashtagsHTML}
        </div>
        
        <div class="copy-buttons">
          <button class="copy-selected-btn" onclick="copySelectedHashtags(${chatId})">
            <img src="static/images/copy-selected-icon.svg" class="copy-btn-icon" alt="Copy">
            Copy Selected
          </button>
          <button class="copy-all-btn" onclick="copyAllHashtags(${chatId})">
            <img src="static/images/copy-all-icon.svg" class="copy-btn-icon" alt="Copy">
            Copy All
          </button>
        </div>
        
        <div class="selected-hashtags-area">
          <textarea class="selected-hashtags" placeholder="Select hashtags to see them here..." readonly></textarea>
        </div>
      </div>`;

      aiChatArea.innerHTML = HTML;
    }

    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
  } catch (error) {
    aiChatArea.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
  } finally {
    // Clear user data
    user.message = "";
  }
}

// Function to download the generated image
function downloadImage(base64Data, filename) {
  // Create a link element
  const downloadLink = document.createElement("a");

  // Set the download attribute and filename
  downloadLink.download = filename;

  // Set the href to the base64 data
  downloadLink.href = `data:image/png;base64,${base64Data}`;

  // Append to the document
  document.body.appendChild(downloadLink);

  // Trigger the download
  downloadLink.click();

  // Remove the link
  document.body.removeChild(downloadLink);
}
