// src/lib/mock-data.ts

export const MOCK_USER = {
  id: "u1", name: "Aryan Sharma", username: "aryan_s",
  email: "aryan@campus.edu", role: "Student" as const,
  year: "3rd Year", branch: "Computer Science", college: "IIT Bombay",
  bio: "Building things at night. Caffeine-dependent organism. CTF nerd, open source contributor, and serial hackathon finalist.",
  karma: 2840, avatar: null as null, initials: "AS", joined: "Aug 2022",
};

export interface Event {
  id: string; title: string; category: string; date: string; time: string;
  location: string; organizer: string; attendees: number; capacity: number;
  description: string; tags: string[]; color: string;
  isFeatured?: boolean; isRSVPd?: boolean;
  speakers: { name: string; role: string; initials: string }[];
  schedule: { time: string; title: string; speaker?: string }[];
}

export interface Club {
  id: string; name: string; category: string; members: number; events: number;
  founded: number; description: string; longDesc: string;
  color: string; textColor: string; initials: string; isJoined: boolean; lead: string;
}

export const EVENTS: Event[] = [
  {
    id: "e1", title: "Intra-College Hackathon 2025", category: "Hackathon",
    date: "Mar 15, 2025", time: "9:00 AM – 9:00 AM", location: "CS Block, Hall A",
    organizer: "ACM Student Chapter", attendees: 312, capacity: 400,
    description: "48-hour hackathon bringing together the sharpest minds on campus. Build AI tools, fintech apps, sustainability solutions, or creative hacks. All branches welcome.",
    tags: ["AI","Web","Mobile","Open Innovation"], color: "#6366F1", isFeatured: true, isRSVPd: true,
    speakers: [
      { name: "Dr. Priya Nair", role: "Head of CS Dept", initials: "PN" },
      { name: "Rahul Mehta", role: "CTO @ StartupNest", initials: "RM" },
      { name: "Anjali Verma", role: "SWE, Google India", initials: "AV" },
    ],
    schedule: [
      { time: "9:00 AM", title: "Opening Ceremony", speaker: "Dr. Priya Nair" },
      { time: "10:00 AM", title: "Hacking Begins" },
      { time: "2:00 PM", title: "Mentor Rounds" },
      { time: "9:00 AM+", title: "Final Demo", speaker: "Anjali Verma" },
      { time: "11:00 AM", title: "Prize Distribution", speaker: "Rahul Mehta" },
    ],
  },
  {
    id: "e2", title: "Design Thinking Workshop", category: "Workshop",
    date: "Mar 20, 2025", time: "2:00 PM – 5:00 PM", location: "Design Lab, Block B",
    organizer: "Design Club", attendees: 68, capacity: 80,
    description: "Hands-on workshop on human-centered design, rapid prototyping, and Figma. Perfect for non-designers who want to build their product sense.",
    tags: ["UI/UX","Figma","Prototyping"], color: "#8B5CF6", isRSVPd: false,
    speakers: [{ name: "Sneha Kapoor", role: "Lead Designer @ Flipkart", initials: "SK" }],
    schedule: [
      { time: "2:00 PM", title: "Intro to Design Thinking", speaker: "Sneha Kapoor" },
      { time: "3:00 PM", title: "Figma Crash Course" },
      { time: "4:00 PM", title: "Team Prototype Challenge" },
      { time: "5:00 PM", title: "Showcase & Feedback" },
    ],
  },
  {
    id: "e3", title: "Annual Sports Meet", category: "Sports",
    date: "Mar 28, 2025", time: "7:00 AM – 6:00 PM", location: "Main Sports Ground",
    organizer: "Sports Council", attendees: 540, capacity: 800,
    description: "The biggest sporting event of the year. 15+ events across athletics, team sports, and fitness challenges.",
    tags: ["Athletics","Football","Basketball","Esports"], color: "#F59E0B", isRSVPd: false,
    speakers: [],
    schedule: [
      { time: "7:00 AM", title: "100m Sprint Heats" },
      { time: "10:00 AM", title: "Football Semi-Finals" },
      { time: "2:00 PM", title: "Basketball Finals" },
      { time: "5:00 PM", title: "Prize Ceremony" },
    ],
  },
  {
    id: "e4", title: "Cultural Fest — Tarang 2025", category: "Cultural",
    date: "Apr 5, 2025", time: "5:00 PM – 11:00 PM", location: "Open Air Theatre",
    organizer: "Cultural Committee", attendees: 1200, capacity: 2000,
    description: "Three nights of music, dance, drama, and art. Professional performers, inter-college competitions, and 40+ food stalls.",
    tags: ["Music","Dance","Drama","Food"], color: "#F43F5E", isFeatured: true, isRSVPd: false,
    speakers: [],
    schedule: [
      { time: "5:00 PM", title: "Opening Act & DJ Set" },
      { time: "7:00 PM", title: "Dance Competition" },
      { time: "9:00 PM", title: "Battle of Bands" },
      { time: "10:30 PM", title: "Closing Ceremony" },
    ],
  },
  {
    id: "e5", title: "Machine Learning Bootcamp", category: "Tech",
    date: "Apr 10, 2025", time: "10:00 AM – 4:00 PM", location: "Seminar Hall 2",
    organizer: "AI Research Club", attendees: 95, capacity: 120,
    description: "Full-day intensive on ML fundamentals — linear algebra, gradient descent, PyTorch basics, and your first neural network.",
    tags: ["ML","Python","PyTorch","Deep Learning"], color: "#10B981", isRSVPd: true,
    speakers: [
      { name: "Prof. Kumar", role: "ML Professor", initials: "PK" },
      { name: "Divya Singh", role: "PhD Researcher", initials: "DS" },
    ],
    schedule: [
      { time: "10:00 AM", title: "Maths Refresher", speaker: "Prof. Kumar" },
      { time: "12:00 PM", title: "Lunch Break" },
      { time: "1:00 PM", title: "PyTorch Hands-on", speaker: "Divya Singh" },
      { time: "3:30 PM", title: "Mini Project Submission" },
    ],
  },
  {
    id: "e6", title: "Open Mic Night", category: "Cultural",
    date: "Apr 18, 2025", time: "6:00 PM – 9:00 PM", location: "Hostel Common Room, Block D",
    organizer: "Expressions Club", attendees: 78, capacity: 100,
    description: "Poetry, standup, music, spoken word — any talent welcome. No judgment, no barriers.",
    tags: ["Poetry","Music","Comedy","Spoken Word"], color: "#06B6D4", isRSVPd: false,
    speakers: [],
    schedule: [
      { time: "6:00 PM", title: "Open Sign-Up Performances" },
      { time: "8:00 PM", title: "Featured Acts" },
      { time: "8:45 PM", title: "Closing Jam" },
    ],
  },
];

export const CLUBS: Club[] = [
  {
    id: "c1", name: "ACM Student Chapter", category: "Technical",
    members: 284, events: 24, founded: 2015,
    description: "The largest tech community on campus. Competitive programming, DSA sessions, open-source sprints, and placement prep.",
    longDesc: "Founded in 2015, the ACM Chapter is the hub for every student who writes code. We organize 3–4 events every month ranging from beginner-friendly workshops to highly competitive coding contests.",
    color: "#6366F1", textColor: "#818CF8", initials: "ACM", isJoined: true, lead: "Kartik Malhotra",
  },
  {
    id: "c2", name: "Design Club", category: "Creative",
    members: 128, events: 12, founded: 2018,
    description: "UI/UX, branding, motion graphics, and visual storytelling. We make beautiful things and ship them.",
    longDesc: "The Design Club is where artistic vision meets technical skill. Weekly design jams, critique sessions, and collaboration with other clubs on all campus event branding.",
    color: "#8B5CF6", textColor: "#A78BFA", initials: "DC", isJoined: false, lead: "Nisha Pillai",
  },
  {
    id: "c3", name: "AI Research Club", category: "Technical",
    members: 196, events: 18, founded: 2019,
    description: "Deep learning, NLP, computer vision, and robotics. We publish papers and build real AI systems.",
    longDesc: "The AI Research Club bridges the gap between classroom ML and industry research. Active professor collaborations, weekly paper-reading groups, and published work at top-tier workshops.",
    color: "#10B981", textColor: "#34D399", initials: "AIR", isJoined: true, lead: "Aditi Bhatt",
  },
  {
    id: "c4", name: "Entrepreneurship Cell", category: "Business",
    members: 312, events: 30, founded: 2012,
    description: "From ideation to funding. We mentor student startups, connect founders, and host pitch competitions.",
    longDesc: "E-Cell has incubated 40+ student startups. We organize startup weekends, bring investors to campus, and have a dedicated co-working space.",
    color: "#F59E0B", textColor: "#FCD34D", initials: "EC", isJoined: false, lead: "Virat Doshi",
  },
  {
    id: "c5", name: "Robotics & IoT Lab", category: "Technical",
    members: 154, events: 16, founded: 2017,
    description: "Build physical things. Arduino, Raspberry Pi, drones, autonomous bots, and smart systems.",
    longDesc: "Robotics Lab is where software meets hardware. National competition team, fully equipped lab with 3D printers, and semester-long build programs.",
    color: "#F43F5E", textColor: "#FB7185", initials: "ROB", isJoined: false, lead: "Rohan Das",
  },
  {
    id: "c6", name: "Photography Society", category: "Creative",
    members: 88, events: 14, founded: 2016,
    description: "Street, portrait, astrophotography, and editing. We see the campus differently.",
    longDesc: "The Photography Society captures campus life authentically. Annual magazine, photo walks, darkroom access, and a community of visual storytellers.",
    color: "#06B6D4", textColor: "#67E8F9", initials: "PS", isJoined: false, lead: "Pooja Iyer",
  },
];

export const ACTIVITY_FEED = [
  { id: 1, text: "You joined <b>AI Research Club</b>",             time: "2h ago",    color: "#10B981" },
  { id: 2, text: "<b>Hackathon 2025</b> registration now open",    time: "4h ago",    color: "#6366F1" },
  { id: 3, text: "You RSVP'd to <b>ML Bootcamp</b>",              time: "Yesterday", color: "#8B5CF6" },
  { id: 4, text: "<b>Design Club</b> posted a new event",          time: "2d ago",    color: "#F59E0B" },
  { id: 5, text: "New CTC data posted in <b>Placement Tea</b>",    time: "3d ago",    color: "#F43F5E" },
];

export const NOTIFICATIONS = [
  { id: 1, type: "reminder", title: "Event Reminder",    msg: "Intra-College Hackathon starts tomorrow at 9 AM.",          time: "1h ago",    unread: true  },
  { id: 2, type: "invite",   title: "Club Invite",       msg: "Design Club invited you to join as a core member.",         time: "3h ago",    unread: true  },
  { id: 3, type: "announce", title: "Announcement",      msg: "Exam timetable released for Semester 6.",                   time: "5h ago",    unread: true  },
  { id: 4, type: "karma",    title: "Karma Milestone",   msg: "You reached 2000 karma — unlocked 'Contributor' badge.",    time: "Yesterday", unread: false },
  { id: 5, type: "event",    title: "New Event",         msg: "AI Research Club posted: NLP Paper Reading Session.",       time: "2d ago",    unread: false },
  { id: 6, type: "rsvp",     title: "RSVP Confirmed",    msg: "Your spot at ML Bootcamp is confirmed.",                    time: "3d ago",    unread: false },
  { id: 7, type: "announce", title: "Placement Update",  msg: "Goldman Sachs is visiting campus — pre-registration open.", time: "4d ago",    unread: false },
];

export const DASHBOARD_STATS = [
  { label: "Events This Week",     value: "4",  trend: "+2", up: true  },
  { label: "Clubs Joined",         value: "2",  trend: "+1", up: true  },
  { label: "Upcoming RSVPs",       value: "3",  trend: "—",  up: null  },
  { label: "Campus Announcements", value: "11", trend: "+5", up: true  },
];

export const ACHIEVEMENTS = [
  { id: 1, title: "Early Adopter",   desc: "Joined in the first month",       color: "#F59E0B" },
  { id: 2, title: "Hackathon Hero",  desc: "Participated in 3+ hackathons",   color: "#6366F1" },
  { id: 3, title: "Contributor",     desc: "Reached 2000 karma",              color: "#10B981" },
  { id: 4, title: "Night Owl",       desc: "Active midnight 7 days straight", color: "#8B5CF6" },
];
