// Configuration for Google Sheets Backend

// 1. Create a Google Sheet
// 2. Add two tabs: "Announcements" and "Settings"
// 3. File > Share > Publish to web > Entire Document > csv
// 4. Copy the ID from the URL between /d/ and /pub...
const SHEET_ID = '1JJ70QMPd6xzKfViPAOylOxaBEhts9XY1Ev2G86hwTn8'; // Updated with User ID

// GID is the ID of the specific tab. usually:
// Tab 1 (Announcements) = 0
// Tab 2 (Settings) = find "gid=" in the address bar when you click the tab
const SHEET_GIDS = {
    announcements: '0',
    settings: '1679273170' // Updated with User GID
};
