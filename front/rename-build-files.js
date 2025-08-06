const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');
const jsDir = path.join(buildDir, 'static', 'js');
const cssDir = path.join(buildDir, 'static', 'css');

// Function to rename files
function renameFiles(directory, extension) {
    if (!fs.existsSync(directory)) {
        console.log(`Directory ${directory} does not exist`);
        return;
    }

    const files = fs.readdirSync(directory);
    const targetFile = files.find(file => file.includes(`main.`) && file.endsWith(extension));

    if (targetFile) {
        const oldPath = path.join(directory, targetFile);
        const newPath = path.join(directory, `main${extension}`);

        try {
            fs.renameSync(oldPath, newPath);
            console.log(`Renamed ${targetFile} to main${extension}`);
        } catch (error) {
            console.error(`Error renaming ${targetFile}:`, error);
        }
    } else {
        console.log(`No main file found in ${directory}`);
    }
}

// Rename JS and CSS files
renameFiles(jsDir, '.js');
renameFiles(cssDir, '.css');

console.log('Build files renamed successfully!'); 