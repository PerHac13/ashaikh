import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import ResumeLink from "@/models/Resume";

function formatDate(date?: Date | string): string {
  if (!date) return "Present";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Present";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// 1. Fetch Experiences
// 2. Fetch Projects
// 3. Fetch Resume Link
// 4. Extract PDF text on-the-fly and cache it in DB if not already cached
export async function getPortfolioContext(): Promise<string> {
  await dbConnect();

  try {
    const experiences = await Experience.find().sort({ currentlyWorking: -1, startDate: -1 });
    const projects = await Project.find().sort({ featured: -1, "timeline.start": -1 });
    const resumeLink = await ResumeLink.findOne({ isActive: true });

    let extractedResumeText = "";
    if (resumeLink && resumeLink.url) {
      if (resumeLink.extractedText) {
        extractedResumeText = resumeLink.extractedText;
      } else {
        try {
          const { extractPdfText } = await import("@/utils/pdfExtractor");
          const text = await extractPdfText(resumeLink.url);
          if (text) {
            resumeLink.extractedText = text;
            await resumeLink.save();
            extractedResumeText = text;
          }
        } catch (error) {
          console.error("Error lazily extracting resume PDF text:", error);
        }
      }
    }

    let markdown = `# Professional Portfolio of Shaikh Abdullah\n\n`;

    markdown += `## About Shaikh Abdullah\n`;
    markdown += `Shaikh Abdullah is a Senior pursuing a B.Tech in Computer Science and Engineering at the Indian Institute of Information Technology-Bhagalpur (IIIT-Bhagalpur). Raised on computers, he kickstarted his coding journey at age 16 with C. He is a passionate, self-driven engineer specializing in building full-stack web applications and solving problems. Outside of technology, he is an avid reader, an amateur writer, and appreciates good literature.\n\n`;

    markdown += `## Professional Experience\n`;
    if (experiences.length === 0) {
      markdown += `No experience records found.\n\n`;
    } else {
      experiences.forEach((exp) => {
        const start = formatDate(exp.startDate);
        const end = exp.currentlyWorking ? "Present" : formatDate(exp.endDate);
        markdown += `### ${exp.currentPosition} at ${exp.organization}\n`;
        markdown += `- **Role Type**: ${exp.roleType}\n`;
        markdown += `- **Timeline**: ${start} - ${end}\n`;
        if (exp.skills && exp.skills.length > 0) {
          markdown += `- **Key Skills**: ${exp.skills.join(", ")}\n`;
        }
        if (exp.previousPositions && exp.previousPositions.length > 0) {
          markdown += `- **Previous Positions**: ${exp.previousPositions.join(", ")}\n`;
        }
        if (exp.description && exp.description.length > 0) {
          markdown += `- **Description & Key Achievements**:\n`;
          exp.description.forEach((desc) => {
            markdown += `  * ${desc}\n`;
          });
        }
        markdown += `\n`;
      });
    }

    markdown += `## Projects\n`;
    if (projects.length === 0) {
      markdown += `No projects found.\n\n`;
    } else {
      projects.forEach((proj) => {
        const start = formatDate(proj.timeline.start);
        const end = proj.completed ? formatDate(proj.timeline.end) : "In Progress";
        markdown += `### ${proj.title}\n`;
        markdown += `- **Status**: ${proj.completed ? "Completed" : "In Progress"}\n`;
        markdown += `- **Timeline**: ${start} - ${end}\n`;
        if (proj.madeAt) {
          markdown += `- **Context/Made At**: ${proj.madeAt}\n`;
        }
        markdown += `- **Team Size**: ${proj.teamSize} person(s)\n`;
        if (proj.githubUrl) {
          markdown += `- **GitHub Repository**: ${proj.githubUrl}\n`;
        }
        if (proj.liveUrl) {
          markdown += `- **Live Demo**: ${proj.liveUrl}\n`;
        }
        if (proj.skills && proj.skills.length > 0) {
          markdown += `- **Skills/Technologies Used**: ${proj.skills.join(", ")}\n`;
        }
        if (proj.tags && proj.tags.length > 0) {
          markdown += `- **Tags**: ${proj.tags.join(", ")}\n`;
        }
        if (proj.description && proj.description.length > 0) {
          markdown += `- **Project Details**:\n`;
          proj.description.forEach((desc) => {
            markdown += `  * ${desc}\n`;
          });
        }
        markdown += `\n`;
      });
    }

    markdown += `## Resume & Contact Links\n`;
    if (resumeLink) {
      markdown += `- **Active Resume**: Download or view at ${resumeLink.url} (Name: ${resumeLink.name})\n`;
    }
    markdown += `- **GitHub Profile**: https://github.com/PerHac13\n`;
    markdown += `- **Contact Instruction**: Visitors can reach out to Abdullah through the contact form at the bottom of the home page.\n`;
    markdown += `\n`;

    if (extractedResumeText) {
      markdown += `## Shaikh Abdullah's Full Resume Details (Parsed from Active PDF)\n`;
      markdown += `Below is the complete text content extracted directly from Abdullah's active resume PDF. Use this to find additional details, projects, languages, publications, or technical aspects not fully described above:\n\n`;
      markdown += `\`\`\`text\n${extractedResumeText}\n\`\`\`\n\n`;
    }

    return markdown;
  } catch (error) {
    console.error("Error generating portfolio context:", error);
    return `Error generating context from database.`;
  }
}
