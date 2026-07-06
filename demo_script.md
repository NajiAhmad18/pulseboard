# Weekly Report Generator - Demo Script

**Target Length: 5 - 7 Minutes**
**Preparation:** Ensure your local MongoDB is running, both frontend and backend servers are running, and you have seeded the admin user.

---

## Part 1: Member Workflow (2 mins)

**(Action: Open browser to `http://localhost:5173`)**

* **Voiceover:** "Hello, my name is [Your Name], and this is my submission for the Software Engineering Internship technical assignment. I've built the Weekly Report Generator as a full-stack SaaS application. Let's start by looking at the Team Member experience."

**(Action: Click 'Register'. Fill out name: 'John Doe', email: 'john@example.com', password: 'password123'.)**

* **Voiceover:** "When a new employee joins, they can register for an account. By default, the system securely assigns them a 'member' role to ensure data isolation."

**(Action: App redirects to Member Dashboard. Point out empty states.)**

* **Voiceover:** "Upon logging in, John sees his personal dashboard. Right now, it's empty. Let's create his first weekly report."

**(Action: Click 'New Report'. Fill out dates, select a project, add tasks, and a blocker. Click 'Create Draft'.)**

* **Voiceover:** "The form utilizes React Hook Form for strict client-side validation to ensure all required fields from the assignment prompt are captured. I'll save this as a Draft."

**(Action: Show the draft in the table. Click 'Edit', change something, then click 'View'.)**

* **Voiceover:** "Members can safely edit drafts throughout the week. Once Friday arrives, they click 'View' and then 'Submit Report'."

**(Action: Click 'Submit Report'. Accept the confirmation.)**

* **Voiceover:** "Once submitted, the business logic permanently locks the report. You'll notice the edit and delete buttons are gone, and the badge turns green."

---

## Part 2: Admin Workflow & Analytics (3 mins)

* **Voiceover:** "Now, let's log out and step into the shoes of an Engineering Manager."

**(Action: Logout. Login as `admin@example.com` / `password123`.)**

* **Voiceover:** "The authentication context recognizes the Admin role and routes me to the executive Team Dashboard. Here we see real-time analytics."

**(Action: Hover over the Recharts Bar and Pie charts.)**

* **Voiceover:** "I integrated Recharts to visualize team velocity. We can see submission compliance rates, pending drafts, and crucially, how many open blockers exist across the team. We can also see workload distribution across different projects."

**(Action: Navigate to 'Projects' on the sidebar.)**

* **Voiceover:** "Admins have exclusive access to manage the Project tags that members use. This is fully protected by backend middleware."

**(Action: Navigate to 'Reports' on the sidebar.)**

* **Voiceover:** "In the Reports view, a manager can see every submission from the entire team. If I only want to see what John Doe did, or filter by a specific project, I can use these dynamic dropdowns."

**(Action: Use the dropdown to filter by 'John Doe'. Click 'View' on John's report.)**

* **Voiceover:** "Clicking 'View' provides the manager a clean, read-only view of the report details to review tasks and blockers."

---

## Part 3: Gemini AI Assistant (1.5 mins)

**(Action: Navigate back to Admin Dashboard. Scroll to AI Assistant.)**

* **Voiceover:** "Finally, as a 'Good-to-have' feature, I integrated Google's Gemini AI directly into the dashboard to act as an intelligent assistant for the manager."

**(Action: Type in the box: "Are there any blockers reported this week? How can I help my team?")**

* **Voiceover:** "The backend securely fetches the text of recent reports and feeds it to the LLM. I can ask natural language questions about team status. For example, asking about blockers."

**(Action: Wait for AI response. Read a summary of what it says.)**

* **Voiceover:** "The AI successfully identifies John's blocker and provides a summary without the manager needing to read every individual report manually."

---

## Conclusion (30 seconds)

* **Voiceover:** "In summary, this application was built with React, Node.js, Express, and MongoDB. I focused heavily on role-based security, data validation, and a professional user interface. Thank you for your time, and I look forward to discussing the code with you."
