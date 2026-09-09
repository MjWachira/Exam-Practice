const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const DATA_DIR = path.join(__dirname, '../data');
const DEFAULT_EXCEL_PATH = path.join(DATA_DIR, 'csm_questions.xlsx');

// Sample Certified ScrumMaster (CSM) Question Bank
const SAMPLE_CSM_QUESTIONS = [
  {
    ID: 1,
    Question: "What is the primary responsibility of the Scrum Master during a Sprint?",
    "Option A": "To assign daily task tickets to team members",
    "Option B": "To manage the budget and project schedule",
    "Option C": "To coach the Scrum Team and facilitate removing impediments",
    "Option D": "To sign off on user story acceptance criteria",
    "Correct Answer": "C",
    Explanation: "The Scrum Master is a true leader who serves the Scrum Team and the larger organization. They coach team members on Scrum theory and practice, and help remove impediments to the team's progress.",
    Domain: "Scrum Roles",
    Difficulty: "Medium"
  },
  {
    ID: 2,
    Question: "Who has the final authority to cancel a Sprint prior to its scheduled end date?",
    "Option A": "The Scrum Master",
    "Option B": "The Product Owner",
    "Option C": "The Development Team by majority vote",
    "Option D": "The Agile Coach or Project Sponsor",
    "Correct Answer": "B",
    Explanation: "According to the Scrum Guide, only the Product Owner has the authority to cancel the Sprint if the Sprint Goal becomes obsolete.",
    Domain: "Scrum Events",
    Difficulty: "Medium"
  },
  {
    ID: 3,
    Question: "What is the maximum recommended time-box for a Daily Scrum event in a 1-month Sprint?",
    "Option A": "15 minutes",
    "Option B": "30 minutes",
    "Option C": "45 minutes",
    "Option D": "1 hour",
    "Correct Answer": "A",
    Explanation: "The Daily Scrum is a 15-minute event for the Developers of the Scrum Team, regardless of Sprint length, to inspect progress toward the Sprint Goal and adapt the Sprint Backlog.",
    Domain: "Scrum Events",
    Difficulty: "Easy"
  },
  {
    ID: 4,
    Question: "Which of the following best describes the Definition of Done (DoD)?",
    "Option A": "A checklist created by the Project Manager to track feature completion",
    "Option B": "A formal description of the state of the Increment when it meets the quality measures required for the product",
    "Option C": "A list of acceptance criteria defined individually for each user story",
    "Option D": "The approval criteria set by the customer during Sprint Review",
    "Correct Answer": "B",
    Explanation: "The Definition of Done is a formal description of the state of the Increment when it meets the quality measures required for the product. It creates transparency by giving everyone a shared understanding of what work was completed.",
    Domain: "Scrum Artifacts",
    Difficulty: "Hard"
  },
  {
    ID: 5,
    Question: "During Sprint Planning, who decides how many Product Backlog items to select for the Sprint?",
    "Option A": "The Product Owner",
    "Option B": "The Scrum Master",
    "Option C": "The Developers",
    "Option D": "The Stakeholders and Customers",
    "Correct Answer": "C",
    Explanation: "The Developers assess their capacity and past performance to select the number of items from the Product Backlog that they forecast they can complete during the Sprint.",
    Domain: "Scrum Events",
    Difficulty: "Medium"
  },
  {
    ID: 6,
    Question: "What are the three pillars of empirical process control in Scrum?",
    "Option A": "Planning, Executing, and Controlling",
    "Option B": "Transparency, Inspection, and Adaptation",
    "Option C": "Velocity, Burndown, and Capacity",
    "Option D": "Courage, Respect, and Commitment",
    "Correct Answer": "B",
    Explanation: "Empiricism asserts that knowledge comes from experience and making decisions based on what is observed. The three pillars are Transparency, Inspection, and Adaptation.",
    Domain: "Scrum Theory & Values",
    Difficulty: "Easy"
  },
  {
    ID: 7,
    Question: "What is the Product Owner's primary focus regarding the Product Backlog?",
    "Option A": "Ensuring all items are assigned to developers",
    "Option B": "Maximizing the value of the product resulting from the work of the Scrum Team",
    "Option C": "Writing all technical specifications and code documentation",
    "Option D": "Calculating team velocity and burn-up charts",
    "Correct Answer": "B",
    Explanation: "The Product Owner is responsible for maximizing the value of the product resulting from the work of the Scrum Team. How this is done may vary widely across organizations.",
    Domain: "Scrum Roles",
    Difficulty: "Medium"
  },
  {
    ID: 8,
    Question: "What is the primary purpose of the Sprint Retrospective?",
    "Option A": "To demonstrate completed product features to key stakeholders",
    "Option B": "To plan ways to increase quality and effectiveness in upcoming Sprints",
    "Option C": "To re-estimate remaining items in the Product Backlog",
    "Option D": "To review individual team member performance metrics",
    "Correct Answer": "B",
    Explanation: "The purpose of the Sprint Retrospective is to plan ways to increase quality and effectiveness by inspecting how the last Sprint went with regards to individuals, interactions, processes, tools, and their Definition of Done.",
    Domain: "Scrum Events",
    Difficulty: "Easy"
  },
  {
    ID: 9,
    Question: "Which Scrum artifact commitment provides focus for the Scrum Team during the Sprint?",
    "Option A": "The Product Goal",
    "Option B": "The Sprint Goal",
    "Option C": "The Definition of Done",
    "Option D": "The Release Plan",
    "Correct Answer": "B",
    Explanation: "The Sprint Goal is the single objective for the Sprint. It is a commitment by the Developers that provides flexibility regarding the exact work needed to achieve it.",
    Domain: "Scrum Artifacts",
    Difficulty: "Medium"
  },
  {
    ID: 10,
    Question: "Who is responsible for tracking total work remaining in the Sprint Backlog?",
    "Option A": "The Scrum Master",
    "Option B": "The Product Owner",
    "Option C": "The Developers",
    "Option D": "The QA Lead",
    "Correct Answer": "C",
    Explanation: "The Developers track total work remaining at least for every Daily Scrum to project the likelihood of achieving the Sprint Goal.",
    Domain: "Scrum Roles",
    Difficulty: "Medium"
  },
  {
    ID: 11,
    Question: "What should happen if the Product Backlog items selected for the Sprint cannot be completed within the time-box?",
    "Option A": "The Sprint should be extended by a few days",
    "Option B": "The Developers and Product Owner negotiate the scope of the Sprint Backlog without changing the Sprint Goal",
    "Option C": "The Scrum Master changes the Definition of Done to finish faster",
    "Option D": "Unfinished items are automatically marked as Done and released",
    "Correct Answer": "B",
    Explanation: "Sprints are fixed length events that end when the time-box expires. If work turns out to be different than expected, the Developers collaborate with the Product Owner to negotiate the scope within the Sprint.",
    Domain: "Scrum Events",
    Difficulty: "Hard"
  },
  {
    ID: 12,
    Question: "What are the five official Scrum Values?",
    "Option A": "Quality, Speed, Flexibility, Innovation, Transparency",
    "Option B": "Commitment, Focus, Openness, Respect, Courage",
    "Option C": "Trust, Leadership, Efficiency, Autonomy, Alignment",
    "Option D": "Inspection, Adaptation, Honesty, Discipline, Velocity",
    "Correct Answer": "B",
    Explanation: "Successful use of Scrum depends on people becoming more proficient in living five values: Commitment, Focus, Openness, Respect, and Courage.",
    Domain: "Scrum Theory & Values",
    Difficulty: "Easy"
  },
  {
    ID: 13,
    Question: "In Scrum, who is responsible for creating a plan for the Sprint (the Sprint Backlog)?",
    "Option A": "The Scrum Master",
    "Option B": "The Product Owner",
    "Option C": "The Developers",
    "Option D": "The Project Management Office (PMO)",
    "Correct Answer": "C",
    Explanation: "The Sprint Backlog is a plan by and for the Developers. It is a highly visible, real-time picture of the work that the Developers plan to accomplish during the Sprint.",
    Domain: "Scrum Artifacts",
    Difficulty: "Medium"
  },
  {
    ID: 14,
    Question: "What is the recommended maximum time-box for a Sprint Review in a 1-month Sprint?",
    "Option A": "2 hours",
    "Option B": "4 hours",
    "Option C": "8 hours",
    "Option D": "1 day",
    "Correct Answer": "B",
    Explanation: "The Sprint Review is time-boxed to a maximum of 4 hours for a one-month Sprint. For shorter Sprints, the event is usually shorter.",
    Domain: "Scrum Events",
    Difficulty: "Easy"
  },
  {
    ID: 15,
    Question: "When is a Product Backlog item considered ready for selection in Sprint Planning?",
    "Option A": "When it has been approved by senior management",
    "Option B": "When it has been refined such that it can be Done by the Scrum Team within one Sprint",
    "Option C": "When all technical code diagrams are drawn",
    "Option D": "When it has a fixed cost estimate attached to it",
    "Correct Answer": "B",
    Explanation: "Product Backlog items that can be Done by the Scrum Team within one Sprint are deemed ready for selection in a Sprint Planning event.",
    Domain: "Agile Leadership",
    Difficulty: "Hard"
  }
];

// Ensure default Excel file exists
function ensureDefaultExcelFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DEFAULT_EXCEL_PATH)) {
    console.log('Generating initial CSM Questions Excel file at:', DEFAULT_EXCEL_PATH);
    const worksheet = XLSX.utils.json_to_sheet(SAMPLE_CSM_QUESTIONS);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CSM Questions');
    XLSX.writeFile(workbook, DEFAULT_EXCEL_PATH);
  }
}

// Read questions from an Excel file path
function readQuestionsFromExcel(filePath = DEFAULT_EXCEL_PATH) {
  ensureDefaultExcelFile();
  const targetPath = fs.existsSync(filePath) ? filePath : DEFAULT_EXCEL_PATH;

  try {
    const workbook = XLSX.readFile(targetPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Normalize and format data
    return rawData.map((row, index) => {
      const options = [];
      const optA = row['Option A'] || row['optionA'] || row['A'] || '';
      const optB = row['Option B'] || row['optionB'] || row['B'] || '';
      const optC = row['Option C'] || row['optionC'] || row['C'] || '';
      const optD = row['Option D'] || row['optionD'] || row['D'] || '';

      if (optA) options.push({ key: 'A', text: String(optA) });
      if (optB) options.push({ key: 'B', text: String(optB) });
      if (optC) options.push({ key: 'C', text: String(optC) });
      if (optD) options.push({ key: 'D', text: String(optD) });

      return {
        id: parseInt(row.ID || row.id || (index + 1), 10),
        question: String(row.Question || row.question || ''),
        options,
        correctAnswer: String(row['Correct Answer'] || row.correctAnswer || row.Correct || 'A').toUpperCase().trim(),
        explanation: String(row.Explanation || row.explanation || 'Refer to the Scrum Guide for official guidance.'),
        domain: String(row.Domain || row.domain || 'Scrum Knowledge'),
        difficulty: String(row.Difficulty || row.difficulty || 'Medium')
      };
    }).filter(q => q.question && q.options.length >= 2);
  } catch (err) {
    console.error('Error reading Excel file:', err);
    return [];
  }
}

module.exports = {
  ensureDefaultExcelFile,
  readQuestionsFromExcel,
  DEFAULT_EXCEL_PATH
};
