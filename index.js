const fs = require('fs');
const path = require('path');
const express = require('express'); // Add this module to create a server
const he = require('he'); // Add this module to encode and decode HTML entities
const bodyParser = require('body-parser'); // Add this module to parse and limit request body

// Base URL of the website, without trailing slash.
const base_url = '/proxy/8080';

// Path to the directory to save the notes in, without trailing slash.
// Should be outside the document root, if possible.
const save_path = '_tmp';

// Path to the directory to serve the static files from public folder, without trailing slash.
const public_path = path.join(__dirname, 'public');

// Create an express app.
const app = express();

// Use body-parser middleware to parse and limit request body.
app.use(bodyParser.text({limit: '10mb'})); // Limit the request size to 10MB
app.use(bodyParser.json())
// app.use(express.urlencoded()) // body-parser deprecated extended
app.use(bodyParser.urlencoded({ extended: true })); // for JS from application/x-www-form-urlencoded;

// Use express.static middleware to serve static files from public directory.
app.use('/public', express.static('public'));

// Add Homepage route, reponspnse random note url for new note
app.get('/', (req, res) => {
    const randomNoteName = '234579abcdefghjkmnpqrstwxyz'.split('').sort(() => Math.random() - 0.5).slice(-5).join('');
    res.redirect(base_url + '/' + randomNoteName);
});

// Define a route for notes.
app.get('/:note', (req, res) => {

    // Disable caching.
    res.setHeader('Cache-Control', 'no-store');

    // Get the note name from the request parameter.
    let noteName = req.params.note;

    // If no note name is provided, or if the name is too long, or if it contains invalid characters, or if it is reserved for public directory.
    if (!noteName || noteName.length > 64 || !/^[a-zA-Z0-9_-]+$/.test(noteName) || noteName === 'public') {

        // Generate a name with 5 random unambiguous characters. Redirect to it.
        res.redirect(base_url + '/' + '234579abcdefghjkmnpqrstwxyz'.split('').sort(() => Math.random() - 0.5).slice(-5).join(''));
        return;
    }

    // Normalize and encode the note name to prevent path traversal attacks.
    noteName = encodeURIComponent(path.basename(path.normalize(noteName)));

    let filePath = save_path + '/' + noteName;

    // Print raw file when explicitly requested, or if the client is curl or wget.
    if (req.query.raw || req.headers['user-agent'].startsWith('curl') || req.headers['user-agent'].startsWith('Wget')) {
        // Check if the file exists.
        fs.access(filePath, fs.constants.F_OK, err => {
            if (err) {
                // If not, send a 404 response.
                res.status(404).end();
            } else {
                // If yes, send the file content as plain text.
                res.type('text/plain');
                fs.createReadStream(filePath).pipe(res);
            }
        });
        return;
    }

    // Otherwise, send the HTML page with the note content.
    res.type('text/html');
    res.write(`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${noteName}</title>
    <link rel="icon" href="${base_url}/public/favicon.ico" sizes="any">
    <link rel="icon" href="${base_url}/public/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="${base_url}/public/styles.css">
</head>
<body>
    <div class="container">
        <textarea id="content">`);

    // Check if the file exists.
    fs.access(filePath, fs.constants.F_OK, err => {
        if (!err) {
            // If yes, read the file content and decode it from HTML entities using he module.
            let content = fs.readFileSync(filePath, 'utf8');
            content = he.decode(content);
            res.write(content);
        }
        res.end(`</textarea>
    </div>
    <pre id="printable"></pre>
    <script src="${base_url}/public/script.js"></script>
</body>
</html>`);
    });
});

app.post('/:note', (req, res) => {

    // Disable caching.
    res.setHeader('Cache-Control', 'no-store');

    // Get the note name from the request parameter.
    let noteName = req.params.note;

    // If no note name is provided, or if the name is too long, or if it contains invalid characters, or if it is reserved for public directory.
    if (!noteName || noteName.length > 64 || !/^[a-zA-Z0-9_-]+$/.test(noteName) || noteName === 'public') {

        // Generate a name with 5 random unambiguous characters. Redirect to it.
        res.redirect(base_url + '/' + '234579abcdefghjkmnpqrstwxyz'.split('').sort(() => Math.random() - 0.5).slice(-5).join(''));
        return;
    }

    // Normalize and encode the note name to prevent path traversal attacks.
    noteName = encodeURIComponent(path.basename(path.normalize(noteName)));

    let filePath = save_path + '/' + noteName;

    let text = req.body; // Get the data from the request body.
    // Get the data from the request $_POST['text'] body text.
    
    // console.log('req.body:', req.body)

    // If the data is empty, delete the file.
    if (!text || !text.text || !text.text.length) {
        // remove file
        fs.unlink(filePath, err => {
            if (err) {
                console.error(err);
            }
        });
    } else {
        // Encode the data to HTML entities using he module.
        text = he.encode(text.text, {
            useNamedReferences: true // Use named references for HTML entities, e.g. & instead of &
        });
        // Write the encoded data to the file.
        fs.writeFile(filePath, text, err => {
            if (err) {
                console.error(err);
            }
        });
    }
    res.end();
    return;

});

// Listen on port 8080.
app.listen(8080);
