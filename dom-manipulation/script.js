let quotes = []; 

// --- Configuration for Server Sync ---
// A mock API URL. JSONPlaceholder 'posts' are generic, we'll adapt them for quotes.
const SERVER_API_URL = 'https://jsonplaceholder.typicode.com/posts'; 
const SYNC_INTERVAL = 30000; // Sync every 30 seconds (for periodic checking)

// --- Function to save the current quotes array to Local Storage. ---
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// --- Function to load quotes from Local Storage when the application initializes. ---
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Work" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
            { text: "Strive not to be a success, but but rather to be of value.", category: "Motivation" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
            { text: "The best way to predict the future is to create it.", category: "Action" }
        ];
        saveQuotes();
    }
}

// --- Function to display a random quote, considering the selected filter. ---
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    const selectedCategory = localStorage.getItem('selectedCategory') || 'all'; 

    let filteredQuotes = quotes;
    if (selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `No quotes found for category: "${selectedCategory}". Add some!`;
        sessionStorage.setItem('lastViewedQuote', 'No quotes yet for this filter.');
        return; 
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    quoteDisplay.innerHTML = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
    sessionStorage.setItem('lastViewedQuote', randomQuote.text);
    updateSessionStorageDisplay();
}

// --- Helper function to retrieve and display the last viewed quote from session storage. ---
function updateSessionStorageDisplay() {
    const lastQuote = sessionStorage.getItem('lastViewedQuote');
    const displayElement = document.getElementById('sessionStorageDisplay');
    if (lastQuote) {
        displayElement.textContent = `Last viewed quote (session): "${lastQuote}"`;
    } else {
        displayElement.textContent = `No quote viewed in this session yet.`;
    }
}

// --- Function to dynamically create the quote addition form. ---
function createAddQuoteForm() {
    const formContainer = document.getElementById('addQuoteFormContainer');
    const formDiv = document.createElement('div');
    formDiv.id = 'quoteAdditionForm'; 

    const quoteTextInput = document.createElement('input');
    quoteTextInput.id = 'newQuoteText'; 
    quoteTextInput.type = 'text'; 
    quoteTextInput.placeholder = 'Enter a new quote'; 

    const quoteCategoryInput = document.createElement('input');
    quoteCategoryInput.id = 'newQuoteCategory'; 
    quoteCategoryInput.type = 'text'; 
    quoteCategoryInput.placeholder = 'Enter quote category'; 

    const addQuoteButton = document.createElement('button');
    addQuoteButton.textContent = 'Add Quote'; 
    addQuoteButton.onclick = addQuote;

    formDiv.appendChild(quoteTextInput);
    formDiv.appendChild(quoteCategoryInput);
    formDiv.appendChild(addQuoteButton);

    formContainer.appendChild(formDiv);
}

// --- Function to add a new quote to the array and update storage/display. ---
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both quote text and category."); 
        return; 
    }

    const newQuote = {
        text: newQuoteText,
        category: newQuoteCategory
    };

    quotes.push(newQuote);
    saveQuotes();

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    populateCategories();
    showRandomQuote();
    alert("Quote added successfully!");

    // --- NEW: Attempt to post the new quote to the server ---
    postQuoteToServer(newQuote);
}

// --- Function to export all quotes to a JSON file. ---
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob); 

    const exportFileName = 'quotes.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    URL.revokeObjectURL(url); 
    linkElement.remove();
}

// --- Function to import quotes from a selected JSON file. ---
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return; 
    }

    const fileReader = new FileReader();

    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);

            if (Array.isArray(importedQuotes) && importedQuotes.every(q => typeof q === 'object' && q !== null && 'text' in q && 'category' in q)) {
                // For this task, we'll replace current quotes with imported ones, and then sync.
                quotes = importedQuotes; 
                saveQuotes(); 
                populateCategories(); 
                showRandomQuote(); 
                alert('Quotes imported successfully! Syncing with server...');
                syncQuotes(); // Trigger immediate sync after import
            } else {
                alert('Error: Invalid JSON format. Expected an array of quote objects with "text" and "category" properties.');
            }
        } catch (e) {
            alert('Error parsing JSON file: ' + e.message);
        } finally {
            event.target.value = ''; 
        }
    };

    fileReader.readAsText(file); 
}

// --- Function to populate the category filter dropdown. ---
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
    uniqueCategories.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const lastSelectedCategory = localStorage.getItem('selectedCategory');
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
    }
}

// --- Function to filter quotes based on selected category. ---
function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;

    localStorage.setItem('selectedCategory', selectedCategory);
    showRandomQuote();
}

// --- NEW FUNCTION: fetchQuotesFromServer() ---
// Fetches data from the simulated server.
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const serverData = await response.json();
        // Adapt JSONPlaceholder posts to our quote format:
        // Assume 'title' is quote text and 'body' is category
        const serverQuotes = serverData.map(item => ({
            text: item.title,
            category: item.body ? item.body.split(' ')[0] : 'General' // Take first word of body as category
        }));
        return serverQuotes;
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
        displaySyncStatus('error', `Failed to fetch from server: ${error.message}`);
        return null;
    }
}

// --- NEW FUNCTION: postQuoteToServer() ---
// Simulates posting a new quote to the server.
async function postQuoteToServer(newQuote) {
    try {
        const response = await fetch(SERVER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: newQuote.text,
                body: newQuote.category,
                userId: 1, // JSONPlaceholder requires a userId
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Quote posted to server:", data);
        displaySyncStatus('success', 'New quote synced to server!');
        // Note: JSONPlaceholder doesn't actually save, it just simulates.
        // For a real app, you'd get the actual ID/data from server and update local.

    } catch (error) {
        console.error("Error posting quote to server:", error);
        displaySyncStatus('error', `Failed to post to server: ${error.message}`);
    }
}

// --- NEW FUNCTION: syncQuotes() ---
// Synchronizes local quotes with server data using a conflict resolution strategy.
async function syncQuotes() {
    displaySyncStatus('info', 'Syncing with server...');
    const serverQuotes = await fetchQuotesFromServer();

    if (!serverQuotes) {
        displaySyncStatus('error', 'Sync failed: Could not fetch server data.');
        return;
    }

    let conflictsResolved = 0;
    let newQuotesAdded = 0;

    // Conflict Resolution: Server data takes precedence.
    // We'll create a new array, starting with server quotes, then adding local ones that don't conflict.
    const mergedQuotes = [...serverQuotes]; 

    quotes.forEach(localQ => {
        // Check if the local quote (by text and category) already exists in the serverQuotes.
        const serverMatch = serverQuotes.find(serverQ => 
            serverQ.text === localQ.text && serverQ.category === localQ.category
        );

        if (!serverMatch) {
            // Local quote is not on the server (or has a different text/category), add it to merged.
            mergedQuotes.push(localQ);
            newQuotesAdded++; // Count as a new quote for notification if it's unique
        }
    });

    // Update local 'quotes' array with the merged data.
    quotes = mergedQuotes;
    saveQuotes(); // Save the new merged state to local storage

    // Update UI elements
    populateCategories();
    showRandomQuote(); // Display a quote from the updated list

    let syncMessage = 'Sync complete!';
    if (newQuotesAdded > 0) {
        syncMessage += ` ${newQuotesAdded} local quotes pushed or unique quotes added from server.`;
    }
    displaySyncStatus('success', syncMessage);
}


// --- NEW FUNCTION: displaySyncStatus(type, message) ---
// Displays notification to the user about sync status.
function displaySyncStatus(type, message) {
    const syncStatusDiv = document.getElementById('syncStatus');
    syncStatusDiv.textContent = message;
    // Reset all status classes first
    syncStatusDiv.className = ''; 
    syncStatusDiv.classList.add('sync-status'); // Always apply base class

    if (type === 'success') {
        syncStatusDiv.classList.add('sync-success');
    } else if (type === 'error') {
        syncStatusDiv.classList.add('sync-error');
    } else if (type === 'info') {
        syncStatusDiv.classList.add('sync-info'); 
    }
    syncStatusDiv.style.display = 'block';

    // Hide after a few seconds
    setTimeout(() => {
        syncStatusDiv.style.display = 'none';
    }, 5000);
}


// --- Initial Page Load Setup. ---
document.addEventListener('DOMContentLoaded', function() {
    loadQuotes();
    createAddQuoteForm();
    populateCategories();
    updateSessionStorageDisplay();

    const newQuoteButton = document.getElementById('newQuote');
    newQuoteButton.addEventListener('click', showRandomQuote);

    const exportButton = document.getElementById('exportQuotes');
    exportButton.addEventListener('click', exportToJsonFile);

    // Attach event listener for the Sync Now button
    const syncNowButton = document.getElementById('syncNow');
    syncNowButton.addEventListener('click', syncQuotes);

    // --- NEW: Implement periodic data fetching/syncing ---
    setInterval(syncQuotes, SYNC_INTERVAL);

    // The event listener for importFile is handled directly in HTML via onchange="importFromJsonFile(event)".
});
