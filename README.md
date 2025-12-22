# Employee Cards Directory

A static, no-backend employee directory and profile system hosted on GitHub Pages. Employees are stored as simple folder structures, and IT can manage the directory using only the GitHub web interface.

**Live Site:** https://centerlink-technologies.github.io/employee-cards/

## What Is This?

This is a **public-facing employee directory** that allows:

- **Employees and HR**: Use an HTML form to generate a complete employee folder as a ZIP file
- **IT**: Upload the ZIP contents to GitHub, add a single line to a configuration file, and the employee appears on the directory and profile pages
- **Public/Visitors**: Browse the directory, view individual profiles with headshots and bios, download vCards, and scan QR codes

**No backend server, no database, no build process** — everything runs client-side on GitHub Pages.

## Folder Structure

```
/employee-cards/
  ├── index.html              ← Form page (landing)
  ├── directory.html          ← Company directory listing
  ├── profile.html            ← Individual profile template
  ├── manage.html             ← IT management helper
  ├── style.css               ← All styling
  ├── main.js                 ← All JavaScript logic
  │
  ├── /libs/
  │   ├── jszip.min.js        ← ZIP creation (client-side)
  │   └── qrcode.min.js       ← QR code generator
  │
  └── /example/
      └── /john-doe/          ← Example employee folder
          ├── data.json       ← Employee metadata
          ├── contact.vcf     ← vCard file
          ├── headshot.jpg    ← Profile photo
          ├── hiking.gif      ← Bio media (optional)
          ├── lab-setup.jpg   ← Bio media (optional)
          └── team-photo.jpg  ← Bio media (optional)
```

**Each employee** is a folder named `firstname-lastname` (lowercase, hyphenated) containing:
- `data.json` — Name, email, bio, media references
- `contact.vcf` — vCard file for importing into contacts
- `headshot.jpg/png/webp` — Profile photo
- Optional media files (GIFs, JPGs, PNGs, WebPs) for the bio

## Deployment to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Name it: `employee-cards`
3. Click **Create Repository**

### Step 2: Set Up GitHub Pages

1. Go to your repository: https://github.com/centerlink-technologies/employee-cards
2. Click **Settings** (gear icon, top right)
3. In the left menu, click **Pages**
4. Under "Build and deployment":
   - **Source** → Select **Deploy from a branch**
   - **Branch** → Select **main** and folder **(root)**
   - Click **Save**
5. Wait 1–2 minutes. You'll see a green checkmark with your live URL:  
   `https://centerlink-technologies.github.io/employee-cards/`

### Step 3: Upload Project Files to GitHub (Web UI)

1. Go to your repository home: https://github.com/centerlink-technologies/employee-cards
2. Click **Add file** → **Upload files**
3. Drag and drop (or select) these files/folders:
   - `index.html`
   - `directory.html`
   - `profile.html`
   - `manage.html`
   - `style.css`
   - `main.js`
   - `/libs/` folder (with `jszip.min.js` and `qrcode.min.js`)
   - `/example/` folder (optional, for reference)
4. Click **Commit changes**
5. Your site is now live! ✅

## IT Workflow: Managing Employees

### Test the Site First

Before adding employees, verify everything is working:

- **Form page:** https://centerlink-technologies.github.io/employee-cards/
- **Directory page:** https://centerlink-technologies.github.io/employee-cards/directory.html
- **Manage page:** https://centerlink-technologies.github.io/employee-cards/manage.html
- **Example profile:** https://centerlink-technologies.github.io/employee-cards/profile.html?person=john-doe

---

## Adding an Employee

### Option A: Using the Web Form (Easiest)

1. Go to https://centerlink-technologies.github.io/employee-cards/
2. Fill in the form:
   - First & Last Name
   - Email, Phone (optional)
   - Job Title, Department
   - LinkedIn URL (optional)
   - Bio (write plain text or HTML)
   - **Headshot image** (required — JPG, PNG, or WebP)
   - **Additional media** (optional — GIFs, images for the bio)
3. Click **Generate Employee Card ZIP**
4. Download the ZIP file (e.g., `john-smith-employee-card.zip`)

### Step 2: Upload to GitHub (Web UI)

1. Go to your repository: https://github.com/centerlink-technologies/employee-cards
2. Click **Add file** → **Upload files**
3. **In the file upload dialog:**
   - You need to upload the **folder inside the ZIP**, not the ZIP itself
   - First, unzip the file locally to see the structure
   - Example: If the ZIP contains `john-smith/`, drag that folder into GitHub
4. Drag and drop the employee folder (e.g., `john-smith/` with `data.json`, `contact.vcf`, `headshot.jpg`, etc.)
5. Click **Commit changes**

### Step 3: Register the Employee in main.js

1. Go to your repository files: https://github.com/centerlink-technologies/employee-cards
2. Click on `main.js` to open it
3. Click the **Edit** button (pencil icon)
4. Find this line (near the top):
   ```javascript
   const EMPLOYEE_SLUGS = ["john-doe", "jane-smith"];
   ```
5. Add the new employee's slug in **lowercase hyphenated format**:
   ```javascript
   const EMPLOYEE_SLUGS = ["john-doe", "jane-smith", "john-smith"];
   ```
6. Click **Commit changes**

### Step 4: Verify

Wait 1–2 minutes for GitHub to update, then:
- Check the **directory page:** https://centerlink-technologies.github.io/employee-cards/directory.html (new card should appear)
- Check the **profile page:** https://centerlink-technologies.github.io/employee-cards/profile.html?person=john-smith
- Check the **manage page:** https://centerlink-technologies.github.io/employee-cards/manage.html (new employee should list)

---

## Updating an Employee

### Update Their Profile

1. Go to your repository: https://github.com/centerlink-technologies/employee-cards
2. Navigate to the employee folder (e.g., `john-smith/`)
3. Click on `data.json`
4. Click **Edit** (pencil icon)
5. Update any fields:
   - `firstName`, `lastName`
   - `title`, `department`
   - `email`, `phone`, `linkedin`
   - `bioHtml` (their bio text)
6. Click **Commit changes**

### Update Their Headshot or Media

1. Go to the employee folder (e.g., `john-smith/`)
2. Click on the file you want to replace (e.g., `headshot.jpg`)
3. Click **Delete** (trash icon) → Confirm
4. Go back to the folder
5. Click **Add file** → **Upload files**
6. Upload the new image with the **same filename**
7. Click **Commit changes**

---

## Removing an Employee

### Step 1: Delete the Employee Folder

1. Go to your repository: https://github.com/centerlink-technologies/employee-cards
2. Open the employee folder (e.g., `john-smith/`)
3. Click on each file and **Delete** it (trash icon), confirming each time
4. Go back to the main repository and delete the now-empty folder

### Step 2: Remove from main.js

1. Go to `main.js`
2. Click **Edit** (pencil icon)
3. Find this line:
   ```javascript
   const EMPLOYEE_SLUGS = ["john-doe", "jane-smith", "john-smith"];
   ```
4. Remove the employee's slug:
   ```javascript
   const EMPLOYEE_SLUGS = ["john-doe", "jane-smith"];
   ```
5. Click **Commit changes**

### Step 3: Verify

Wait 1–2 minutes, then:
- **Directory page** should no longer show them
- **Manage page** should no longer list them
- **Direct profile link** (e.g., `?person=john-smith`) will show "Employee not found"

---

## Test URLs for IT

Keep these bookmarked:

| Page | URL |
|------|-----|
| **Form** (Add Employee) | https://centerlink-technologies.github.io/employee-cards/ |
| **Directory** (All Employees) | https://centerlink-technologies.github.io/employee-cards/directory.html |
| **Manage** (IT Helper) | https://centerlink-technologies.github.io/employee-cards/manage.html |
| **Example Profile** (John Doe) | https://centerlink-technologies.github.io/employee-cards/profile.html?person=john-doe |

---

## Technical Details (for reference)

- **No backend:** All logic runs in the browser (JavaScript)
- **No database:** Employee data is stored as `data.json` files in folders
- **No build process:** Just edit files in GitHub and commit
- **Offline-friendly:** Once loaded, the directory works without internet (except for media loading)
- **Modern browsers only:** Requires ES6 JavaScript and fetch API (works on all modern browsers)

### How It Works

1. **Form page** (`index.html`) collects employee info and uses **jszip.js** to generate a ZIP
2. **Directory page** (`directory.html`) reads the `EMPLOYEE_SLUGS` array in `main.js`, fetches each `data.json`, and renders cards
3. **Profile page** (`profile.html`) reads the `?person=` query parameter, fetches that employee's `data.json`, and renders their full profile with **qrcode.js**-generated QR codes
4. **Manage page** (`manage.html`) lists all employees from `EMPLOYEE_SLUGS` to help IT see what exists

### File Naming Convention

Employee folders use the format: `firstname-lastname` (all lowercase, spaces replaced with hyphens)

Examples:
- `john-doe`
- `jane-smith`
- `mary-johnson-smith` (three-word names are fine)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Employee doesn't appear on directory | Check that the slug is in `EMPLOYEE_SLUGS` in `main.js` |
| Headshot doesn't load | Check the filename in `data.json` matches the actual file name |
| vCard download doesn't work | Try a different browser (some browsers block Blob downloads) |
| QR code doesn't load | Make sure `qrcode.min.js` is uploaded to `/libs/` |
| ZIP generation fails | Try uploading with a different file format (PNG instead of JPG) |

---

## Questions?

- Check the **Manage page** for instructions: https://centerlink-technologies.github.io/employee-cards/manage.html
- Review the example employee folder (`/example/john-doe/`) for structure reference
- Test with the form page first to understand the expected data format

---

**Last Updated:** December 2025  
**Project:** Employee Cards Directory v1.0
