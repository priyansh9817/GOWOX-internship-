<?php
$dsn = 'mysql:host=localhost;dbname=cms';
$username = 'root';
$password = '';

try {
    $db = new PDO($dsn, $username, $password);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
    exit;
}

$action = $_GET['action'] ?? null;
$input = json_decode(file_get_contents('php://input'), true);

if ($action === 'add' && $input) {
    $stmt = $db->prepare("INSERT INTO content (title, body) VALUES (:title, :body)");
    $stmt->bindParam(':title', $input['title']);
    $stmt->bindParam(':body', $input['body']);
    $stmt->execute();
    echo json_encode(['success' => true]);
} elseif ($action === 'list') {
    $stmt = $db->query("SELECT * FROM content");
    $content = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['content' => $content]);
} elseif ($action === 'edit' && $input) {
    $stmt = $db->prepare("UPDATE content SET title = :title, body = :body WHERE id = :id");
    $stmt->bindParam(':title', $input['title']);
    $stmt->bindParam(':body', $input['body']);
    $stmt->bindParam(':id', $input['id']);
    $stmt->execute();
    echo json_encode(['success' => true]);
} elseif ($action === 'delete' && $input) {
    $stmt = $db->prepare("DELETE FROM content WHERE id = :id");
    $stmt->bindParam(':id', $input['id']);
    $stmt->execute();
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>
