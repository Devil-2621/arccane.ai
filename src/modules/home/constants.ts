export const PROJECT_TEMPLATES = [
  {
    emoji: "🎬",
    title: "Netflix Clone",
    prompt: "Build a Netflix-style homepage using Next.js and TailwindCSS. Requirements: Include a sticky header with a logo on the left and navigation links (Home, TV Shows, Movies, My List) on the right. Hero banner section at the top with a large background image, gradient overlay (dark bottom to transparent top), and a call-to-action button. Responsive movie grid below the hero banner that adapts from 2 columns on mobile to 6+ columns on desktop. Each movie card should have hover animations (scale-up, shadow) using Framer Motion. Clicking a card should open a modal with smooth fade/scale transition using Framer Motion, showing movie details. Footer with links styled in a grid (About, Help, Terms, etc.). Technical: Use Next.js app directory. Components: Header, HeroBanner, MovieGrid, MovieCard, MovieModal, Footer. If using hooks like useState, useEffect, or useRef, include 'use client' at the top of that file. Ensure polished spacing, consistent typography, and fully responsive layout across mobile, tablet, and desktop."
  },
  {
    emoji: "📦",
    title: "Admin Dashboard",
    prompt: "Create an admin dashboard with Next.js and TailwindCSS. Requirements: Header with title and user avatar dropdown. Collapsible sidebar with navigation links (Dashboard, Users, Settings, etc.). Main content area with stat cards (Users, Sales, Revenue, etc.) that animate in using Framer Motion. Chart placeholders (line chart, bar chart). Paginated and searchable data table with example rows. Footer with basic info. Technical: Components: Header, Sidebar, StatCard, ChartSection, DataTable, Footer. Use Tailwind grid/flexbox for layout. Add Framer Motion animations for stat cards and sections (fade, slide-in). Responsive: Sidebar collapses into an icon-only version on small screens. If hooks like useState or useEffect are used for sidebar toggling or pagination, add 'use client' at the top."
  },
  {
    emoji: "📋",
    title: "Kanban Board",
    prompt: "Build a kanban board app using Next.js and TailwindCSS. Requirements: Header with app title and user menu. Footer with basic text or controls. Columns: To Do, In Progress, Done. Each column should have a title, 'Add Task' button, and scrollable task list. Task cards with title and description. Drag-and-drop functionality using react-beautiful-dnd. Smooth hover and drag animations with Framer Motion. Technical: Components: Header, Column, TaskCard, Footer. Layout should be fully responsive (columns stack vertically on mobile). Add 'use client' to components that use react-beautiful-dnd or hooks like useState/useEffect."
  },
  {
    emoji: "🗂️",
    title: "File Manager",
    prompt: "Create a file manager UI with Next.js and TailwindCSS. Requirements: Header with search bar and action buttons (Upload, New Folder). Sidebar with folder navigation. Breadcrumb navigation above main grid. Main file/folder grid with file cards showing icons for file types and folder cards with folder icon. Footer with storage info. Smooth hover, selection, and modal animations using Framer Motion. Technical: Components: Header, Sidebar, Breadcrumb, FileGrid, FileCard, Footer. Responsive: Sidebar collapses on small screens. Add 'use client' if using state (e.g., for selected items or modals)."
  },
  {
    emoji: "📺",
    title: "YouTube Clone",
    prompt: "Build a YouTube-style homepage using Next.js and TailwindCSS. Requirements: Header with logo, search bar, and profile avatar. Sidebar with categories (Home, Trending, Subscriptions, etc.). Responsive video grid (2 columns on mobile, 4–6 on desktop). Video cards with thumbnail, title, channel name, and views. Clicking a video opens a modal preview with smooth Framer Motion animation. Footer with links. Technical: Components: Header, Sidebar, VideoGrid, VideoCard, VideoModal, Footer. Responsive layout with Tailwind. 'use client' required for modal or state hooks."
  },
  {
    emoji: "🛍️",
    title: "Store Page",
    prompt: "Create an online store page with Next.js and TailwindCSS. Requirements: Header with logo, search, and cart button. Sidebar filters (category, price, rating). Responsive product grid. Product cards: image, title, price, add-to-cart button. Cart drawer that slides in/out with Framer Motion. Footer with navigation links. Technical: Components: Header, Sidebar, ProductGrid, ProductCard, CartDrawer, Footer. Use Framer Motion for hover animations on cards and cart transitions. Responsive layout. 'use client' if using state for cart."
  },
  {
    emoji: "🏡",
    title: "Airbnb Clone",
    prompt: "Build an Airbnb-style listings page with Next.js and TailwindCSS. Requirements: Header with search bar and profile menu. Sidebar filters (price range, location, availability). Property cards: image, title, price, rating. Modal with property details (image carousel, description). Footer with links. Add Framer Motion animations for card hover and modal transitions. Technical: Components: Header, Sidebar, PropertyGrid, PropertyCard, PropertyModal, Footer. Fully responsive across devices. 'use client' where hooks or modals are used."
  },
  {
    emoji: "🎵",
    title: "Spotify Clone",
    prompt: "Create a Spotify-style music app with Next.js and TailwindCSS. Requirements: Header with logo and search. Collapsible sidebar with playlists. Main song list with title, artist, duration. Bottom playback bar with play/pause, next/prev, and progress. Footer for links/info. Dark mode styling. Animate sidebar transitions, playback controls, and hover states with Framer Motion. Technical: Components: Header, Sidebar, SongList, PlaybackBar, Footer. Responsive: Sidebar collapses on small screens. 'use client' for playback state management."
  },
  {
    emoji: "🍔",
    title: "Restaurant Menu",
    prompt: "Build a restaurant menu app with Next.js and TailwindCSS. Requirements: Header with logo and filters (categories, dietary). Responsive dish grid with dish cards. Dish card: image, name, price, 'Add to Cart' button. Cart drawer sliding in/out with Framer Motion. Footer with contact info. Technical: Components: Header, Filters, DishGrid, DishCard, CartDrawer, Footer. Responsive layout across devices. 'use client' if using hooks for cart management."
  },
  {
    emoji: "📰",
    title: "News Portal",
    prompt: "Create a news portal homepage with Next.js and TailwindCSS. Requirements: Header with category navigation. Main article grid with featured article at the top. Trending sidebar with top stories. Footer with links. Animate card hovers and page transitions with Framer Motion. Technical: Components: Header, ArticleGrid, TrendingSidebar, Footer. Responsive: grid adapts to mobile and desktop. 'use client' if using state for dynamic data."
  },
  {
    emoji: "💬",
    title: "Chat App",
    prompt: "Build a chat app UI with Next.js and TailwindCSS. Requirements: Header with chat title. Sidebar with contact list. Main chat window with sent and received messages styled differently. Input box with send button. Footer with app info. Add Framer Motion animations for new messages, typing indicators, and hover effects. Technical: Components: Header, Sidebar, ChatWindow, MessageBubble, InputBox, Footer. Responsive layout (sidebar collapses on mobile). 'use client' required for stateful chat logic."
  }
] as const;
