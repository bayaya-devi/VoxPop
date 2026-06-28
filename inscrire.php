<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Accès interdit.");
}

$nom = trim($_POST["nom"]);
$prenom = trim($_POST["prenom"]);
$nomch = trim($_POST["nomch"]);
$email = trim($_POST["email"]);
$pass = $_POST["password"];
$pass2 = $_POST["password_confirm"];

if ($pass !== $pass2) {
    die("Les mots de passe ne correspondent pas.");
}

$hash = password_hash($pass, PASSWORD_DEFAULT);

$host = "localhost";
$user = "root";
$pwd = ""; 
$db = "voxpop";

$conn = new mysqli($host, $user, $pwd, $db);

if ($conn->connect_error) {
    die("Erreur connexion : " . $conn->connect_error);
}

$sql = "SELECT id FROM utilisateurs WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    die("Cet email est déjà utilisé.");
}

$stmt->close();

$sql = "INSERT INTO utilisateurs (nom, prenom, nom_chaine, email, mot_de_passe) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $nom, $prenom, $nomch, $email, $hash);

if ($stmt->execute()) {
    echo "Inscription réussie !";
    $stmt->close();
    $conn->close();
} else {
    die("Erreur : " . $stmt->error);
}
?>