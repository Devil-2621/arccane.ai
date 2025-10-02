export const PROJECT_TEMPLATES = [
  {
    emoji: "🎬",
    title: "Netflix Clone",
    prompt: "Build a Netflix-style homepage with Next.js and TailwindCSS. Features: sticky header (logo + nav links), hero banner with background + gradient + CTA button, responsive movie grid (2 cols mobile → 6+ desktop), hover animations on movie cards (Framer Motion), modal with movie details (Framer Motion transitions), and footer links grid. Components: Header, HeroBanner, MovieGrid, MovieCard, MovieModal, Footer. Use 'use client' when hooks are needed."
  },
  {
    emoji: "📦",
    title: "Admin Dashboard",
    prompt: "Create an admin dashboard with Next.js and TailwindCSS. Features: header with title + avatar dropdown, collapsible sidebar with nav, stat cards with Framer Motion animations, chart placeholders, paginated + searchable data table, and footer. Components: Header, Sidebar, StatCard, ChartSection, DataTable, Footer. Sidebar collapses on small screens. Use 'use client' when using hooks."
  },
  {
    emoji: "📋",
    title: "Kanban Board",
    prompt: "Build a kanban board app with Next.js and TailwindCSS. Features: header, footer, columns (To Do, In Progress, Done) with scrollable tasks, add-task button, draggable task cards (react-beautiful-dnd + Framer Motion). Components: Header, Column, TaskCard, Footer. Columns stack vertically on mobile. Use 'use client' where hooks/drag-drop are used."
  },
  {
    emoji: "🗂️",
    title: "File Manager",
    prompt: "Create a file manager UI with Next.js and TailwindCSS. Features: header (search + action buttons), sidebar navigation, breadcrumb, file/folder grid with icons, footer with storage info, smooth hover/selection/modal animations (Framer Motion). Components: Header, Sidebar, Breadcrumb, FileGrid, FileCard, Footer. Sidebar collapses on small screens. Use 'use client' for state (selected items, modals)."
  },
  {
    emoji: "📺",
    title: "YouTube Clone",
    prompt: "Build a YouTube-style homepage with Next.js and TailwindCSS. Features: header (logo, search, avatar), sidebar categories, responsive video grid (2 cols mobile → 6 desktop), video cards (thumbnail, title, channel, views), modal preview (Framer Motion), and footer. Components: Header, Sidebar, VideoGrid, VideoCard, VideoModal, Footer. Use 'use client' for state/modals."
  },
  {
    emoji: "🛍️",
    title: "Store Page",
    prompt: "Create an online store page with Next.js and TailwindCSS. Features: header (logo, search, cart), sidebar filters, responsive product grid, product cards (image, title, price, add-to-cart), cart drawer (Framer Motion), and footer. Components: Header, Sidebar, ProductGrid, ProductCard, CartDrawer, Footer. Use 'use client' for cart state."
  },
  {
    emoji: "🏡",
    title: "Airbnb Clone",
    prompt: "Build an Airbnb-style listings page with Next.js and TailwindCSS. Features: header (search + profile menu), sidebar filters, property cards (image, title, price, rating), modal with property details (carousel, description), footer, and Framer Motion animations for cards/modals. Components: Header, Sidebar, PropertyGrid, PropertyCard, PropertyModal, Footer. Use 'use client' for modals/hooks."
  },
  {
    emoji: "🎵",
    title: "Spotify Clone",
    prompt: "Create a Spotify-style music app with Next.js and TailwindCSS. Features: header (logo + search), collapsible sidebar with playlists, song list (title, artist, duration), bottom playback bar (controls + progress), footer, dark mode, Framer Motion animations for sidebar + playback. Components: Header, Sidebar, SongList, PlaybackBar, Footer. Use 'use client' for playback state."
  },
  {
    emoji: "🍔",
    title: "Restaurant Menu",
    prompt: "Build a restaurant menu app with Next.js and TailwindCSS. Features: header (logo + filters), dish grid with dish cards (image, name, price, add-to-cart), cart drawer (Framer Motion), and footer with contact info. Components: Header, Filters, DishGrid, DishCard, CartDrawer, Footer. Use 'use client' for cart state."
  },
  {
    emoji: "📰",
    title: "News Portal",
    prompt: "Create a news portal homepage with Next.js and TailwindCSS. Features: header with category nav, article grid with featured article, trending sidebar, footer, and Framer Motion animations for cards/transitions. Components: Header, ArticleGrid, TrendingSidebar, Footer. Grid adapts to mobile/desktop. Use 'use client' for dynamic state."
  },
  {
    emoji: "💬",
    title: "Chat App",
    prompt: "Build a chat app UI with Next.js and TailwindCSS. Features: header with chat title, sidebar with contacts, main chat window (sent/received messages styled), input box, footer, Framer Motion animations for new messages + typing indicators. Components: Header, Sidebar, ChatWindow, MessageBubble, InputBox, Footer. Sidebar collapses on mobile. Use 'use client' for chat state."
  }
] as const;
