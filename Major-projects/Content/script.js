document.getElementById('add-content-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('content-title').value;
    const body = document.getElementById('content-body').value;

    fetch('backend.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'add', title: title, body: body })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadContent();
            document.getElementById('add-content-form').reset();
        } else {
            alert('Error adding content');
        }
    });
});

function loadContent() {
    fetch('backend.php?action=list')
        .then(response => response.json())
        .then(data => {
            const adminContentList = document.getElementById('admin-content-list');
            const userContentList = document.getElementById('user-content-list');
            adminContentList.innerHTML = '';
            userContentList.innerHTML = '';
            
            data.content.forEach(item => {
                const contentItem = document.createElement('div');
                contentItem.className = 'content-item';
                contentItem.innerHTML = `
                    <h4>${item.title}</h4>
                    <p>${item.body}</p>
                    <button onclick="editContent(${item.id})">Edit</button>
                    <button onclick="deleteContent(${item.id})">Delete</button>
                `;
                adminContentList.appendChild(contentItem);
                userContentList.appendChild(contentItem.cloneNode(true));
            });
        });
}

function editContent(id) {
    const newTitle = prompt('Enter new title:');
    const newBody = prompt('Enter new content:');
    if (newTitle && newBody) {
        fetch('backend.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'edit', id: id, title: newTitle, body: newBody })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadContent();
            } else {
                alert('Error editing content');
            }
        });
    }
}

function deleteContent(id) {
    if (confirm('Are you sure you want to delete this content?')) {
        fetch('backend.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'delete', id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadContent();
            } else {
                alert('Error deleting content');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', loadContent);
