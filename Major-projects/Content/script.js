document.addEventListener('DOMContentLoaded', function() {
    const folderForm = document.getElementById('folderForm');
    const contentForm = document.getElementById('contentForm');
    const editContentForm = document.getElementById('editContentForm');
    const folderList = document.getElementById('folderList');
    const contentList = document.getElementById('contentList');
    const contentFolder = document.getElementById('contentFolder');
    const editContentFolder = document.getElementById('editContentFolder');

    let folders = [];
    let editContentIndex = null;
    let editFolderName = null;

    folderForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const folderName = document.getElementById('folderName').value;

        const newFolder = {
            name: folderName,
            contents: []
        };

        folders.push(newFolder);
        updateFolderList();
        updateContentFolderOptions();

        $('#newFolderModal').modal('hide');
        folderForm.reset();
    });

    contentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('contentTitle').value;
        const body = document.getElementById('contentBody').value;
        const folderName = document.getElementById('contentFolder').value;
        const file = document.getElementById('contentFile').files[0];

        const newContent = {
            title: title,
            body: body,
            file: file ? URL.createObjectURL(file) : null,
            fileType: file ? file.type : null
        };

        const folder = folders.find(f => f.name === folderName);
        folder.contents.push(newContent);
        updateContentList(folder.contents);

        $('#newContentModal').modal('hide');
        contentForm.reset();
    });

    editContentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('editContentTitle').value;
        const body = document.getElementById('editContentBody').value;
        const folderName = document.getElementById('editContentFolder').value;
        const file = document.getElementById('editContentFile').files[0];

        const updatedContent = {
            title: title,
            body: body,
            file: file ? URL.createObjectURL(file) : null,
            fileType: file ? file.type : null
        };

        const folder = folders.find(f => f.name === editFolderName);
        folder.contents[editContentIndex] = updatedContent;
        updateContentList(folder.contents);

        $('#editContentModal').modal('hide');
        editContentForm.reset();
    });

    folderList.addEventListener('click', function(event) {
        const folderName = event.target.getAttribute('data-folder');
        if (folderName) {
            const folder = folders.find(f => f.name === folderName);
            updateContentList(folder.contents);
        }
    });

    contentList.addEventListener('click', function(event) {
        const contentIndex = event.target.getAttribute('data-index');
        const folderName = event.target.getAttribute('data-folder');
        const action = event.target.getAttribute('data-action');

        if (contentIndex !== null && folderName && action) {
            const folder = folders.find(f => f.name === folderName);

            if (action === 'edit') {
                editContentIndex = contentIndex;
                editFolderName = folderName;

                const content = folder.contents[contentIndex];
                document.getElementById('editContentTitle').value = content.title;
                document.getElementById('editContentBody').value = content.body;
                updateEditContentFolderOptions();
                document.getElementById('editContentFolder').value = folderName;

                $('#editContentModal').modal('show');
            } else if (action === 'delete') {
                folder.contents.splice(contentIndex, 1);
                updateContentList(folder.contents);
            }
        }
    });

    function updateFolderList() {
        folderList.innerHTML = folders.map(folder => `
            <a href="#" class="list-group-item list-group-item-action" data-folder="${folder.name}">${folder.name}</a>
        `).join('');
    }

    function updateContentFolderOptions() {
        contentFolder.innerHTML = folders.map(folder => `
            <option value="${folder.name}">${folder.name}</option>
        `).join('');
    }

    function updateEditContentFolderOptions() {
        editContentFolder.innerHTML = folders.map(folder => `
            <option value="${folder.name}">${folder.name}</option>
        `).join('');
    }

    function updateContentList(contents) {
        contentList.innerHTML = contents.map((content, index) => `
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${content.title}</h5>
                        <p class="card-text">${content.body}</p>
                        ${content.file ? getContentFileHtml(content) : ''}
                        <div class="card-actions">
                            <button class="btn btn-primary btn-sm" data-action="edit" data-folder="${editFolderName}" data-index="${index}">Edit</button>
                            <button class="btn btn-danger btn-sm" data-action="delete" data-folder="${editFolderName}" data-index="${index}">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function getContentFileHtml(content) {
        if (content.fileType.startsWith('image/')) {
            return `<img src="${content.file}" class="img-fluid" alt="Content Image">`;
        } else if (content.fileType.startsWith('video/')) {
            return `<video controls class="img-fluid"><source src="${content.file}" type="${content.fileType}"></video>`;
        } else if (content.fileType === 'application/pdf') {
            return `<a href="${content.file}" target="_blank" class="btn btn-primary">View PDF</a>`;
        } else {
            return '';
        }
    }
});
