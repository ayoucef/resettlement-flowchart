// src/App.js
import React, { useState } from "react";
import {
  Scale,
  Home,
  Heart,
  Users,
  Book,
  Briefcase,
  Wallet,
  RefreshCw,
  ClipboardCopy,
  Printer,
  Landmark,
  Hospital,
  Building,
  Church,
  GraduationCap,
  Bus,
} from "lucide-react";

/**
 * Flowchart definition
 * - Each step can have options
 * - If option has a "url", clicking it opens in new tab AND records choice
 */
const flow = {
  start: {
    question: "Initial Intake: What’s the first priority?",
    options: [
      { label: "Immigration / Legal", next: "legal", icon: Scale, color: "bg-blue-600 hover:bg-blue-700" },
      { label: "Housing", next: "housing", icon: Home, color: "bg-green-600 hover:bg-green-700" },
      { label: "Health & Wellbeing", next: "health", icon: Heart, color: "bg-red-600 hover:bg-red-700" },
      { label: "Community & Integration", next: "community", icon: Users, color: "bg-purple-600 hover:bg-purple-700" },
      { label: "Education", next: "education", icon: Book, color: "bg-yellow-600 hover:bg-yellow-700" },
      { label: "Employment", next: "employment", icon: Briefcase, color: "bg-indigo-600 hover:bg-indigo-700" },
      { label: "Finance", next: "finance", icon: Wallet, color: "bg-teal-600 hover:bg-teal-700" },
      { label: "Age Check (NEC Card)", next: "age", icon: Bus, color: "bg-orange-600 hover:bg-orange-700" },
    ],
  },


  // --- Immigration / Legal
  legal: {
    question: "Does the person already have legal representation?",
    options: [
      { label: "Yes", next: "done", icon: Landmark, color: "bg-green-600 hover:bg-green-700" },
      { label: "No", next: "refer_legal", icon: Landmark, color: "bg-red-600 hover:bg-red-700" },
    ],
  },
  refer_legal: {
    question: "Refer to legal support:",
    options: [
      { label: "Migrant Help", url: "https://www.migranthelpuk.org/", next: "done", icon: Landmark, color: "bg-blue-600 hover:bg-blue-700" },
      { label: "Scottish Refugee Council", url: "https://www.scottishrefugeecouncil.org.uk/", next: "done", icon: Users, color: "bg-blue-500 hover:bg-blue-600" },
      { label: "GREC (Aberdeen)", url: "https://grec.co.uk/", next: "done", icon: Building, color: "bg-blue-400 hover:bg-blue-500" },
    ],
  },

  // --- Housing
  housing: {
    question: "Is housing secure?",
    options: [
      { label: "Yes", next: "done", icon: Home, color: "bg-green-600 hover:bg-green-700" },
      { label: "No", next: "refer_housing", icon: Home, color: "bg-red-600 hover:bg-red-700" },
    ],
  },
  refer_housing: {
    question: "Signpost to housing support:",
    options: [
      { label: "Local council housing team", url: "https://www.aberdeencity.gov.uk/", next: "done", icon: Building, color: "bg-green-600 hover:bg-green-700" },
      { label: "Charities / Churches", url: "#", next: "done", icon: Church, color: "bg-purple-600 hover:bg-purple-700" },
    ],
  },

  // --- Health
  health: {
    question: "Any urgent health needs?",
    options: [
      { label: "Yes → NHS services", url: "https://www.nhsinform.scot/", next: "done", icon: Hospital, color: "bg-red-600 hover:bg-red-700" },
      { label: "No → Register with GP", url: "#", next: "done", icon: ClipboardCopy, color: "bg-red-400 hover:bg-red-500" },
    ],
  },

  // --- Community
  community: {
    question: "Connect to local support:",
    options: [
      { label: "Volunteers", url: "#", next: "done", icon: Users, color: "bg-purple-500 hover:bg-purple-600" },
      { label: "Charities", url: "#", next: "done", icon: Church, color: "bg-purple-600 hover:bg-purple-700" },
      { label: "Community groups", url: "#", next: "done", icon: Users, color: "bg-purple-400 hover:bg-purple-500" },
    ],
  },

  // --- Education
  education: {
    question: "What education support is needed?",
    options: [
      { label: "School enrolment", url: "https://www.mygov.scot/school-enrolment", next: "done", icon: GraduationCap, color: "bg-yellow-600 hover:bg-yellow-700" },
      { label: "College / University", url: "https://www.saas.gov.uk/", next: "done", icon: Book, color: "bg-yellow-500 hover:bg-yellow-600" },
    ],
  },

  // --- Employment
  employment: {
    question: "Employment and skills support:",
    options: [
      { label: "Job Centre Plus", url: "https://www.gov.uk/contact-jobcentre-plus", next: "done", icon: Briefcase, color: "bg-indigo-600 hover:bg-indigo-700" },
      { label: "Skills Development Scotland", url: "https://www.skillsdevelopmentscotland.co.uk/", next: "done", icon: GraduationCap, color: "bg-indigo-500 hover:bg-indigo-600" },
    ],
  },

  // --- Finance
  finance: {
    question: "Finance and benefits support:",
    options: [
      { label: "Social Security Scotland", url: "https://www.socialsecurity.gov.scot/", next: "done", icon: Wallet, color: "bg-teal-600 hover:bg-teal-700" },
      { label: "Citizens Advice", url: "https://www.citizensadvice.org.uk/scotland/", next: "done", icon: Landmark, color: "bg-teal-500 hover:bg-teal-600" },
    ],
  },

  // --- Age check
  age: {
    question: "Enter age of asylum seeker (for NEC travel card check):",
    options: [], // handled separately
  },

  // --- End
  done: {
    question: "✅ End of this pathway. Review notes and export summary.",
    options: [{ label: "Restart", next: "start", icon: RefreshCw, color: "bg-gray-400 hover:bg-gray-500" }],
  },
};

export default function App() {
  const [step, setStep] = useState("start");
  const [path, setPath] = useState([]);
  const [age, setAge] = useState("");

  const current = flow[step];

  function handleClick(opt) {
    setPath((p) => [...p, { step, choice: opt.label }]);
    if (opt.url) window.open(opt.url, "_blank");
    setStep(opt.next);
  }

  function handleRestart() {
    setStep("start");
    setPath([]);
    setAge("");
  }

  function copySummaryToClipboard() {
    const summary = [
      "=== Case Summary ===",
      ...path.map((p, i) => `${i + 1}. [${p.step}] ${p.choice}`),
      "====================",
    ].join("\n");
    navigator.clipboard.writeText(summary).then(
      () => alert("✅ Summary copied to clipboard!"),
      () => alert("❌ Could not copy to clipboard — try manual copy.")
    );
  }

  function openPrintableSummary() {
    const html = `
      <html>
        <head><title>Case Summary</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>Case Summary</h1>
          <pre>${path.map((p, i) => `${i + 1}. [${p.step}] ${p.choice}`).join("\n")}</pre>
        </body>
      </html>
    `;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
  }

  // special case: Age check step
  function handleAgeSubmit() {
    const ageNum = parseInt(age, 10);
    if (!isNaN(ageNum) && (ageNum < 22 || ageNum > 60)) {
      window.open("https://www.transport.gov.scot/concessionary-travel/young-persons-free-bus-travel-scheme/", "_blank");
      setPath((p) => [...p, { step: "age", choice: `Age ${ageNum} → NEC travel card referral` }]);
    } else {
      setPath((p) => [...p, { step: "age", choice: `Age ${ageNum}` }]);
    }
    setStep("done");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-6">
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Resettlement Officer Guide</h1>

        <div className="bg-gray-50 border rounded-xl p-4 mb-6">
          <p className="text-lg font-medium">{current.question}</p>
        </div>

        {/* Age check input */}
        {step === "age" ? (
          <div className="space-y-4">
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age..."
              className="border rounded-lg p-2 w-full"
            />
            <button onClick={handleAgeSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl">
              Submit Age
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {current.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleClick(opt)}
                className={`${opt.color} w-full text-white py-3 px-4 rounded-xl shadow flex items-center justify-start`}
              >
                {opt.icon ? <opt.icon className="mr-3 w-5 h-5" /> : null}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3 justify-between">
          <button onClick={handleRestart} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-xl flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Restart
          </button>

          <div className="flex gap-3">
            <button onClick={openPrintableSummary} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={copySummaryToClipboard} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
              <ClipboardCopy className="w-4 h-4" /> Copy
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <strong>Path:</strong> {path.length ? path.map((p) => p.choice).join(" → ") : "— not started —"}
        </div>
      </div>
    </div>
  );
}
