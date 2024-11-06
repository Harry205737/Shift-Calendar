const githubToken = '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'; // Replace with your GitHub Personal Access Token
const githubRepo = 'Harry205737/Shift-Calendar'; // Replace with your GitHub repo name
const filePath = 'calendarData.json'; // File to store calendar data
const branch = 'main'; // Branch name

// Load calendar data from GitHub when the page loads
document.addEventListener("DOMContentLoaded", loadCalendar);

// Function to load calendar data from GitHub
async function loadCalendar() {
    try {
        const response = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}?ref=${branch}`, {
            headers: {
                Authorization: `token ${githubToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Could not load calendar data');
        }

        const fileData = await response.json();
        const content = JSON.parse(atob(fileData.content)); // Decode base64 content

        // Load the calendar data into localStorage
        for (const key in content) {
            localStorage.setItem(key, JSON.stringify(content[key]));
        }

        // Populate the calendar on the page
        generateCalendar(currentYear);
    } catch (error) {
        console.error('Failed to load calendar:', error);
    }
}

// Function to save calendar data to GitHub
async function saveCalendar() {
    // Gather all calendar data from localStorage
    const calendarData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        calendarData[key] = JSON.parse(localStorage.getItem(key));
    }

    try {
        // Check if the file already exists to get its SHA
        const getFileResponse = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}?ref=${branch}`, {
            headers: {
                Authorization: `token ${githubToken}`,
            },
        });

        let sha = null;
        if (getFileResponse.ok) {
            const fileData = await getFileResponse.json();
            sha = fileData.sha; // Get the current file SHA for updates
        }

        // Save the updated calendar data to GitHub
        const response = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                Authorization: `token ${githubToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Update calendar data',
                content: btoa(JSON.stringify(calendarData)),
                branch: branch,
                sha: sha,
            }),
        });

        if (!response.ok) {
            throw new Error('Could not save calendar data');
        }

        alert('Calendar saved successfully to GitHub!');
    } catch (error) {
        console.error('Failed to save calendar:', error);
        alert('Failed to save calendar to GitHub.');
    }
}
