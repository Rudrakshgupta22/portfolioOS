// lib/intel.ts

// 1. Strict Type Definitions
export type ClearanceLevel = 'L1_CIVILIAN' | 'L2_TALENT_ACQUISITION' | 'L4_ENGINEERING_COMMAND';
export type MissionStatus = 'NOMINAL' | 'DEPLOYED' | 'IN_DEVELOPMENT' | 'DECOMMISSIONED' | 'OPTIMIZING';

export interface AnomalyReport {
  issue: string;
  resolution: string;
}

export interface Mission {
  id: string;
  title: string;
  status: MissionStatus;
  stack: string[];
  directive: string;
  impact_metrics?: string[];
  anomaly_report?: AnomalyReport;
  repository_url?: string;
  github_url?: string;
  live_url?: string;
  image_url?: string;
  gallery?: string[];
}

export interface CareerNode {
  title: string;
  date: string;
  type: 'Initial Offer' | 'Promotion' | 'Clearance Upgrade';
  description: string;
}

// 2. The Data Payload (Your Actual Resume/Portfolio)
export const portfolioData = {
  operator: {
    name: "Rudraksh",
    role: "AI/ML Systems Architect",
    clearance: "L4_ENGINEERING_COMMAND",
    focus: ["AI", "Machine Learning", "System Architecture", "Web Deployments"]
  },
  
  missions: {
    tier_1_deployments: [
    {
  id: "Bookmyshow",
  title: "BookMyShow",
  status: "DEPLOYED",
  stack: ["Django", "Python", "SQLite", "Stripe", "React", "Tailwind CSS"],
  directive: "Full-stack movie ticket booking platform with concurrency-safe seat reservations, secure payments, and automated booking confirmations.",
  github_url: "https://github.com/Rudrakshgupta22/Bookmyshow",
  impact_metrics: [
    "Concurrency-safe real-time seat reservation",
    "Stripe-powered secure payment processing",
    "Automated email confirmations for successful bookings"
  ],
  anomaly_report: {
    issue: "Concurrent booking requests could potentially result in the same seat being reserved by multiple users.",
    resolution: "Implemented transactional database operations and row-level locking to ensure atomic seat reservations and prevent double-booking."
  }
},
     {
  id: "ELC",
  title: "ELC Website",
  status: "DEPLOYED",
  stack: ["React", "JavaScript", "Tailwind CSS", "EmailJS"],
  directive: "Official digital platform for showcasing ELC's departments, flagship events, activities, and organizational presence.",
  github_url: "https://github.com/Rudrakshgupta22/ELC",
  impact_metrics: [
    "Centralized platform for ELC events and initiatives",
    "Interactive event galleries and media showcase",
    "Integrated contact system for direct communication"
  ]
},
      {
        id: "PORTFOLIO_OS",
        title: "Mission Control OS",
        status: "OPTIMIZING",
        stack: ["Next.js", "Vercel AI SDK", "Tailwind CSS"],
        directive: "AI-driven deterministic operational GUI.",
        github_url: "https://github.com/Rudrakshgupta22/PORTFOLIO_OS",
      }
    ] as Mission[],
    
    academy_archives: [
      {
        id: "DSA_CPP_SYSTEM",
        title: "Menu-Driven Data Structures",
        status: "NOMINAL",
        stack: ["C++"],
        directive: "Implementation of Linked Lists, Trees, and Graphs via CLI."
      },
      {
        id: "ML_BASICS_01",
        title: "Linear Regression Salary Predictor",
        status: "NOMINAL",
        stack: ["Python", "Scikit-Learn"],
        directive: "Basic model training on mock HR datasets."
      }
    ] as Mission[]
  },

  service_records: {
    progression: [
      {
        title: "Chief Information Officer (CIO)",
        date: "Sep 2026",
        type: "Clearance Upgrade",
        description: "Directed overarching system architecture and technical strategy for ELC operations."
      },
      {
        title: "Team Leader",
        date: "Jan 2024",
        type: "Promotion",
        description: "Managed squad deployments, code reviews, and project sprint completions."
      },
      {
        title: "Executive",
        date: "Sep 2023",
        type: "Initial Offer",
        description: "Handled core deliverables and foundational engineering tasks."
      }
    ] as CareerNode[],
    certifications: [
      "AWS Certified Cloud Practitioner",
      "DeepLearning.AI Neural Networks"
    ]
  }
};