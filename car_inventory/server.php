<?php
include "config.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM cars");
    if ($result) {
        $autos = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($autos);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener la lista de autos']);
    }
}


elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $marca = $data['marca'];
    $modelo = $data['modelo'];
    $ano = $data['ano'];

    $result = $conn->query("INSERT INTO cars (marca, modelo, ano) VALUES ('$marca', '$modelo', $ano)");

    if ($result) {
        echo json_encode(['message' => 'Auto agregado con éxito']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al agregar el auto']);
    }
}


elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'];
    $marca = $input['marca'];
    $modelo = $input['modelo'];
    $ano = $input['ano'];

    $result = $conn->query("UPDATE cars SET marca='$marca', modelo='$modelo', ano=$ano WHERE id=$id");

    if ($result) {
        echo json_encode(['message' => 'Auto actualizado con éxito']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al actualizar el auto']);
    }
}


elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'];
    $result = $conn->query("DELETE FROM cars WHERE id=$id");

    if ($result) {
        echo json_encode(['message' => 'Auto eliminado con éxito']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al eliminar el auto']);
    }
}

else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}

$conn->close();
?>

