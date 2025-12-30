/**
 * Employee Cards - Main JavaScript Logic
 * Pure client-side, no backend required.
 */

// ===========================
// Configuration
// ===========================

const EMPLOYEE_SLUGS = ["michael-kidder", "bobby-latina", "connor-thomas", "michael-mulhearn", "mykal-mills", "stephen-stephano"];

// Base URL for the site (deployed at /employee-cards/)
const BASE_URL = '/employee-cards';
// Full URL for QR codes (absolute URL)
const FULL_BASE_URL = 'https://centerlink-technologies.github.io/employee-cards';

// ===========================
// Utility Functions
// ===========================

/**
 * Parse query string parameters
 * @param {string} param - Parameter name to retrieve
 * @returns {string|null} - Parameter value or null
 */
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

/**
 * Generate slug from first and last name
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string} - lowercase hyphen-separated slug
 */
function generateSlug(firstName, lastName) {
  return (firstName + '-' + lastName)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Build profile URL for an employee
 * @param {string} slug
 * @returns {string} - Full profile URL
 */
function buildProfileUrl(slug) {
  return FULL_BASE_URL + '/profile.html?person=' + encodeURIComponent(slug);
}

/**
 * Build vCard 3.0 string
 * @param {object} employee - Employee data object
 * @returns {string} - vCard formatted string
 */
function buildVcard(employee) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:' + employee.firstName + ' ' + employee.lastName,
    'N:' + employee.lastName + ';' + employee.firstName + ';;;',
    'TITLE:' + employee.title,
    'ORG:Centerlink Technologies',
    'EMAIL:' + employee.email
  ];

  if (employee.phone) {
    lines.push('TEL:' + employee.phone);
  }

  const profileUrl = buildProfileUrl(employee.slug);
  lines.push('URL:' + profileUrl);

  lines.push('END:VCARD');

  return lines.join('\r\n');
}

/**
 * Extract file extension from filename
 * @param {string} filename
 * @returns {string} - Extension including dot
 */
function getFileExtension(filename) {
  const parts = filename.split('.');
  return parts.length > 1 ? '.' + parts[parts.length - 1] : '';
}

/**
 * Fetch JSON data from a URL
 * @param {string} url
 * @returns {Promise} - Resolves with parsed JSON or rejects with error
 */
function fetchJson(url) {
  return fetch(url)
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Failed to fetch ' + url + ': ' + response.status);
      }
      return response.json();
    });
}

/**
 * Fetch file as blob
 * @param {string} url
 * @returns {Promise} - Resolves with Blob
 */
function fetchBlob(url) {
  return fetch(url)
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Failed to fetch ' + url + ': ' + response.status);
      }
      return response.blob();
    });
}

/**
 * Trigger a file download via Blob + link
 * @param {Blob} blob
 * @param {string} filename
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Show error message on page
 * @param {string} message
 */
function showError(message) {
  const errorContainer = document.getElementById('errorContainer');
  const errorMessage = document.getElementById('errorMessage');
  if (errorContainer && errorMessage) {
    errorMessage.textContent = message;
    errorContainer.style.display = 'block';
  } else {
    console.error(message);
  }
}

/**
 * Hide error message
 */
function hideError() {
  const errorContainer = document.getElementById('errorContainer');
  if (errorContainer) {
    errorContainer.style.display = 'none';
  }
}

// ===========================
// Form Page (index.html)
// ===========================

function initFormPage() {
  const form = document.getElementById('employeeForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit();
  });

  // Reset preview visibility
  const preview = document.getElementById('preview');
  if (preview) {
    preview.style.display = 'none';
  }

  // Initialize rich editor toolbar
  initBioEditor();

  // Initialize headshot preview
  initHeadshotPreview();

  // New employee button
  const newEmployeeBtn = document.getElementById('newEmployeeBtn');
  if (newEmployeeBtn) {
    newEmployeeBtn.addEventListener('click', function() {
      form.reset();
      const bioEditor = document.getElementById('bioEditor');
      if (bioEditor) {
        bioEditor.innerHTML = '';
      }
      const headshotPreview = document.getElementById('headshotPreview');
      if (headshotPreview) {
        headshotPreview.style.display = 'none';
      }
      const preview = document.getElementById('preview');
      if (preview) {
        preview.style.display = 'none';
      }
      hideError();
    });
  }
}

function initHeadshotPreview() {
  const headshotInput = document.getElementById('headshot');
  const headshotPreview = document.getElementById('headshotPreview');
  const headshotImage = document.getElementById('headshotImage');
  const replaceHeadshotBtn = document.getElementById('replaceHeadshotBtn');

  if (!headshotInput) return;

  headshotInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        if (headshotImage) {
          headshotImage.src = event.target.result;
        }
        if (headshotPreview) {
          headshotPreview.style.display = 'block';
        }
      };
      reader.readAsDataURL(file);
    }
  });

  if (replaceHeadshotBtn) {
    replaceHeadshotBtn.addEventListener('click', function(e) {
      e.preventDefault();
      headshotInput.click();
    });
  }
}

function initBioEditor() {
  const btnBold = document.getElementById('btnBold');
  const btnItalic = document.getElementById('btnItalic');
  const btnUnderline = document.getElementById('btnUnderline');
  const btnHeading = document.getElementById('btnHeading');
  const btnLink = document.getElementById('btnLink');
  const btnImage = document.getElementById('btnImage');
  const btnClearFormat = document.getElementById('btnClearFormat');
  const bioImageUpload = document.getElementById('bioImageUpload');

  if (btnBold) {
    btnBold.addEventListener('click', function(e) {
      e.preventDefault();
      document.execCommand('bold', false, null);
    });
  }

  if (btnItalic) {
    btnItalic.addEventListener('click', function(e) {
      e.preventDefault();
      document.execCommand('italic', false, null);
    });
  }

  if (btnUnderline) {
    btnUnderline.addEventListener('click', function(e) {
      e.preventDefault();
      document.execCommand('underline', false, null);
    });
  }

  if (btnHeading) {
    btnHeading.addEventListener('click', function(e) {
      e.preventDefault();
      document.execCommand('formatBlock', false, '<h2>');
    });
  }

  if (btnLink) {
    btnLink.addEventListener('click', function(e) {
      e.preventDefault();
      const url = prompt('Enter URL:');
      if (url) {
        document.execCommand('createLink', false, url);
      }
    });
  }

  if (btnImage) {
    btnImage.addEventListener('click', function(e) {
      e.preventDefault();
      bioImageUpload.click();
    });
  }

  if (btnClearFormat) {
    btnClearFormat.addEventListener('click', function(e) {
      e.preventDefault();
      document.execCommand('removeFormat', false, null);
    });
  }

  if (bioImageUpload) {
    bioImageUpload.addEventListener('change', function(e) {
      const files = e.target.files;
      if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
          const bioEditor = document.getElementById('bioEditor');
          if (bioEditor) {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '4px';
            img.style.margin = '10px 0';
            img.style.display = 'block';
            img.title = file.name;
            bioEditor.appendChild(img);
            bioEditor.focus();
          }
        };
        reader.readAsDataURL(file);
        bioImageUpload.value = '';
      }
    });
  }
}

function handleFormSubmit() {
  hideError();

  // Check if JSZip is available
  if (typeof JSZip === 'undefined') {
    showError('Error: ZIP library is not loaded. Please ensure jszip.min.js is properly loaded.');
    console.error('JSZip is not defined');
    return;
  }

  // Collect form data
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const title = document.getElementById('title').value.trim();
  const department = document.getElementById('department').value.trim();
  const linkedin = document.getElementById('linkedin').value.trim();
  const bioEditor = document.getElementById('bioEditor');
  const bioHtml = bioEditor ? bioEditor.innerHTML.trim() : '';
  const headshotInput = document.getElementById('headshot');

  // Validate required fields
  if (!firstName || !lastName || !email || !title || !department || !bioHtml) {
    showError('Please fill in all required fields, including a bio.');
    return;
  }

  if (!headshotInput.files.length) {
    showError('Please upload a headshot image.');
    return;
  }

  // Generate slug
  const slug = generateSlug(firstName, lastName);

  // Get headshot file
  const headshotFile = headshotInput.files[0];
  const headshotExt = getFileExtension(headshotFile.name);
  const headshotFilename = 'headshot' + headshotExt;

  // Extract embedded images from bio and collect media files
  const bioImages = extractMediaFromBio(bioHtml);
  const media = [];
  let bioHtmlWithLocalPaths = bioHtml;

  // Convert data URLs in bioHtml to filenames
  bioImages.forEach(function(img, index) {
    if (img.src.startsWith('data:')) {
      const filename = 'bio-image-' + (index + 1) + getFileExtension(img.file.name || '.gif');
      media.push({
        filename: filename,
        file: img.file
      });
      bioHtmlWithLocalPaths = bioHtmlWithLocalPaths.replace(img.src, filename);
    }
  });

  // Build data.json
  const employeeData = {
    slug: slug,
    firstName: firstName,
    lastName: lastName,
    title: title,
    department: department,
    email: email,
    phone: phone || null,
    linkedin: linkedin || null,
    headshot: headshotFilename,
    bioHtml: bioHtmlWithLocalPaths,
    media: media.map(function(m) { return m.filename; })
  };

  // Build vCard
  const vcard = buildVcard(employeeData);

  // Build profile URL
  const profileUrl = buildProfileUrl(slug);

  // Create ZIP
  createEmployeeZip(slug, employeeData, vcard, headshotFile, media)
    .then(function(zip) {
      showFormPreview(slug, profileUrl, vcard, zip, employeeData, headshotFile, media);
    })
    .catch(function(error) {
      showError('Error creating ZIP: ' + error.message);
      console.error('ZIP creation error:', error);
    });
}

function extractMediaFromBio(bioHtml) {
  const div = document.createElement('div');
  div.innerHTML = bioHtml;
  const imgs = div.querySelectorAll('img');
  const media = [];

  imgs.forEach(function(img) {
    if (img.src.startsWith('data:')) {
      media.push({
        src: img.src,
        file: dataUrlToFile(img.src, img.title || 'image.gif')
      });
    }
  });

  return media;
}

function dataUrlToFile(dataUrl, filename) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new File([u8arr], filename, { type: mime });
}

function createEmployeeZip(slug, employeeData, vcard, headshotFile, mediaFiles) {
  return new Promise(function(resolve, reject) {
    const zip = new JSZip();
    const folder = zip.folder(slug);

    // Add data.json
    folder.file('data.json', JSON.stringify(employeeData, null, 2));

    // Add vCard
    folder.file('contact.vcf', vcard);

    // Add headshot
    folder.file(employeeData.headshot, headshotFile);

    // Add media files
    let mediaProcessed = 0;
    const totalMedia = mediaFiles.length;

    if (totalMedia === 0) {
      // No media files, generate ZIP immediately
      zip.generateAsync({ type: 'blob' }).then(resolve).catch(reject);
    } else {
      mediaFiles.forEach(function(media) {
        folder.file(media.filename, media.file);
        mediaProcessed++;
        if (mediaProcessed === totalMedia) {
          zip.generateAsync({ type: 'blob' }).then(resolve).catch(reject);
        }
      });
    }
  });
}

function showFormPreview(slug, profileUrl, vcard, zipBlob, employeeData, headshotFile, mediaFiles) {
  const form = document.getElementById('employeeForm');
  const preview = document.getElementById('preview');
  const profileUrlEl = document.getElementById('profileUrl');
  const vcardPreview = document.getElementById('vcardPreview');
  const zipContents = document.getElementById('zipContents');
  const downloadZipBtn = document.getElementById('downloadZipBtn');
  const copyUrlBtn = document.getElementById('copyUrlBtn');
  const successMessage = document.getElementById('successMessage');

  // Show preview
  if (form) form.style.display = 'none';
  if (preview) preview.style.display = 'block';

  // Profile URL
  if (profileUrlEl) {
    profileUrlEl.textContent = profileUrl;
  }

  // vCard preview
  if (vcardPreview) {
    vcardPreview.textContent = vcard;
  }

  // ZIP contents
  if (zipContents) {
    zipContents.innerHTML = '';
    const items = [
      slug + '/data.json',
      slug + '/contact.vcf',
      slug + '/' + employeeData.headshot
    ];
    mediaFiles.forEach(function(media) {
      items.push(slug + '/' + media.filename);
    });
    items.forEach(function(item) {
      const li = document.createElement('li');
      li.textContent = item;
      zipContents.appendChild(li);
    });
  }

  // Success message
  if (successMessage) {
    successMessage.textContent = 'ZIP created successfully! Download and upload the ' + slug + '/ folder to GitHub Pages, then add "' + slug + '" to EMPLOYEE_SLUGS in main.js.';
  }

  // Download button
  if (downloadZipBtn) {
    downloadZipBtn.onclick = function() {
      downloadBlob(zipBlob, slug + '-employee-card.zip');
    };
  }

  // Copy URL button
  if (copyUrlBtn) {
    copyUrlBtn.onclick = function() {
      navigator.clipboard.writeText(profileUrl).then(function() {
        copyUrlBtn.textContent = 'Copied!';
        setTimeout(function() {
          copyUrlBtn.textContent = 'Copy URL';
        }, 2000);
      });
    };
  }
}

// ===========================
// Directory Page (directory.html)
// ===========================

function initDirectoryPage() {
  loadDirectory();
}

function loadDirectory() {
  if (!EMPLOYEE_SLUGS || EMPLOYEE_SLUGS.length === 0) {
    showDirectoryEmpty();
    return;
  }

  const loadingMessage = document.getElementById('loadingMessage');
  const directoryGrid = document.getElementById('directoryGrid');
  const emptyMessage = document.getElementById('emptyMessage');

  if (loadingMessage) loadingMessage.style.display = 'block';
  if (directoryGrid) directoryGrid.style.display = 'none';
  if (emptyMessage) emptyMessage.style.display = 'none';

  let loaded = 0;
  let failed = 0;
  const cards = [];

  EMPLOYEE_SLUGS.forEach(function(slug, index) {
    const dataUrl = BASE_URL + '/' + slug + '/data.json';
    fetchJson(dataUrl)
      .then(function(employeeData) {
        cards[index] = employeeData;
        loaded++;
        if (loaded + failed === EMPLOYEE_SLUGS.length) {
          renderDirectoryCards(cards.filter(function(c) { return c; }));
        }
      })
      .catch(function(error) {
        console.error('Failed to load ' + slug, error);
        failed++;
        if (loaded + failed === EMPLOYEE_SLUGS.length) {
          renderDirectoryCards(cards.filter(function(c) { return c; }));
        }
      });
  });
}

function renderDirectoryCards(employees) {
  const loadingMessage = document.getElementById('loadingMessage');
  const directoryGrid = document.getElementById('directoryGrid');
  const emptyMessage = document.getElementById('emptyMessage');

  if (loadingMessage) loadingMessage.style.display = 'none';

  if (!employees || employees.length === 0) {
    showDirectoryEmpty();
    return;
  }

  if (directoryGrid) {
    directoryGrid.innerHTML = '';
    employees.forEach(function(emp) {
      const card = createEmployeeCard(emp);
      directoryGrid.appendChild(card);
    });
    directoryGrid.style.display = 'grid';
  }

  if (emptyMessage) emptyMessage.style.display = 'none';
}

function createEmployeeCard(employee) {
  const card = document.createElement('a');
  card.href = buildProfileUrl(employee.slug);
  card.className = 'employee-card';

  const headshotUrl = BASE_URL + '/' + employee.slug + '/' + employee.headshot;
  const img = document.createElement('img');
  img.src = headshotUrl;
  img.alt = employee.firstName + ' ' + employee.lastName;
  card.appendChild(img);

  const content = document.createElement('div');
  content.className = 'employee-card-content';

  const name = document.createElement('div');
  name.className = 'employee-card-name';
  name.textContent = employee.firstName + ' ' + employee.lastName;
  content.appendChild(name);

  const title = document.createElement('div');
  title.className = 'employee-card-title';
  title.textContent = employee.title;
  content.appendChild(title);

  const dept = document.createElement('div');
  dept.className = 'employee-card-department';
  dept.textContent = employee.department;
  content.appendChild(dept);

  card.appendChild(content);
  return card;
}

function showDirectoryEmpty() {
  const loadingMessage = document.getElementById('loadingMessage');
  const directoryGrid = document.getElementById('directoryGrid');
  const emptyMessage = document.getElementById('emptyMessage');

  if (loadingMessage) loadingMessage.style.display = 'none';
  if (directoryGrid) directoryGrid.style.display = 'none';
  if (emptyMessage) emptyMessage.style.display = 'block';
}

// ===========================
// Profile Page (profile.html)
// ===========================

function initProfilePage() {
  const person = getQueryParam('person');
  if (!person) {
    showProfileError('No employee specified. Use ?person={slug}');
    return;
  }

  loadProfile(person);
}

function loadProfile(slug) {
  const loadingMessage = document.getElementById('loadingMessage');
  const profileContainer = document.getElementById('profileContainer');

  if (loadingMessage) loadingMessage.style.display = 'block';
  if (profileContainer) profileContainer.style.display = 'none';

  const dataUrl = BASE_URL + '/' + slug + '/data.json';
  fetchJson(dataUrl)
    .then(function(employeeData) {
      renderProfile(employeeData);
    })
    .catch(function(error) {
      showProfileError('Employee not found: ' + slug);
    });
}

function renderProfile(employee) {
  const loadingMessage = document.getElementById('loadingMessage');
  const profileContainer = document.getElementById('profileContainer');

  if (loadingMessage) loadingMessage.style.display = 'none';
  if (profileContainer) profileContainer.style.display = 'block';

  // Headshot
  const headshotUrl = BASE_URL + '/' + employee.slug + '/' + employee.headshot;
  const headshot = document.getElementById('profileHeadshot');
  if (headshot) {
    headshot.src = headshotUrl;
    headshot.alt = employee.firstName + ' ' + employee.lastName;
  }

  // Name and basics
  const name = document.getElementById('profileName');
  if (name) {
    name.textContent = employee.firstName + ' ' + employee.lastName;
  }

  const title = document.getElementById('profileTitle');
  if (title) {
    title.textContent = employee.title;
  }

  const dept = document.getElementById('profileDepartment');
  if (dept) {
    dept.textContent = employee.department;
  }

  // Email
  const email = document.getElementById('profileEmail');
  if (email) {
    email.href = 'mailto:' + employee.email;
    email.textContent = employee.email;
  }

  // Phone
  const phone = document.getElementById('profilePhone');
  if (phone) {
    if (employee.phone) {
      phone.href = 'tel:' + employee.phone;
      phone.textContent = employee.phone;
    } else {
      phone.parentElement.style.display = 'none';
    }
  }

  // LinkedIn
  const linkedinContainer = document.getElementById('linkedinContainer');
  if (linkedinContainer) {
    if (employee.linkedin) {
      const linkedin = document.getElementById('profileLinkedin');
      if (linkedin) {
        linkedin.href = employee.linkedin;
      }
      linkedinContainer.style.display = 'flex';
    } else {
      linkedinContainer.style.display = 'none';
    }
  }

  // Bio
  const bio = document.getElementById('profileBio');
  if (bio) {
    bio.innerHTML = employee.bioHtml;
    // Rewrite media src to use absolute paths
    const imgs = bio.querySelectorAll('img');
    imgs.forEach(function(img) {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http')) {
        img.src = BASE_URL + '/' + employee.slug + '/' + src;
      }
    });
  }

  // Media gallery
  if (employee.media && employee.media.length > 0) {
    const mediaContainer = document.getElementById('mediaContainer');
    const profileMedia = document.getElementById('profileMedia');
    if (profileMedia) {
      profileMedia.innerHTML = '';
      employee.media.forEach(function(filename) {
        const img = document.createElement('img');
        img.src = BASE_URL + '/' + employee.slug + '/' + filename;
        img.alt = filename;
        profileMedia.appendChild(img);
      });
    }
    if (mediaContainer) mediaContainer.style.display = 'block';
  }

  // vCard download
  const downloadVcardBtn = document.getElementById('downloadVcardBtn');
  if (downloadVcardBtn) {
    downloadVcardBtn.addEventListener('click', function() {
      const vcard = buildVcard(employee);
      const blob = new Blob([vcard], { type: 'text/vcard' });
      downloadBlob(blob, employee.slug + '.vcf');
    });
  }

  // QR Code
  const qrcodeContainer = document.getElementById('qrcodeContainer');
  const qrcodeModalContainer = document.getElementById('qrcodeModalContainer');
  if (qrcodeContainer && window.QRCode) {
    const profileUrl = buildProfileUrl(employee.slug);
    new QRCode(qrcodeContainer, {
      text: profileUrl,
      width: 200,
      height: 200,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
    
    // Generate larger QR code for modal
    if (qrcodeModalContainer) {
      new QRCode(qrcodeModalContainer, {
        text: profileUrl,
        width: 350,
        height: 350,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
    }
    
    // Set up click handler for QR code
    const qrcodeWrapper = document.getElementById('qrcodeWrapper');
    const qrcodeModal = document.getElementById('qrcodeModal');
    const qrcodeModalClose = document.querySelector('.qrcode-modal-close');
    
    if (qrcodeWrapper && qrcodeModal) {
      qrcodeWrapper.addEventListener('click', function() {
        qrcodeModal.style.display = 'flex';
      });
      
      qrcodeModalClose.addEventListener('click', function() {
        qrcodeModal.style.display = 'none';
      });
      
      qrcodeModal.addEventListener('click', function(e) {
        if (e.target === qrcodeModal) {
          qrcodeModal.style.display = 'none';
        }
      });
    }
  }
}

function showProfileError(message) {
  const loadingMessage = document.getElementById('loadingMessage');
  const profileContainer = document.getElementById('profileContainer');
  const errorContainer = document.getElementById('errorContainer');
  const errorMessage = document.getElementById('errorMessage');

  if (loadingMessage) loadingMessage.style.display = 'none';
  if (profileContainer) profileContainer.style.display = 'none';
  if (errorMessage) errorMessage.textContent = message;
  if (errorContainer) errorContainer.style.display = 'block';
}

// ===========================
// Manage Page (manage.html)
// ===========================

function initManagePage() {
  loadManageList();
}

function loadManageList() {
  if (!EMPLOYEE_SLUGS || EMPLOYEE_SLUGS.length === 0) {
    showManageEmpty();
    return;
  }

  const loadingMessage = document.getElementById('loadingMessage');
  const employeeListContainer = document.getElementById('employeeListContainer');
  const emptyMessage = document.getElementById('emptyMessage');

  if (loadingMessage) loadingMessage.style.display = 'block';
  if (employeeListContainer) employeeListContainer.style.display = 'none';
  if (emptyMessage) emptyMessage.style.display = 'none';

  let loaded = 0;
  const employees = [];

  EMPLOYEE_SLUGS.forEach(function(slug, index) {
    const dataUrl = BASE_URL + '/' + slug + '/data.json';
    fetchJson(dataUrl)
      .then(function(employeeData) {
        employees[index] = employeeData;
        loaded++;
        if (loaded === EMPLOYEE_SLUGS.length) {
          renderManageList(employees.filter(function(e) { return e; }));
        }
      })
      .catch(function(error) {
        console.error('Failed to load ' + slug, error);
        loaded++;
        if (loaded === EMPLOYEE_SLUGS.length) {
          renderManageList(employees.filter(function(e) { return e; }));
        }
      });
  });
}

function renderManageList(employees) {
  const loadingMessage = document.getElementById('loadingMessage');
  const employeeListContainer = document.getElementById('employeeListContainer');
  const employeeList = document.getElementById('employeeList');
  const emptyMessage = document.getElementById('emptyMessage');

  if (loadingMessage) loadingMessage.style.display = 'none';

  if (!employees || employees.length === 0) {
    showManageEmpty();
    return;
  }

  if (employeeList) {
    employeeList.innerHTML = '';
    employees.forEach(function(emp) {
      const item = createManageItem(emp);
      employeeList.appendChild(item);
    });
  }

  if (employeeListContainer) employeeListContainer.style.display = 'block';
  if (emptyMessage) emptyMessage.style.display = 'none';
}

function createManageItem(employee) {
  const item = document.createElement('div');
  item.className = 'manage-item';

  const info = document.createElement('div');
  info.className = 'manage-item-info';

  const name = document.createElement('div');
  name.className = 'manage-item-name';
  name.textContent = employee.firstName + ' ' + employee.lastName;
  info.appendChild(name);

  const slug = document.createElement('div');
  slug.className = 'manage-item-slug';
  slug.textContent = 'Slug: ' + employee.slug;
  info.appendChild(slug);

  const title = document.createElement('div');
  title.style.fontSize = '0.9rem';
  title.style.color = '#666';
  title.style.marginTop = '4px';
  title.textContent = employee.title + ' • ' + employee.department;
  info.appendChild(title);

  item.appendChild(info);

  const actions = document.createElement('div');
  actions.className = 'manage-item-actions';

  const viewBtn = document.createElement('a');
  viewBtn.href = buildProfileUrl(employee.slug);
  viewBtn.className = 'btn-secondary';
  viewBtn.style.display = 'inline-block';
  viewBtn.textContent = 'View Profile';
  actions.appendChild(viewBtn);

  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn-secondary';
  removeBtn.textContent = 'Remove Instructions';
  removeBtn.addEventListener('click', function() {
    showRemoveInstructions(employee.slug);
  });
  actions.appendChild(removeBtn);

  item.appendChild(actions);

  const instructionsDiv = document.createElement('div');
  instructionsDiv.className = 'instructions-panel';
  instructionsDiv.style.display = 'none';
  instructionsDiv.style.marginTop = '15px';
  instructionsDiv.innerHTML = 
    '<strong>To remove ' + employee.firstName + ' ' + employee.lastName + ':</strong><br><br>' +
    '<ol style="margin-left: 20px;">' +
    '<li>Delete the folder <code>/employee-cards/' + employee.slug + '/</code> from GitHub Pages.</li>' +
    '<li>Remove <code>"' + employee.slug + '"</code> from the <code>EMPLOYEE_SLUGS</code> array in <code>main.js</code>.</li>' +
    '<li>Commit and push your changes.</li>' +
    '</ol>';

  item.appendChild(instructionsDiv);

  removeBtn.addEventListener('click', function() {
    instructionsDiv.style.display = instructionsDiv.style.display === 'none' ? 'block' : 'none';
  });

  return item;
}

function showRemoveInstructions(slug) {
  // Instructions are shown inline in manage item
}

function showManageEmpty() {
  const loadingMessage = document.getElementById('loadingMessage');
  const employeeListContainer = document.getElementById('employeeListContainer');
  const emptyMessage = document.getElementById('emptyMessage');

  if (loadingMessage) loadingMessage.style.display = 'none';
  if (employeeListContainer) employeeListContainer.style.display = 'none';
  if (emptyMessage) emptyMessage.style.display = 'block';
}

// ===========================
// Page Initialization
// ===========================

document.addEventListener('DOMContentLoaded', function() {
  // Detect current page and initialize accordingly
  const path = window.location.pathname;

  if (path.includes('index.html') || path.endsWith('/employee-cards/')) {
    initFormPage();
  } else if (path.includes('directory.html')) {
    initDirectoryPage();
  } else if (path.includes('profile.html')) {
    initProfilePage();
  } else if (path.includes('manage.html')) {
    initManagePage();
  }
});







