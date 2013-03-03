<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/books', 'getbooks');
$app->get('/books/:id',	'getbook');
$app->get('/books/search/:query', 'findByName');
$app->post('/books', 'addbook');
$app->put('/books/:id', 'updatebook');
$app->delete('/books/:id',	'deletebook');

$app->run();

function getbooks() {
	$sql = "select * FROM book ORDER BY name";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$books = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		// echo '{"book": ' . json_encode($books) . '}';
		echo json_encode($books);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getbook($id) {
	$sql = "SELECT * FROM book WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$book = $stmt->fetchObject();  
		$db = null;
		echo json_encode($book); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addbook() {
	error_log('addbook\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
	$book = json_decode($request->getBody());
	$sql = "INSERT INTO book (name, author) VALUES (:name, :author)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $book->name);
		$stmt->bindParam("author", $book->author);
		$stmt->execute();
		$book->id = $db->lastInsertId();
		$db = null;
		echo json_encode($book); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updatebook($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$book = json_decode($body);
	$sql = "UPDATE book SET name=:name, author=:author WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $book->name);
		$stmt->bindParam("author", $book->author);
		$stmt->execute();
		$db = null;
		echo json_encode($book); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deletebook($id) {
	$sql = "DELETE FROM book WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function findByName($query) {
	$sql = "SELECT * FROM book WHERE UPPER(name) LIKE :query ORDER BY name";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$books = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($books);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getConnection() {
	$dbhost="127.0.0.1";
	$dbuser="root";
	$dbpass="pikachu";
	$dbname="cellar";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>
