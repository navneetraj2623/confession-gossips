import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyACueM6LuA24BRYkG0rPbtCFrxrtDfHl38",
  authDomain: "confession-1ec55.firebaseapp.com",
  projectId: "confession-1ec55",
  storageBucket: "confession-1ec55.firebasestorage.app",
  messagingSenderId: "701048019863",
  appId: "1:701048019863:web:43553e5bca37e4c10b02d2",
  measurementId: "G-7E945DD26H",
  databaseURL: "https://confession-1ec55-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const confessionsRootRef = ref(db, 'gossips/confession');

const contents = document.getElementById("contents");
const userName = document.getElementById("userName");
const post = document.getElementById("post");
const display = document.querySelector(".display"); // make sure your HTML uses `class="display"`
const addBtn = document.getElementById("add");

// 🟢 Add button for main page
if (addBtn) {
  addBtn.addEventListener("click", function () {
    window.location.href = "content.html";
  });
}

// 🟢 Submit new post from content.html
if (contents) {
  contents.addEventListener("submit", (e) => {
    e.preventDefault();

    push(confessionsRootRef, {
      userName: userName.value,
      Gossips: post.value,
      createdAt: { ".sv": "timestamp" }
    })
    .then(() => {
      console.log("Posted!");
      userName.value = "";
      post.value = "";
      window.location.href = "index.html"; // change if your main page is differently named
    })
    .catch(err => console.error("Write failed:", err));
  });
}

// 🟢 Fetch & display all posts on main page
if (display) {
  onValue(confessionsRootRef, (snapshot) => {
    display.innerHTML = "";
    if (!snapshot.exists()) {
      display.innerHTML = "<div>No confessions yet!</div>";
      return;
    }

    const items = [];
    snapshot.forEach((child) => {
      const val = child.val();
      // Only show if both fields exist
      if (val.userName && val.Gossips && val.createdAt) {
        items.push({ key: child.key, data: val });
      }
    });

    // Optional: sort by createdAt DESC
    items.sort((a, b) => b.data.createdAt - a.data.createdAt);

    items.forEach((item) => {
      const data = item.data;
      const timeAgo = timeago.format(data.createdAt); // using timeago.js

      const div = document.createElement("div");
      div.innerHTML = `
        <div class="top">
            <div id="profile"></div>
            <div id="userName"><strong>${escapeHTML(data.userName)}</strong></div>
            <div id="seperation">.</div>
            <div id="timeStamp">${timeAgo}</div> 
        </div>
        <div id="content">${escapeHTML(data.Gossips)}</div>
        <div class="commentBox">
            <i id="commentIcon" class="fa-solid fa-comment"></i>
            <div id="comments">Comments</div>
        </div>`;
      display.appendChild(div);
    });
  });
}

// 🛡 Escape to prevent XSS
function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
