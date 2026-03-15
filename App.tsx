import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowUp,
  Award,
  CheckCircle2,
  Code2,
  Copy,
  LayoutGrid,
  ExternalLink,
  FileDown,
  Github,
  Linkedin,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  Moon,
  Search,
  Send,
  Sun,
  Wrench,
  X,
} from "lucide-react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { cn } from "./utils/cn";

type ThemeMode = "dark" | "light";

type ProjectItem = {
  id: string;
  title: string;
  category: "Web" | "Design" | "College" | "Creative";
  summary: string;
  stack: string[];
  image: string;
};

const personal = {
  name: "Manish Mahara",
  brand: "Mannu",
  email: "Contact.manojmahara.com.np",
  role: "Student, Aspiring Professional, Creative Learner",
};

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
  { to: "/certificates", label: "Certificates" },
  { to: "/education-experience", label: "Education & Experience" },
  { to: "/resume", label: "Resume / CV" },
  { to: "/contact", label: "Contact" },
];

const projectItems: ProjectItem[] = [
  {
    id: "portfolio-studio",
    title: "Portfolio Studio",
    category: "Web",
    summary: "A personal brand website concept with smooth transitions and motion-led storytelling.",
    stack: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "campus-connect",
    title: "Campus Connect",
    category: "College",
    summary: "A student collaboration and events dashboard for club activity updates and notices.",
    stack: ["Firebase", "React", "UI/UX"],
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "brand-kit-explorer",
    title: "Brand Kit Explorer",
    category: "Design",
    summary: "Design system prototype focused on color, typography, and reusable UI language.",
    stack: ["Figma", "Design Tokens", "Prototype"],
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "creative-journal",
    title: "Creative Journal",
    category: "Creative",
    summary: "A web journal for documenting ideas, growth notes, and mini visual experiments.",
    stack: ["React", "Markdown", "Animation"],
    image:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1400&q=80",
  },
];

function useTyping(words: string[], speed = 110, delay = 1300) {
  const [display, setDisplay] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    const doneTyping = !deleting && display === current;
    const doneDeleting = deleting && display.length === 0;
    const timeout = setTimeout(
      () => {
        if (doneTyping) {
          setDeleting(true);
          return;
        }
        if (doneDeleting) {
          setDeleting(false);
          setWordIndex((idx) => idx + 1);
          return;
        }
        setDisplay((prev) => (deleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)));
      },
      doneTyping ? delay : deleting ? speed / 2 : speed,
    );
    return () => clearTimeout(timeout);
  }, [deleting, delay, display, speed, wordIndex, words]);

  return display;
}

function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("mannu-theme");
    return saved === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mannu-theme", theme);
  }, [theme]);

  return {
    theme,
    toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
  };
}

function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | ${personal.brand}`;
  }, [title]);
}

function PageShell({ title, children }: { title: string; children: ReactNode }) {
  usePageTitle(title);
  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto w-full max-w-6xl px-6 pb-20 pt-28 md:px-10"
    >
      {children}
    </motion.main>
  );
}

function SectionTitle({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-8 space-y-2">
      <h2 className="gradient-text text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      <p className="max-w-2xl text-sm text-[var(--muted)] md:text-base">{text}</p>
    </div>
  );
}

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ value, suffix = "+", label }: { value: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const totalFrames = 44;
    const interval = setInterval(() => {
      frame += 1;
      setCount(Math.round((value * frame) / totalFrames));
      if (frame >= totalFrames) clearInterval(interval);
    }, 24);
    return () => clearInterval(interval);
  }, [inView, value]);

  return (
    <div ref={ref} className="glass rounded-2xl p-5 shadow-[var(--soft-shadow)]">
      <p className="text-3xl font-semibold">
        {count}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-[var(--muted)]">{label}</p>
    </div>
  );
}

function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text)] transition hover:bg-white/10"
    >
      <ArrowLeft className="h-4 w-4" /> Back
    </button>
  );
}

function HomePage() {
  const typing = useTyping(["Student", "Learner", "Creator", "Future Professional"]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      setMouse({ x: event.clientX / window.innerWidth - 0.5, y: event.clientY / window.innerHeight - 0.5 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <PageShell title="Home">
      <section className="relative min-h-[calc(100vh-9rem)] overflow-hidden rounded-[2rem] border border-white/10 px-6 py-8 md:px-10 md:py-12">
        <img
          src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1800&q=80"
          alt="Work desk setup"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(90,125,255,0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative grid min-h-[70vh] items-center gap-8 md:grid-cols-5">
          <div className="space-y-6 md:col-span-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-500/15 px-4 py-1 text-sm text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300" /> Open to Opportunities
            </p>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">{personal.brand}</p>
              <h1 className="mt-2 text-5xl font-semibold tracking-tight md:text-7xl">{personal.name}</h1>
            </div>
            <p className="max-w-xl text-lg text-[var(--muted)] md:text-xl">{personal.role}</p>
            <p className="h-8 text-xl text-violet-300 md:text-2xl">
              {typing}
              <span className="animate-pulse">|</span>
            </p>
            <p className="text-sm text-[var(--muted)]">{personal.email}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/projects" className="btn-primary">
                View Projects
              </Link>
              <a href="#" className="btn-secondary" download>
                Download CV
              </a>
              <Link to="/contact" className="btn-secondary">
                Contact Me
              </Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <motion.div
              style={{ x: mouse.x * 18, y: mouse.y * 18 }}
              className="mx-auto flex h-72 w-72 items-center justify-center rounded-full border border-white/20 bg-gradient-to-b from-white/20 to-white/5 shadow-[var(--soft-shadow)] backdrop-blur-xl"
            >
              <div className="flex h-56 w-56 items-center justify-center rounded-full bg-[linear-gradient(145deg,rgba(121,102,255,0.8),rgba(62,136,255,0.8))] text-6xl font-bold text-white">
                M
              </div>
            </motion.div>
          </div>
        </div>

        <a href="#highlights" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-[var(--muted)]">
          Scroll to Explore
        </a>
      </section>

      <section id="highlights" className="mt-16 space-y-8">
        <SectionTitle title="Highlights" text="Impact-focused growth journey across academics, technology, and creative practice." />
        <div className="grid gap-4 md:grid-cols-3">
          <AnimatedCounter value={20} label="Projects & Concepts" />
          <AnimatedCounter value={8} label="Certificates & Badges" />
          <AnimatedCounter value={3} suffix=" yrs" label="Hands-on Learning" />
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle title="Social Proof" text="Signals of trust through consistency, teamwork, and delivery quality." />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Team-first", "Recognized for clear communication in group projects."],
            ["Reliable", "Consistent execution from planning to delivery."],
            ["Growth mindset", "Actively upgrading skills through projects and courses."],
          ].map(([title, detail]) => (
            <Reveal key={title} className="glass rounded-2xl p-5 shadow-[var(--soft-shadow)]">
              <p className="text-lg font-medium">{title}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{detail}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle title="Testimonials" text="Short feedback from peers, mentors, and collaborators." />
        <TestimonialSlider />
      </section>

      <section className="mt-16">
        <SectionTitle title="FAQ" text="A few common questions about my focus and work style." />
        <FaqSection />
      </section>
    </PageShell>
  );
}

function AboutPage() {
  return (
    <PageShell title="About">
      <BackButton />
      <SectionTitle
        title="About Me"
        text="I am a growth-driven student building a strong foundation in technology, communication, and problem solving."
      />
      <div className="grid gap-8 md:grid-cols-2">
        <Reveal className="space-y-4 text-[var(--muted)]">
          <p>
            I am {personal.name}, known as {personal.brand}, currently balancing academic progress with practical learning.
            I enjoy turning ideas into polished digital experiences that are useful, clear, and visually strong.
          </p>
          <p>
            My goal is to evolve into a professional who can contribute to impactful products and collaborate with teams
            that value curiosity, consistency, and quality execution.
          </p>
          <div className="glass rounded-2xl p-6 shadow-[var(--soft-shadow)]">
            <h3 className="text-lg font-medium text-[var(--text)]">My Journey</h3>
            <p className="mt-3 text-sm">
              Started with curiosity in computers, moved through diploma-level technical study, and now combining
              business perspective with design and development skills to become a versatile future professional.
            </p>
          </div>
        </Reveal>
        <Reveal className="grid gap-4 sm:grid-cols-2">
          {[
            ["Focus", "Frontend, UI/UX, Personal Branding"],
            ["Strength", "Adaptability and fast learning"],
            ["Passion", "Creative coding and visual storytelling"],
            ["Goal", "Build products that solve real problems"],
          ].map(([title, value]) => (
            <div key={title} className="glass rounded-2xl p-5 shadow-[var(--soft-shadow)]">
              <p className="text-sm text-[var(--muted)]">{title}</p>
              <p className="mt-2 text-base font-medium">{value}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </PageShell>
  );
}

function SkillsPage() {
  const skillSets = [
    {
      title: "Technical Skills",
      icon: Code2,
      items: [
        ["React & TypeScript", 86],
        ["HTML, CSS, Tailwind", 92],
        ["JavaScript", 84],
      ],
    },
    {
      title: "Design Skills",
      icon: LayoutGrid,
      items: [
        ["Figma UI Design", 80],
        ["Visual Hierarchy", 88],
        ["Brand Thinking", 76],
      ],
    },
    {
      title: "Communication Skills",
      icon: MessageSquare,
      items: [
        ["Presentation", 82],
        ["Team Collaboration", 89],
        ["Documentation", 78],
      ],
    },
    {
      title: "Tools",
      icon: Wrench,
      items: [
        ["Git & GitHub", 83],
        ["VS Code", 91],
        ["Canva / Productivity", 85],
      ],
    },
  ];

  return (
    <PageShell title="Skills">
      <BackButton />
      <SectionTitle title="Skills" text="A balanced profile of technical, design, communication, and professional tooling." />
      <div className="grid gap-5 md:grid-cols-2">
        {skillSets.map((group) => (
          <Reveal key={group.title} className="glass rounded-2xl p-6 shadow-[var(--soft-shadow)]">
            <div className="mb-4 flex items-center gap-2">
              <group.icon className="h-5 w-5 text-violet-300" />
              <h3 className="text-xl font-medium">{group.title}</h3>
            </div>
            <div className="space-y-4">
              {group.items.map(([skill, value]) => (
                <div key={skill}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{skill}</span>
                    <span className="text-[var(--muted)]">{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${value}%` }}
                      viewport={{ once: true }}
                      className="h-full rounded-full bg-[linear-gradient(90deg,#6e7bff,#8a57ff)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="glass rounded-2xl p-6 shadow-[var(--soft-shadow)]">
          <h3 className="text-lg font-medium">Tech Stack Showcase</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {["React", "TypeScript", "Tailwind", "Framer Motion", "Firebase", "Figma"].map((item) => (
              <span key={item} className="rounded-full border border-white/15 px-3 py-1 text-sm text-[var(--muted)]">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-6 shadow-[var(--soft-shadow)]">
          <h3 className="text-lg font-medium">Currently Learning</h3>
          <p className="mt-4 text-sm text-[var(--muted)]">
            API integration patterns, clean architecture for frontend apps, and practical product communication.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

function ProjectsPage() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const categories = ["All", "Web", "Design", "College", "Creative"];

  const filtered = useMemo(
    () =>
      projectItems.filter((project) => {
        const byCategory = filter === "All" || project.category === filter;
        const byQuery =
          project.title.toLowerCase().includes(query.toLowerCase()) ||
          project.summary.toLowerCase().includes(query.toLowerCase()) ||
          project.stack.join(" ").toLowerCase().includes(query.toLowerCase());
        return byCategory && byQuery;
      }),
    [filter, query],
  );

  return (
    <PageShell title="Projects">
      <BackButton />
      <SectionTitle title="Projects" text="A curated set of academic, design, and creative work with practical outcomes." />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition",
              filter === cat
                ? "border-violet-400/70 bg-violet-400/20 text-white"
                : "border-white/10 bg-white/5 text-[var(--muted)] hover:bg-white/10",
            )}
          >
            {cat}
          </button>
        ))}
        <div className="relative ml-auto w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects"
            className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-violet-400/70"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((project) => (
          <Reveal key={project.id} className="glass overflow-hidden rounded-3xl shadow-[var(--soft-shadow)]">
            <img src={project.image} alt={project.title} className="h-48 w-full object-cover" />
            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{project.category}</p>
                <h3 className="mt-1 text-xl font-medium">{project.title}</h3>
              </div>
              <p className="text-sm text-[var(--muted)]">{project.summary}</p>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs text-[var(--muted)]">
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <Link to={`/projects/${project.id}`} className="btn-secondary text-xs">
                  Details
                </Link>
                <a href="#" className="btn-secondary text-xs">
                  <Github className="h-4 w-4" /> GitHub
                </a>
                <a href="#" className="btn-secondary text-xs">
                  <ExternalLink className="h-4 w-4" /> Live Demo
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}

function ProjectDetailPage() {
  const { id } = useParams();
  const project = projectItems.find((item) => item.id === id);

  if (!project) {
    return <NotFoundPage />;
  }

  return (
    <PageShell title={project.title}>
      <BackButton />
      <img src={project.image} alt={project.title} className="h-72 w-full rounded-3xl object-cover" />
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <h1 className="text-4xl font-semibold">{project.title}</h1>
          <p className="mt-4 text-[var(--muted)]">{project.summary}</p>
          <p className="mt-4 text-sm text-[var(--muted)]">
            This detail page is ready for deeper information such as challenge, process, visual snapshots, and final
            outcomes for each showcased project.
          </p>
        </div>
        <div className="glass rounded-2xl p-5 shadow-[var(--soft-shadow)]">
          <p className="text-sm text-[var(--muted)]">Tech Stack</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function CertificatesPage() {
  const certificates = [
    ["Frontend Fundamentals", "FreeCodeCamp", "2024"],
    ["UI Design Essentials", "Coursera", "2024"],
    ["Communication for Teams", "LinkedIn Learning", "2023"],
    ["Project Presentation Badge", "College Showcase", "2023"],
  ];
  return (
    <PageShell title="Certificates & Achievements">
      <BackButton />
      <SectionTitle title="Certificates & Achievements" text="Learning milestones that reflect steady professional growth." />
      <div className="grid gap-4 sm:grid-cols-2">
        {certificates.map(([title, issuer, year]) => (
          <Reveal key={title} className="glass rounded-2xl p-5 shadow-[var(--soft-shadow)]">
            <Award className="h-5 w-5 text-violet-300" />
            <h3 className="mt-3 text-lg font-medium">{title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Issuer: {issuer} | Date: {year}
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">Recognized for active participation and applied learning.</p>
            <a href="#" className="btn-secondary mt-4 w-fit text-xs">
              View Certificate
            </a>
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}

function EducationExperiencePage() {
  const timeline = [
    ["BBA - 7th Semester", "Current", "Building management perspective with modern digital communication skills."],
    ["Diploma in Computer Engineering", "Completed", "Established technical foundation in software and systems."],
    ["Japanese Language Study", "Ongoing", "Developing language proficiency for broader opportunities."],
    ["Internship / Freelance Placeholder", "Experience", "Open to industry training and practical team-based projects."],
  ];

  return (
    <PageShell title="Education & Experience">
      <BackButton />
      <SectionTitle title="Education & Experience" text="An evolving timeline of study, training, and practical exposure." />
      <div className="relative ml-4 border-l border-white/20 pl-8">
        {timeline.map(([title, status, detail], index) => (
          <Reveal key={title} className="relative mb-10">
            <span className="absolute -left-[2.25rem] top-1 h-4 w-4 rounded-full bg-[linear-gradient(135deg,#8490ff,#8a57ff)]" />
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{status}</p>
            <h3 className="mt-1 text-xl font-medium">{title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{detail}</p>
            {index < timeline.length - 1 ? <div className="mt-8 h-px w-full bg-white/10" /> : null}
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}

function ResumePage() {
  return (
    <PageShell title="Resume / CV">
      <BackButton />
      <SectionTitle title="Resume / CV" text="A concise summary of profile, skills, academics, and experience." />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass rounded-2xl p-6 shadow-[var(--soft-shadow)] md:col-span-2">
          <h3 className="text-xl font-medium">Resume Preview</h3>
          <p className="mt-3 text-sm text-[var(--muted)]">
            One-page CV preview placeholder. Replace with embedded PDF or image snapshot when final CV is ready.
          </p>
          <div className="mt-6 rounded-2xl border border-dashed border-white/20 p-8 text-center text-sm text-[var(--muted)]">
            Resume Preview Area
          </div>
          <a href="#" download className="btn-primary mt-6 w-fit">
            <FileDown className="h-4 w-4" /> Download CV
          </a>
        </div>
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 shadow-[var(--soft-shadow)]">
            <h4 className="font-medium">Skills Summary</h4>
            <p className="mt-2 text-sm text-[var(--muted)]">Frontend, UI/UX, communication, and project presentation.</p>
          </div>
          <div className="glass rounded-2xl p-5 shadow-[var(--soft-shadow)]">
            <h4 className="font-medium">Education Summary</h4>
            <p className="mt-2 text-sm text-[var(--muted)]">BBA (7th Semester), Diploma in Computer Engineering.</p>
          </div>
          <div className="glass rounded-2xl p-5 shadow-[var(--soft-shadow)]">
            <h4 className="font-medium">Quick Contact</h4>
            <p className="mt-2 text-sm text-[var(--muted)]">{personal.email}</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: { [key: string]: string } = {};
    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.email.includes("@")) nextErrors.email = "Enter a valid email";
    if (form.message.trim().length < 10) nextErrors.message = "Message should be at least 10 characters";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    }
  }

  async function copyEmail() {
    await navigator.clipboard.writeText(personal.email);
  }

  return (
    <PageShell title="Contact">
      <BackButton />
      <SectionTitle title="Contact" text="Let us connect for projects, collaborations, internships, or opportunities." />
      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="glass space-y-4 rounded-2xl p-6 shadow-[var(--soft-shadow)]">
          <InputField
            label="Name"
            value={form.name}
            error={errors.name}
            onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
          />
          <InputField
            label="Email"
            value={form.email}
            error={errors.email}
            onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
          />
          <div>
            <label className="mb-1 block text-sm text-[var(--muted)]">Message</label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-violet-400/70"
            />
            {errors.message ? <p className="mt-1 text-xs text-rose-300">{errors.message}</p> : null}
          </div>
          <button type="submit" className="btn-primary">
            <Send className="h-4 w-4" /> Send Message
          </button>
          {submitted ? (
            <p className="inline-flex items-center gap-2 text-sm text-emerald-300">
              <CheckCircle2 className="h-4 w-4" /> Message submitted successfully.
            </p>
          ) : null}
        </form>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-6 shadow-[var(--soft-shadow)]">
            <p className="text-sm text-[var(--muted)]">Email</p>
            <p className="mt-2 break-all text-base">{personal.email}</p>
            <button onClick={copyEmail} className="btn-secondary mt-4 text-xs">
              <Copy className="h-4 w-4" /> Copy Email
            </button>
          </div>
          <div className="glass rounded-2xl p-6 shadow-[var(--soft-shadow)]">
            <p className="text-sm text-[var(--muted)]">Location</p>
            <p className="mt-2">Nepal (placeholder)</p>
            <a href="#" className="btn-secondary mt-4 text-xs">
              <MessageCircle className="h-4 w-4" /> WhatsApp / Messenger
            </a>
          </div>
          <div className="glass rounded-2xl p-6 shadow-[var(--soft-shadow)]">
            <p className="text-sm text-[var(--muted)]">Social</p>
            <div className="mt-3 flex gap-3">
              <a href="#" className="btn-secondary text-xs">
                <Github className="h-4 w-4" /> GitHub
              </a>
              <a href="#" className="btn-secondary text-xs">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function InputField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-[var(--muted)]">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-violet-400/70"
      />
      {error ? <p className="mt-1 text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}

function ServicesPage() {
  return (
    <PageShell title="Services">
      <BackButton />
      <SectionTitle title="Services" text="Future expansion page for professional offerings and collaboration models." />
      <div className="glass rounded-2xl p-8 text-[var(--muted)] shadow-[var(--soft-shadow)]">
        Service packages and process details will be added here.
      </div>
    </PageShell>
  );
}

function BlogPage() {
  return (
    <PageShell title="Blog">
      <BackButton />
      <SectionTitle title="Blog / Articles" text="Placeholder page for future writing and learning notes." />
      <div className="glass rounded-2xl p-8 text-[var(--muted)] shadow-[var(--soft-shadow)]">
        Articles on learning, projects, and personal growth will be published here.
      </div>
    </PageShell>
  );
}

function NotFoundPage() {
  return (
    <PageShell title="404">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">404</p>
        <h1 className="mt-2 text-5xl font-semibold">Page Not Found</h1>
        <p className="mt-4 text-[var(--muted)]">The page you are looking for does not exist. Use navigation to return.</p>
        <Link className="btn-primary mx-auto mt-6 w-fit" to="/">
          Back to Home
        </Link>
      </div>
    </PageShell>
  );
}

function TestimonialSlider() {
  const testimonials = [
    ["Mannu has a strong design sense and keeps improving every week.", "Mentor"],
    ["Great attitude in collaborative student projects and presentations.", "Team Member"],
    ["Combines technical learning with clear communication.", "Faculty Feedback"],
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="glass rounded-2xl p-6 shadow-[var(--soft-shadow)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
          className="space-y-3"
        >
          <p className="text-lg">"{testimonials[index][0]}"</p>
          <p className="text-sm text-[var(--muted)]">{testimonials[index][1]}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FaqSection() {
  const faqs = [
    ["What roles are you open to?", "Internships, trainee roles, and collaborative freelance opportunities."],
    ["What is your primary focus?", "Frontend development, UI design quality, and practical problem-solving."],
    ["Are you available for remote work?", "Yes, remote and hybrid opportunities are both welcome."],
  ];

  return (
    <div className="space-y-3">
      {faqs.map(([question, answer]) => (
        <details key={question} className="glass rounded-2xl p-4 shadow-[var(--soft-shadow)]">
          <summary className="cursor-pointer list-none font-medium">{question}</summary>
          <p className="mt-2 text-sm text-[var(--muted)]">{answer}</p>
        </details>
      ))}
    </div>
  );
}

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      className="fixed bottom-6 right-6 z-50 rounded-full border border-white/10 bg-white/10 p-3 backdrop-blur-md transition hover:bg-white/20"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

function Navbar({ theme, toggleTheme }: { theme: ThemeMode; toggleTheme: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[color:var(--nav)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="text-xl font-semibold tracking-wide">
          <span className="gradient-text">Mannu</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3 py-2 text-sm transition",
                  isActive ? "bg-white/12 text-white" : "text-[var(--muted)] hover:text-[var(--text)]",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href="#" className="icon-btn" aria-label="GitHub">
            <Github className="h-4 w-4" />
          </a>
          <a href="#" className="icon-btn" aria-label="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </a>
          <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        <button className="icon-btn lg:hidden" onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle menu">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-[var(--surface)] lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-xl px-3 py-2 text-sm transition",
                      isActive ? "bg-white/10 text-white" : "text-[var(--muted)] hover:bg-white/8",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-2 flex gap-2">
                <button onClick={toggleTheme} className="btn-secondary text-xs">
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} Theme
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3 md:px-10">
        <div>
          <p className="text-xl font-semibold">Mannu</p>
          <p className="mt-3 text-sm text-[var(--muted)]">"Learning with purpose, building with creativity, growing with consistency."</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Quick Links</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/services" className="text-[var(--muted)] transition hover:text-[var(--text)]">
              Services
            </Link>
            <Link to="/blog" className="text-[var(--muted)] transition hover:text-[var(--text)]">
              Blog / Articles
            </Link>
            <Link to="/projects" className="text-[var(--muted)] transition hover:text-[var(--text)]">
              Projects
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Newsletter</p>
          <div className="mt-3 flex gap-2">
            <input
              placeholder="Your email"
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none"
            />
            <button className="btn-primary whitespace-nowrap text-xs">Subscribe</button>
          </div>
          <div className="mt-4 flex gap-2">
            <a href="#" className="icon-btn" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="#" className="icon-btn" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
            <a href="#" className="icon-btn" aria-label="Email">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function AppRouter() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [glow, setGlow] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setProgress(12);
    const mid = setTimeout(() => setProgress(72), 130);
    const end = setTimeout(() => setProgress(100), 330);
    const reset = setTimeout(() => setProgress(0), 620);
    return () => {
      clearTimeout(mid);
      clearTimeout(end);
      clearTimeout(reset);
    };
  }, [location.pathname]);

  useEffect(() => {
    const onMove = (event: MouseEvent) => setGlow({ x: event.clientX, y: event.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div
        className="mouse-glow"
        style={{ left: glow.x, top: glow.y, background: "radial-gradient(circle, rgba(122,96,255,0.2), transparent 62%)" }}
      />

      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--bg)]"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                className="mx-auto h-12 w-12 rounded-full border-2 border-violet-300/30 border-t-violet-300"
              />
              <p className="mt-3 text-sm text-[var(--muted)]">Loading portfolio...</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="fixed left-0 top-0 z-[70] h-1 bg-[linear-gradient(90deg,#5e84ff,#914fff)] transition-all duration-300" style={{ width: `${progress}%` }} />

      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/education-experience" element={<EducationExperiencePage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
