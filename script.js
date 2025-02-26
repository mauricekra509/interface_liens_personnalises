document.addEventListener("DOMContentLoaded", loadFolders);

let folders = JSON.parse(localStorage.getItem("folders")) || {};

function saveFolders() {
    localStorage.setItem("folders", JSON.stringify(folders));
    loadFolders();
}

function loadFolders() {
    const container = document.getElementById("folders-container");
    container.innerHTML = "";
    Object.keys(folders).forEach(folderName => {
        const folderDiv = document.createElement("div");
        folderDiv.className = "folder";
        folderDiv.innerHTML = `
            <span onclick="toggleFolder('${folderName}')">${folderName}</span>
            <div class="folder-options">
                <button onclick="renameFolder('${folderName}')">✏️</button>
                <button onclick="deleteFolder('${folderName}')">🗑️</button>
                <button onclick="addLink('${folderName}')">+🔗</button>
            </div>
            <div class="links" id="links-${folderName}" style="display:none;"></div>
        `;
        container.appendChild(folderDiv);
        loadLinks(folderName);
    });
}

function addFolder() {
    const folderName = prompt("Nom du dossier ?");
    if (folderName && !folders[folderName]) {
        folders[folderName] = [];
        saveFolders();
    }
}

function renameFolder(oldName) {
    const newName = prompt("Nouveau nom du dossier ?", oldName);
    if (newName && newName !== oldName) {
        folders[newName] = folders[oldName];
        delete folders[oldName];
        saveFolders();
    }
}

function deleteFolder(folderName) {
    if (confirm(`Supprimer le dossier "${folderName}" ?`)) {
        delete folders[folderName];
        saveFolders();
    }
}

function toggleFolder(folderName) {
    const linksDiv = document.getElementById(`links-${folderName}`);
    linksDiv.style.display = linksDiv.style.display === "none" ? "block" : "none";
}

function loadLinks(folderName) {
    const linksDiv = document.getElementById(`links-${folderName}`);
    linksDiv.innerHTML = "";
    folders[folderName].forEach((link, index) => {
        const linkDiv = document.createElement("div");
        linkDiv.className = "link";
        linkDiv.innerHTML = `
            <a href="${link.url}" target="_blank">${link.name}</a>
            <button onclick="renameLink('${folderName}', ${index})">✏️</button>
            <button onclick="deleteLink('${folderName}', ${index})">🗑️</button>
        `;
        linksDiv.appendChild(linkDiv);
    });
}

function addLink(folderName) {
    const url = prompt("Entrez le lien URL :");
    const name = prompt("Nom personnalisé du lien :");
    if (url && name) {
        folders[folderName].push({ name, url });
        saveFolders();
    }
}

function renameLink(folderName, index) {
    const newName = prompt("Nouveau nom du lien ?", folders[folderName][index].name);
    if (newName) {
        folders[folderName][index].name = newName;
        saveFolders();
    }
}

function deleteLink(folderName, index) {
    if (confirm("Supprimer ce lien ?")) {
        folders[folderName].splice(index, 1);
        saveFolders();
    }
}
