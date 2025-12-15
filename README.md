# 📘 OrderBookUI – React Native L2 Orderbook

🔗 **GitHub Repository**  
https://github.com/Sukshith27/OrderBookUI.git

---

## 📱 Overview

This project implements a **real-time L2 Order Book UI** using **React Native** and **WebSocket** data from **Delta Exchange**.

The main goal of this assignment was not just to display data, but to handle **real-world performance challenges** such as:

- High-frequency full snapshot updates
- Smooth scrolling under heavy data churn
- Correct orderbook alignment and flashing logic
- Good user experience during app launch and loading

This project was built incrementally, with multiple iterations and performance experiments, similar to how a real production feature would evolve.

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Sukshith27/OrderBookUI.git
cd OrderBookUI

2️⃣ Install dependencies
npm install

3️⃣ Run the application
yarn start 
yarn run android

▶️ Final Working Demo 

This video shows the final optimized version of the application:
-App launch
-Skeleton loader while WebSocket connects
-Live L2 orderbook updates
-Smooth scrolling
-Flash animation when size changes
-Stable UI under continuous updates

📎 Video file:
OrderBookUI - Complete working video


▶️ Performance Evolution Videos (Engineering Journey)

-To clearly demonstrate the engineering approach, multiple videos were recorded during development:

1️⃣ Initial Version
-Basic FlatList
-Noticeable lag while scrolling fast

📎 Video files:
Flatlist with no additional props
Lag wile scrolling



2️⃣ After FlatList Optimizations
-Tuned windowSize, initialNumToRender, maxToRenderPerBatch
-Reduced lag, but frame drops still visible under 
📎 Video file:
[perf] improved



3️⃣ After Throttling UI Updates
-Introduced requestAnimationFrame
-Significant FPS improvement
📎 Video file:
No lag while scrolling



4️⃣ After Adding Skeleton Loader
-Better perceived performance
-No blank screen during initial WebSocket connection
📎 Video file:
OrderBookUI - Complete working video (initial load section)



📎 Performance Comparison Videos – Attached
-These videos show the step-by-step improvements rather than just the final result.

🔌 Data Source & API Details
-WebSocket Endpoint : `wss://socket.india.deltaex.org`

Subscribed Channel
-l2_orderbook

Important Detail
-Each WebSocket message contains the entire L2 orderbook snapshot.

As per the assignment requirement:
-The UI replaces all rows completely on every update
-No incremental updates are applied
-No REST API call is required

🧠 Architecture & Code Structure
src/
 ├── components/
 │   └── OrderCell.js
 ├── hooks/
 │   └── useOrderBook.js
 ├── screens/
 │   └── OrderBookScreen.js
 └── utils/
     └── orderBook.js

🧩 Key Responsibilities
useOrderBook
-Manages WebSocket lifecycle
-Handles reconnect logic
-Buffers updates during scrolling
-Throttles UI updates for performance

OrderBookScreen
-Renders header, column labels, and list
-Uses FlatList with tuned props
-Handles scrolling state and skeleton loader

OrderCell
-Fixed-width column rendering
-Uses tabular numbers for alignment
-Flash animation only when size changes

⚡ Performance Optimizations
-Because this is a real-time orderbook, performance was a major focus:
-Throttled UI updates using requestAnimationFrame
-Buffered WebSocket updates during aggressive scrolling
-Applied latest snapshot after scroll ends
-Limited flash animation to top price levels
-Stable row height with getItemLayout
-Tuned FlatList props for high-frequency updates
-Skeleton loader during initial app load

🐛 Problems Faced & How They Were Solved
❌ Blank screen during fast scrolling

Cause:
FlatList recycling + full snapshot replacement

Solution:
-Paused UI updates during scrolling
-Buffered the latest snapshot
-Applied updates after scroll ended

❌ Scrolling stopped after a few scrolls

Cause:
Temporary depth limit added during testing

Solution:
-Removed hard limit
-Made depth configurable

❌ Frame drops during live updates

Cause:
Too many state updates per second

Solution:
-Throttled updates using requestAnimationFrame
-Reduced unnecessary re-renders
-Optimized FlatList configuration

❌ Blank screen on app launch

Cause:
WebSocket connection delay

Solution:
-Added skeleton loader for better user experience

🎯 UI Rules Followed (As Per Assignment)

-Ask side → Price | Size
-Bid side → Size | Price
-Flash only when size changes
-No depth bar implemented (as required)
-Dark trading-style UI
-Proper column alignment using tabular numbers

✅ Final Notes
-Redux was not used intentionally (local state was sufficient)
-Focus was on correctness, performance, and UX
-Code was written incrementally, like a real production feature
-Performance trade-offs were tested, measured, and documented using videos