import React, { useState } from "react";
import { Scale, Home, Heart, Users } from "lucide-react"; // icons

const flow = {
  start: {
    question: "Initial Intake: What’s the first priority for the Asylum Seeker?",
    options: [
      { label: "Immigration / Legal", next: "legal", icon: <Scale className="w-6 h-6 mr-2" />, color: "bg-blue-600 hover:bg-blue-700" },
      { label: "Housing", next: "housing", icon: <Home className="w-6 h-6 mr-2" />, color: "bg-green-600 hover:bg-green-700" },
      { label: "Health & Wellbeing", next: "health", icon: <Heart className="w-6 h-6 mr-2" />, color: "bg-red-600 hover:bg-red-700" },
      { label: "Community & Integration", next: "community", icon: <Users className="w-6 h-6 mr-2" />, color: "bg-purple-600 hover:bg-purple-700" },
    ],
  },
  legal: {
    question: "Does the person already have legal representation?",
    options: [
      { label: "Yes", next: "done" },
      { label: "No", next: "refer_legal" },
    ],
  },
  refer_legal: {
    question: "Refer to legal support:",
    options: [
      { label: "Migrant Help", next: "done" },
      { label: "Scottish Refugee Council", next: "done" },
      { label: "GREC (Aberdeen)", next: "done" },
    ],
  },
  housing: {
    question: "Is housing secure?",
    options: [
      { label: "Yes", next: "done" },
      { label: "No", next: "refer_housing" },
    ],
  },
  refer_housing: {
    question: "Signpost to housing support:",
    options: [
      { label: "Local council housing team", next: "done" },
      { label: "Charities / Churches", next: "done" },
    ],
  },
  health: {
    question: "Any urgent health needs?",
    options: [
      { label: "Yes → NHS services", next: "done" },
      { label: "No → Register with GP", next: "done" },
    ],
  },
  community: {
    question: "Connect to local support:",
    options: [
      { label: "Volunteers", next: "done" },
      { label: "Charities", next: "done" },
      { label: "Community groups", next: "done" },
    ],
  },
  done: {
    question: "✅ End of this pathway. Review notes and print summary.",
    options: [{ label: "Restart", next: "start" }],
  },
};

// Sidebar resource list
const resources = {
  legal: [
    { name: "Migrant Help", url: "https://www.migranthelpuk.org/" },
    { name: "Scottish Refugee Council", url: "https://www.scottishrefugeecouncil.org.uk/" },
    { name: "GREC (Aberdeen)", url: "https://grec.co.uk/" },
  ],
  housing: [
    { name: "Aberdeenshire Council Housing", url: "https://www.aberdeenshire.gov.uk/" },
    { name: "Charities & Churches", url: "#" },
  ],
  health: [
    { name: "NHS Inform", url: "https://www.nhsinform.scot/" },
    { name: "Register with local GP", url: "#" },
  ],
  community: [
    { name: "Volunteers", url: "#" },
    { name: "Local Charities", url: "#" },
    { name: "Community Groups", url: "#" },
  ],
};

export default function App() {
  const [step, setStep] = useState("start");
  const [path, setPath] = useState([]);

  const current = flow[step];

  const handleClick = (option) => {
    setPath([...path, { step, choice: option.label }]);
    setStep(option.next);
  };

  const handleRestart = () => {
    setStep("start");
    setPath([]);
  };

  // Decide which resources to show
  let visibleResources;
  if (resources[step]) {
    visibleResources = { [step]: resources[step] };
  } else if (resources[step.replace("refer_", "")]) {
    visibleResources = { [step.replace("refer_", "")]: resources[step.replace("refer_", "")] };
  } else {
    visibleResources = resources; // show all at start/done
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row p-6 gap-6">
      {/* Main Flowchart Panel */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Resettlement Officer Interactive Guide
        </h1>

        <div className="bg-gray-50 border rounded-xl p-4 mb-6">
          <p className="text-lg font-medium">{current.question}</p>
        </div>

        <div className="grid gap-3">
          {current.options.map((opt, idx) => (
  <button
    key={idx}
    onClick={() => handleClick(opt)}
    className={`${opt.color} w-full text-white py-3 px-4 rounded-xl shadow flex items-center justify-start`}
  >
    {opt.icon}
    <span>{opt.label}</span>
  </button>
))}

        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-between">
  <button
    onClick={handleRestart}
    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-xl"
  >
    Restart
  </button>

  <button
    onClick={() => alert(JSON.stringify(path, null, 2))}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
  >
    Print Summary
  </button>

  <button
    onClick={() => {
      const summary = path
        .map((step) => `Step: ${step.step}\nChoice: ${step.choice}`)
        .join("\n\n");
      navigator.clipboard.writeText(summary).then(() => {
        alert("✅ Summary copied to clipboard!");
      });
    }}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
  >
    Copy Summary
  </button>
</div>

      </div>

      {/* Sidebar Resources */}
      <div className="w-full md:w-80 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Quick Resources</h2>
        {Object.entries(visibleResources).map(([category, links]) => (
          <div key={category} className="mb-4">
            <h3 className="text-lg font-semibold capitalize mb-2">{category}</h3>
            <ul className="space-y-2">
              {links.map((res, idx) => (
                <li key={idx}>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {res.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
