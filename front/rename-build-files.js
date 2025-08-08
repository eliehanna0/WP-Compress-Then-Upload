const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');
const jsDir = path.join(buildDir, 'static', 'js');
const cssDir = path.join(buildDir, 'static', 'css');

// Function to rename files
function renameFiles(directory, extension) {
    if (!fs.existsSync(directory)) {
        return;
    }

    const files = fs.readdirSync(directory);
    const targetFile = files.find(file => file.includes(`main.`) && file.endsWith(extension));

    if (targetFile) {
        const oldPath = path.join(directory, targetFile);
        const newPath = path.join(directory, `main${extension}`);

        try {
            // If the new file already exists and is the same as the old file, skip
            if (fs.existsSync(newPath)) {
                const oldStats = fs.statSync(oldPath);
                const newStats = fs.statSync(newPath);
                
                if (oldStats.size === newStats.size && oldStats.mtimeMs === newStats.mtimeMs) {
                    return;
                }
                fs.unlinkSync(newPath);
            }
            
            fs.renameSync(oldPath, newPath);
            console.log(`✅ Updated ${path.basename(newPath)}`);
        } catch (error) {
            console.error(`❌ Error processing ${targetFile}:`, error.message);
        }
    }
}

// Process both file types
renameFiles(jsDir, '.js');
renameFiles(cssDir, '.css');