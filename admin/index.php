<?php
// Verificación básica de seguridad
if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW']) || 
    $_SERVER['PHP_AUTH_USER'] !== 'admin' || $_SERVER['PHP_AUTH_PW'] !== 'admin123') {
    header('WWW-Authenticate: Basic realm="Àrea d\'administració"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Accés denegat';
    exit;
}

$archivo_comentarios = __DIR__ . '/../data/comentaris.json';
$comentarios = [];

// Cargar comentarios
if (file_exists($archivo_comentarios)) {
    $contenido = file_get_contents($archivo_comentarios);
    $datos = json_decode($contenido, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        $comentarios = $datos['comentarios'] ?? [];
    }
}

// Procesar acciones
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['accion'])) {
    if ($_POST['accion'] === 'canviar_estat' && isset($_POST['id'], $_POST['estat'])) {
        foreach ($comentarios as &$comentario) {
            if ($comentario['id'] == $_POST['id']) {
                $comentario['estat'] = $_POST['estat'];
                break;
            }
        }
        file_put_contents($archivo_comentarios, json_encode(['comentarios' => $comentarios], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit;
    } elseif ($_POST['accion'] === 'eliminar' && isset($_POST['id'])) {
        $comentarios = array_filter($comentarios, function($c) {
            return $c['id'] != $_POST['id'];
        });
        file_put_contents($archivo_comentarios, json_encode(['comentarios' => array_values($comentarios)], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit;
    }
}

// Filtrar por tipo
$tipus = $_GET['tipus'] ?? 'tots';
$comentarios_filtrados = $comentarios;
if ($tipus !== 'tots') {
    $comentarios_filtrados = array_filter($comentarios, function($c) use ($tipus) {
        return $c['tipus'] === $tipus;
    });
}
?>
<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administració de Comentaris - Crep Nova</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #00A482;
            text-align: center;
            margin-bottom: 30px;
        }
        .filtres {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .filtres a {
            display: inline-block;
            padding: 5px 15px;
            background: #f0f0f0;
            border-radius: 20px;
            text-decoration: none;
            color: #333;
            transition: all 0.3s;
        }
        .filtres a.actiu {
            background: #00A482;
            color: white;
        }
        .comentari {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            position: relative;
        }
        .comentari-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            flex-wrap: wrap;
            gap: 10px;
        }
        .comentari-tipus {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 500;
            text-transform: uppercase;
        }
        .consulta { background-color: #e3f2fd; color: #1565c0; }
        .resenya { background-color: #e8f5e9; color: #2e7d32; }
        .suggeriment { background-color: #fff3e0; color: #ef6c00; }
        .altres { background-color: #f3e5f5; color: #7b1fa2; }
        .comentari-data {
            color: #777;
            font-size: 0.9em;
        }
        .comentari-email {
            color: #00A482;
            text-decoration: none;
        }
        .comentari-email:hover {
            text-decoration: underline;
        }
        .comentari-missatge {
            margin: 10px 0;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
        }
        .comentari-puntuacio {
            color: #ffc107;
            font-size: 1.2em;
            letter-spacing: 3px;
        }
        .comentari-accions {
            margin-top: 10px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .btn {
            padding: 5px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
            transition: all 0.3s;
        }
        .btn-resolt {
            background-color: #4caf50;
            color: white;
        }
        .btn-pendent {
            background-color: #ff9800;
            color: white;
        }
        .btn-eliminar {
            background-color: #f44336;
            color: white;
        }
        .btn-respondre {
            background-color: #2196f3;
            color: white;
        }
        .btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        .estat {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 0.8em;
            font-weight: 500;
        }
        .pendent { background-color: #fff3e0; color: #f57c00; }
        .respost { background-color: #e8f5e9; color: #2e7d32; }
        @media (max-width: 768px) {
            .comentari-header {
                flex-direction: column;
            }
            .container {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Administració de Comentaris</h1>
        
        <div class="filtres">
            <a href="?tipus=tots" class="<?= $tipus === 'tots' ? 'actiu' : '' ?>">Tots (<?= count($comentarios) ?>)</a>
            <a href="?tipus=consulta" class="<?= $tipus === 'consulta' ? 'actiu' : '' ?>">Consultes (<?= count(array_filter($comentarios, fn($c) => $c['tipus'] === 'consulta')) ?>)</a>
            <a href="?tipus=resenya" class="<?= $tipus === 'resenya' ? 'actiu' : '' ?>">Valoracions (<?= count(array_filter($comentarios, fn($c) => $c['tipus'] === 'resenya')) ?>)</a>
            <a href="?tipus=suggeriment" class="<?= $tipus === 'suggeriment' ? 'actiu' : '' ?>">Suggeriments (<?= count(array_filter($comentarios, fn($c) => $c['tipus'] === 'suggeriment')) ?>)</a>
            <a href="?tipus=altres" class="<?= $tipus === 'altres' ? 'actiu' : '' ?>">Altres (<?= count(array_filter($comentarios, fn($c) => $c['tipus'] === 'altres')) ?>)</a>
        </div>

        <?php if (empty($comentarios_filtrados)): ?>
            <p>No hi ha comentaris per mostrar.</p>
        <?php else: ?>
            <?php foreach (array_reverse($comentarios_filtrados) as $comentario): ?>
                <div class="comentari">
                    <div class="comentari-header">
                        <div>
                            <strong><?= htmlspecialchars($comentario['nom']) ?></strong>
                            <span class="comentari-tipus <?= $comentario['tipus'] ?>">
                                <?= ucfirst($comentario['tipus']) ?>
                            </span>
                            <span class="estat <?= $comentario['estat'] ?>">
                                <?= ucfirst($comentario['estat']) ?>
                            </span>
                        </div>
                        <div class="comentari-data">
                            <?= date('d/m/Y H:i', strtotime($comentario['data'])) ?>
                        </div>
                    </div>
                    
                    <div class="comentari-email">
                        <?= htmlspecialchars($comentario['email']) ?>
                    </div>
                    
                    <?php if ($comentario['puntuacio'] > 0): ?>
                        <div class="comentari-puntuacio">
                            <?= str_repeat('★', $comentario['puntuacio']) . str_repeat('☆', 5 - $comentario['puntuacio']) ?>
                        </div>
                    <?php endif; ?>
                    
                    <div class="comentari-missatge">
                        <?= nl2br(htmlspecialchars($comentario['missatge'])) ?>
                    </div>
                    
                    <div class="comentari-accions
                        <form method="post" style="display: inline;">
                            <input type="hidden" name="id" value="<?= $comentario['id'] ?>">
                            <?php if ($comentario['estat'] === 'pendent'): ?>
                                <button type="submit" name="accion" value="canviar_estat" class="btn btn-resolt">
                                    Marcar com a respost
                                </button>
                                <input type="hidden" name="estat" value="respost">
                            <?php else: ?>
                                <button type="submit" name="accion" value="canviar_estat" class="btn btn-pendent">
                                    Marcar com a pendent
                                </button>
                                <input type="hidden" name="estat" value="pendent">
                            <?php endif; ?>
                        </form>
                        
                        <form method="post" style="display: inline;" onsubmit="return confirm('Estàs segur que vols eliminar aquest comentari?');">
                            <input type="hidden" name="id" value="<?= $comentario['id'] ?>">
                            <button type="submit" name="accion" value="eliminar" class="btn btn-eliminar">
                                Eliminar
                            </button>
                        </form>
                        
                        <a href="mailto:<?= htmlspecialchars($comentario['email']) ?>?subject=Resposta%20a%20el%20teu%20<?= urlencode($comentario['tipus']) ?>" class="btn btn-respondre">
                            Respondre per correu
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</body>
</html>
